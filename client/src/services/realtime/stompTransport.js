import { Client } from '@stomp/stompjs'
import { WS_BASE } from '../../config'
import { newId } from '../../utils/id'

const JSON_HEADERS = { 'content-type': 'application/json' }

// STOMP protocol: STOMP frames over a WebSocket at /ws-stomp.
//   connect:   header "Authorization: Bearer <jwt>"
//   receive:   subscribe to /user/queue/messages (the server sends each user their own messages here)
//   send CHAT: publish to /app/chat.send       { id, to, body }
//   delivered: publish to /app/chat.delivered  { body: <message id> }
// There is no JOIN/SYNC in STOMP, so missed messages are fetched over REST instead.
export function connectStomp({ token, onOpen, onMessage, onClose }) {
  const client = new Client({
    brokerURL: `${WS_BASE}/ws-stomp`,
    connectHeaders: { Authorization: `Bearer ${token}` },
    reconnectDelay: 0, // chatClient.js decides when to reconnect
    heartbeatIncoming: 0,
    heartbeatOutgoing: 0,
    onConnect: () => {
      client.subscribe('/user/queue/messages', (frame) => {
        try {
          onMessage(JSON.parse(frame.body))
        } catch {
          /* ignore a malformed frame */
        }
      })
      onOpen()
    },
    onStompError: () => client.deactivate(), // e.g. the server rejected our token
    onWebSocketClose: () => onClose(),
  })
  client.activate()

  return {
    sendChat(id, to, body) {
      client.publish({
        destination: '/app/chat.send',
        headers: JSON_HEADERS,
        body: JSON.stringify({ id, to, body, timestamp: Date.now() }),
      })
    },
    sendDelivered(messageId) {
      client.publish({
        destination: '/app/chat.delivered',
        headers: JSON_HEADERS,
        body: JSON.stringify({ id: newId(), body: messageId }),
      })
    },
    close() {
      client.deactivate()
    },
  }
}
