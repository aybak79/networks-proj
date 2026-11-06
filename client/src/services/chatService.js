// services/chatService.js
import { conversations, messages } from '../mock/data'

export function getConversations() { return Promise.resolve(conversations) }
export function getConversation(id) {
  return Promise.resolve(conversations.find((c) => String(c.id) === String(id)))
}
export function getMessages(id) { return Promise.resolve(messages[id] ?? []) }