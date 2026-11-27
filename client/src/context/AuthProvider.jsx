import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setUnauthorizedHandler } from '../services/api'
import { clearSession, getToken, getUsername, isTokenExpired, saveSession } from '../services/session'
import { AuthContext } from './authContext'

const LOGGED_OUT = { token: null, username: null }

// Restores the login after a refresh, unless the token has expired.
function loadAuth() {
  const token = getToken()
  if (!token || isTokenExpired(token)) {
    clearSession()
    return LOGGED_OUT
  }
  return { token, username: getUsername() }
}

export default function AuthProvider({ children }) {
  const navigate = useNavigate()
  const [auth, setAuth] = useState(loadAuth)

  const signIn = useCallback((token, username) => {
    saveSession(token, username)
    setAuth({ token, username })
  }, [])

  const signOut = useCallback(() => {
    clearSession()
    setAuth(LOGGED_OUT)
  }, [])

  // Any 401 from the server means the token is no longer valid
  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearSession()
      setAuth(LOGGED_OUT)
      navigate('/session-expired', { replace: true })
    })
  }, [navigate])

  const value = useMemo(() => ({ ...auth, signIn, signOut }), [auth, signIn, signOut])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
