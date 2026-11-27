import { WS_BASE } from '../../config'
import { newId } from '../../utils/id'

const JOIN_TIMEOUT_MS = 5000

// RAW protocol: a plain WebSocket at /ws-raw carrying our own JSON messages
//   { id, type, from, to, body, timestamp }  with type JOIN | CHAT | DELIVERED (we send)
//   and ACK | CHAT | SYNC | DELIVERED | READ | ERROR (we receive).
// The JWT travels in the URL because browsers cannot set headers on a WebSocket.
export function connectRaw({ token, username, since, onOpen, onMessage, onClose }) {
  const ws = new WebSocket(`${WS_BASE}/ws-raw?token=${encodeURIComponent(token)}`)
  let joined = false

  function sendFrame(frame) {
    if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(frame))
  }

  // If the server never confirms the JOIN, give up on this socket so we retry.
  const joinTimer = setTimeout(() => {
    if (!joined) ws.close()
  }, JOIN_TIMEOUT_MS)

  ws.onopen = () => {
    // The server ignores chat messages until we JOIN. The body is the timestamp of the
    // last message we got, so the server replies with SYNC messages for anything missed.
    sendFrame({ id: newId(), type: 'JOIN', from: username, to: null, body: String(since), timestamp: 0 })
  }

  ws.onmessage = (event) => {
    let msg
    try {
      msg = JSON.parse(event.data)
    } catch {
      return
    }
    // The server answers JOIN with an ACK whose body is "JOIN successful".
    if (!joined && msg.type === 'ACK' && msg.body === 'JOIN successful') {
      joined = true
      clearTimeout(joinTimer)
      onOpen()
      return
    }
    onMessage(msg)
  }

  // 'error' is always followed by 'close', so everything is handled there.
  ws.onclose = () => {
    clearTimeout(joinTimer)
    onClose()
  }

  return {
    sendChat(id, to, body) {
      sendFrame({ id, type: 'CHAT', from: username, to, body, timestamp: Date.now() })
    },
    sendDelivered(messageId) {
      sendFrame({ id: newId(), type: 'DELIVERED', from: username, to: null, body: messageId, timestamp: Date.now() })
    },
    close() {
      clearTimeout(joinTimer)
      ws.close()
    },
  }
}
