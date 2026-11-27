import { formatClock, formatListTime } from '../utils/time'

// Pure functions that turn what the server sends into what the screens show, and keep
// message lists free of duplicates. No React in here, so they are easy to test.

export const STATUS_RANK = { sending: 0, failed: 0, sent: 1, delivered: 2 }

// GET /api/conversations item -> row in the Chats list. The friend's username is the id.
export function toUiConversation(c) {
  return {
    id: c.friend,
    name: c.friend,
    lastMessage: c.lastMessage,
    timestamp: c.timestamp,
    time: formatListTime(c.timestamp),
    unread: c.unread,
  }
}

// Server message -> bubble. Messages I sent show "sent", or "delivered" once the friend got/read them.
export function toUiMessage(m, me) {
  const mine = m.from === me
  return {
    id: m.id,
    from: mine ? 'me' : 'them',
    text: m.body,
    timestamp: m.timestamp,
    time: formatClock(m.timestamp),
    ...(mine ? { status: m.delivered || m.read ? 'delivered' : 'sent' } : {}),
  }
}

// Messages the server knows are ordered by its timestamps; unsent ones stay at the bottom.
export function sortMessages(list) {
  const known = list
    .filter((m) => m.timestamp != null)
    .sort((a, b) => a.timestamp - b.timestamp || (a.id < b.id ? -1 : 1))
  const pending = list.filter((m) => m.timestamp == null)
  return [...known, ...pending]
}

// Adds new messages to a chat WITHOUT ever duplicating one (same id = same message).
export function mergeMessages(existing, incoming) {
  const byId = new Map(existing.map((m) => [m.id, m]))
  for (const m of incoming) {
    const old = byId.get(m.id)
    if (!old) {
      byId.set(m.id, m)
      continue
    }
    // keep whichever delivery status is further along
    const status = (STATUS_RANK[m.status] ?? -1) >= (STATUS_RANK[old.status] ?? -1) ? m.status : old.status
    byId.set(m.id, { ...old, ...m, status })
  }
  return sortMessages([...byId.values()])
}

// Puts a conversation at the top of the list, creating it if it is new.
export function upsertConversation(list, { friend, lastMessage, timestamp, unreadDelta = 0, resetUnread = false }) {
  const old = list.find((c) => c.id === friend)
  const entry = {
    id: friend,
    name: friend,
    lastMessage,
    timestamp,
    time: formatListTime(timestamp),
    unread: resetUnread ? 0 : (old?.unread ?? 0) + unreadDelta,
  }
  return [entry, ...list.filter((c) => c.id !== friend)]
}

