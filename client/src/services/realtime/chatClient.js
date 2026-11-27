import { connectRaw } from './rawTransport'
import { connectStomp } from './stompTransport'

// After this many failed retries in a row we stop and show the "couldn't reach the server" banner.
const RETRY_DELAYS_MS = [1000, 2000, 4000, 8000, 10000]
const TRANSPORTS = { raw: connectRaw, stomp: connectStomp }

/**
 * Keeps ONE connection to the server alive, whichever protocol is selected, and
 * reconnects automatically. It reports the connection state shown by ConnectionBanner:
 *   connecting    first attempt since logging in / switching protocol
 *   online        connected and ready
 *   reconnecting  the connection dropped, retrying automatically
 *   disconnected  the device itself is offline (waits for the network to come back)
 *   error         the server could not be reached after several retries (use retry())
 */
export function createChatClient({ username, token, protocol, getSince, onState, onOnline, onMessage }) {
  let transport = null
  let state = ''
  let generation = 0 // identifies the current attempt; events from older sockets are ignored
  let attempts = 0
  let everConnected = false
  let timer = null
  let stopped = true

  function setState(next) {
    if (next === state) return
    state = next
    onState(next)
  }

  function dropTransport() {
    clearTimeout(timer)
    generation++
    transport?.close()
    transport = null
  }

  function connect() {
    clearTimeout(timer)
    if (stopped) return
    if (!navigator.onLine) {
      setState('disconnected')
      return
    }
    setState(everConnected ? 'reconnecting' : 'connecting')
    const thisAttempt = ++generation
    transport = TRANSPORTS[protocol]({
      token,
      username,
      since: getSince(),
      onOpen: () => {
        if (thisAttempt !== generation) return
        attempts = 0
        everConnected = true
        setState('online')
        onOnline()
      },
      onMessage: (msg) => {
        if (thisAttempt === generation) onMessage(msg)
      },
      onClose: () => {
        if (thisAttempt === generation) handleClosed()
      },
    })
  }

  function handleClosed() {
    transport = null
    if (stopped) return
    if (!navigator.onLine) {
      setState('disconnected')
      return
    }
    if (attempts >= RETRY_DELAYS_MS.length) {
      setState('error')
      return
    }
    setState(everConnected ? 'reconnecting' : 'connecting')
    timer = setTimeout(connect, RETRY_DELAYS_MS[attempts++])
  }

  function retry() {
    if (stopped) return
    attempts = 0
    dropTransport()
    connect()
  }

  function handleOffline() {
    if (stopped) return
    dropTransport()
    setState('disconnected')
  }

  return {
    start() {
      stopped = false
      attempts = 0
      everConnected = false
      window.addEventListener('online', retry)
      window.addEventListener('offline', handleOffline)
      connect()
    },
    stop() {
      stopped = true
      window.removeEventListener('online', retry)
      window.removeEventListener('offline', handleOffline)
      dropTransport()
    },
    retry,
    // Both return false when we are not connected, so the caller can keep the message queued.
    sendChat(id, to, body) {
      if (state !== 'online' || !transport) return false
      transport.sendChat(id, to, body)
      return true
    },
    sendDelivered(messageId) {
      if (state !== 'online' || !transport) return false
      transport.sendDelivered(messageId)
      return true
    },
  }
}
