import { conversations, messages } from '../mock/data'

export function getConversations() { return Promise.resolve(conversations) }
export function getMessages(id) { return Promise.resolve(messages[id] ?? []) }