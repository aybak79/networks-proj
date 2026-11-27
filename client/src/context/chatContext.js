import { createContext, useContext } from 'react'

export const ChatContext = createContext(null)

export function useChat() {
  return useContext(ChatContext)
}
