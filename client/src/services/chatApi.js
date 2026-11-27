import { apiFetch } from './api'

// [{ friend, lastMessage, lastMessageId, lastFrom, timestamp, unread }], newest first
export const fetchConversations = () => apiFetch('/api/conversations')

// Every message between me and `peer` newer than `since`, oldest first
export const fetchHistory = (peer, since = 0) =>
  apiFetch(`/api/messages?with=${encodeURIComponent(peer)}&since=${since}`)

// Opening a chat: marks the friend's messages as read and tells the friend
export const markConversationRead = (peer) =>
  apiFetch(`/api/conversations/${encodeURIComponent(peer)}/read`, { method: 'POST' })

// Usernames (max 20) containing `search`, never including me. For the new-chat screen.
export const searchUsers = (search = '') =>
  apiFetch(`/api/users?search=${encodeURIComponent(search)}`)

// Public endpoint, no login needed. For the metrics page.
export const fetchMetrics = () => apiFetch('/api/metrics', { auth: false })
