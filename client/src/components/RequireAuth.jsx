import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/authContext'

// Wraps the pages that need a login: visitors without one are sent to /login.
export default function RequireAuth() {
  const { token } = useAuth()
  return token ? <Outlet /> : <Navigate to="/login" replace />
}
