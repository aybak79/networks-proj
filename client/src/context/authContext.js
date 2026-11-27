import { createContext, useContext } from 'react'

// { token, username, signIn(token, username), signOut() }
export const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}
