import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchConversations, fetchHistory, markConversationRead } from '../services/chatApi'
import { createChatClient } from '../services/realtime/chatClient'
import { getLastTimestamp, getStoredProtocol, setLastTimestamp, storeProtocol } from '../services/session'
import { newId } from '../utils/id'
import { formatClock } from '../utils/time'
import { useAuth } from './authContext'
import { STATUS_RANK, mergeMessages, toUiConversation, toUiMessage, upsertConversation } from './chatHelpers'
import { ChatContext } from './chatContext'

const ACK_TIMEOUT_MS = 8000 // no ACK from the server after this long = "failed"

// ---------- the provider ----------

// Remounts the session whenever a different user logs in, so nobody sees someone else's chats.
export default function ChatProvider({ children }) {
  const { username } = useAuth()
  return <ChatSession key={username ?? 'anonymous'}>{children}</ChatSession>
}

function ChatSession({ children }) {
  const { token, username } = useAuth()
  const [connection, setConnection] = useState('connecting')
  const [protocol, setProtocolState] = useState(getStoredProtocol)
  const [conversations, setConversations] = useState([])
  const [conversationsStatus, setConversationsStatus] = useState('loading') // loading | ready | error
  const [messagesByPeer, setMessagesByPeer] = useState({}) // { friend: [message, ...] }
  const [historyStatus, setHistoryStatus] = useState({}) // { friend: 'loading' | 'ready' | 'error' }

  const clientRef = useRef(null)
  const activePeerRef = useRef(null) // the chat that is open right now
  const pendingRef = useRef(new Map()) // sent but not yet acknowledged: id -> { peer, text }
  const ackTimersRef = useRef(new Map())
  const seenIdsRef = useRef(new Set()) // ids of messages received live (to ignore repeats)
  const reloadTimerRef = useRef(null)

  // ----- conversations list -----

  const loadConversations = useCallback(async () => {
    try {
      const list = await fetchConversations()
      setConversations(list.map(toUiConversation))
      setConversationsStatus('ready')
    } catch {
      // keep showing the list we already have if a background refresh fails
      setConversationsStatus((s) => (s === 'ready' ? s : 'error'))
    }
  }, [])

  const reloadConversations = useCallback(() => {
    setConversationsStatus('loading')
    loadConversations()
  }, [loadConversations])

  const scheduleConversationsReload = useCallback(() => {
    clearTimeout(reloadTimerRef.current)
    reloadTimerRef.current = setTimeout(loadConversations, 300)
  }, [loadConversations])

  // ----- message helpers -----

  const patchMessage = useCallback((peer, id, patch) => {
    setMessagesByPeer((prev) => {
      const list = prev[peer]
      if (!list) return prev
      return { ...prev, [peer]: list.map((m) => (m.id === id ? { ...m, ...patch(m) } : m)) }
    })
  }, [])

  // Moves a message forward (sending -> sent -> delivered), never backwards.
  const advance = useCallback((peer, id, status, timestamp) => {
    patchMessage(peer, id, (m) =>
      STATUS_RANK[status] > (STATUS_RANK[m.status] ?? -1)
        ? { status, ...(timestamp && m.timestamp == null ? { timestamp } : {}) }
        : {}
    )
  }, [patchMessage])

  const markAllDelivered = useCallback((peer) => {
    setMessagesByPeer((prev) => {
      const list = prev[peer]
      if (!list) return prev
      return {
        ...prev,
        [peer]: list.map((m) => (m.from === 'me' && m.status === 'sent' ? { ...m, status: 'delivered' } : m)),
      }
    })
  }, [])

  const markRead = useCallback((peer) => {
    setConversations((prev) => prev.map((c) => (c.id === peer ? { ...c, unread: 0 } : c)))
    // best effort: the server then tells the friend that we read their messages
    markConversationRead(peer).catch(() => {})
  }, [])

  // ----- history of one chat -----

  const loadHistory = useCallback(async (peer) => {
    try {
      const list = await fetchHistory(peer, 0)
      const ui = list.map((m) => toUiMessage(m, username))
      const newest = Math.max(0, ...ui.filter((m) => m.from === 'them').map((m) => m.timestamp))
      if (newest > getLastTimestamp(username)) setLastTimestamp(username, newest)
      setMessagesByPeer((prev) => ({ ...prev, [peer]: mergeMessages(prev[peer] ?? [], ui) }))
      setHistoryStatus((prev) => ({ ...prev, [peer]: 'ready' }))
    } catch {
      setHistoryStatus((prev) => ({ ...prev, [peer]: prev[peer] === 'ready' ? 'ready' : 'error' }))
    }
  }, [username])

  const openChat = useCallback((peer) => {
    activePeerRef.current = peer
    setHistoryStatus((prev) => ({ ...prev, [peer]: prev[peer] ?? 'loading' }))
    loadHistory(peer)
    markRead(peer)
  }, [loadHistory, markRead])

  const closeChat = useCallback((peer) => {
    if (activePeerRef.current === peer) activePeerRef.current = null
  }, [])

  const reloadHistory = useCallback((peer) => {
    setHistoryStatus((prev) => ({ ...prev, [peer]: 'loading' }))
    loadHistory(peer)
  }, [loadHistory])

  // ----- sending -----

  // Sends a message over the live connection. If we are offline this does nothing and
  // the message stays "sending" until handleOnline() sends it again.
  const transmit = useCallback((id, peer, text) => {
    if (!clientRef.current?.sendChat(id, peer, text)) return
    clearTimeout(ackTimersRef.current.get(id))
    ackTimersRef.current.set(id, setTimeout(() => {
      patchMessage(peer, id, (m) => (m.status === 'sending' ? { status: 'failed' } : {}))
    }, ACK_TIMEOUT_MS))
  }, [patchMessage])

  const sendMessage = useCallback((peer, text) => {
    const id = newId() // the server uses this id to ignore duplicates if we ever send it twice
    pendingRef.current.set(id, { peer, text })
    const message = { id, from: 'me', text, timestamp: null, time: formatClock(Date.now()), status: 'sending' }
    setMessagesByPeer((prev) => ({ ...prev, [peer]: [...(prev[peer] ?? []), message] }))
    setConversations((prev) =>
      upsertConversation(prev, { friend: peer, lastMessage: text, timestamp: Date.now(), resetUnread: true })
    )
    transmit(id, peer, text)
  }, [transmit])

  // ----- incoming -----

  const receiveMessage = useCallback((msg) => {
    if (seenIdsRef.current.has(msg.id)) return // already handled (e.g. sent again as SYNC)
    seenIdsRef.current.add(msg.id)

    const peer = msg.from
    if (msg.timestamp > getLastTimestamp(username)) setLastTimestamp(username, msg.timestamp)
    setMessagesByPeer((prev) => ({ ...prev, [peer]: mergeMessages(prev[peer] ?? [], [toUiMessage(msg, username)]) }))
    clientRef.current?.sendDelivered(msg.id) // lets the sender see the green check

    if (msg.type === 'CHAT') {
      const isOpen = activePeerRef.current === peer
      setConversations((prev) =>
        upsertConversation(prev, {
          friend: peer, lastMessage: msg.body, timestamp: msg.timestamp, unreadDelta: isOpen ? 0 : 1,
        })
      )
      if (isOpen) markRead(peer)
    } else {
      // SYNC: let the server's numbers (last message, unread) replace our local guess
      scheduleConversationsReload()
    }
  }, [username, markRead, scheduleConversationsReload])

  const handleMessage = useCallback((msg) => {
    switch (msg.type) {
      case 'CHAT':
      case 'SYNC':
        receiveMessage(msg)
        break
      case 'ACK': {
        // body = id of the message the server accepted
        const pending = pendingRef.current.get(msg.body)
        if (!pending) break
        pendingRef.current.delete(msg.body)
        clearTimeout(ackTimersRef.current.get(msg.body))
        ackTimersRef.current.delete(msg.body)
        advance(pending.peer, msg.body, 'sent', msg.timestamp)
        break
      }
      case 'DELIVERED':
        // body = id of our message that the friend received
        advance(msg.from, msg.body, 'delivered')
        break
      case 'READ':
        // the friend opened the chat
        markAllDelivered(msg.from)
        break
      case 'ERROR':
        console.warn('Server error:', msg.body)
        break
    }
  }, [receiveMessage, advance, markAllDelivered])

  // Runs every time the connection becomes ready (first time and after each reconnect).
  const handleOnline = useCallback(() => {
    // STOMP has no SYNC, so always catch up over REST
    loadConversations()
    if (activePeerRef.current) loadHistory(activePeerRef.current)
    // send again anything the server never acknowledged (duplicates are ignored by id)
    for (const [id, { peer, text }] of pendingRef.current) {
      patchMessage(peer, id, (m) => (m.status === 'failed' ? { status: 'sending' } : {}))
      transmit(id, peer, text)
    }
  }, [loadConversations, loadHistory, patchMessage, transmit])

  // ----- lifecycle -----

  // First load of the chats list (also works when the realtime connection cannot be opened)
  useEffect(() => {
    if (!token) return
    let cancelled = false
    fetchConversations()
      .then((list) => {
        if (cancelled) return
        setConversations(list.map(toUiConversation))
        setConversationsStatus('ready')
      })
      .catch(() => {
        if (!cancelled) setConversationsStatus((s) => (s === 'ready' ? s : 'error'))
      })
    return () => {
      cancelled = true
    }
  }, [token])

  // (Re)creates the connection when the user or the protocol changes
  useEffect(() => {
    if (!token) return
    const client = createChatClient({
      username,
      token,
      protocol,
      getSince: () => Math.max(0, getLastTimestamp(username) - 1),
      onState: setConnection,
      onOnline: handleOnline,
      onMessage: handleMessage,
    })
    clientRef.current = client
    client.start()
    return () => {
      client.stop()
      clientRef.current = null
    }
  }, [token, username, protocol, handleOnline, handleMessage])

  useEffect(() => {
    const ackTimers = ackTimersRef.current
    return () => {
      ackTimers.forEach(clearTimeout)
      clearTimeout(reloadTimerRef.current)
    }
  }, [])

  const retry = useCallback(() => clientRef.current?.retry(), [])

  const setProtocol = useCallback((next) => {
    storeProtocol(next)
    setProtocolState(next)
  }, [])

  const value = {
    connection, retry, protocol, setProtocol,
    conversations, conversationsStatus, reloadConversations,
    messagesByPeer, historyStatus, openChat, closeChat, reloadHistory, sendMessage,
  }
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}
