import { Navigate, Route, Routes } from 'react-router-dom'
import RequireAuth from './components/RequireAuth'
import { useAuth } from './context/authContext'
import ChatPage from './pages/ChatPage'
import ConversationsPage from './pages/ConversationsPage'
import LoginPage from './pages/LoginPage'
import MetricsPage from './pages/MetricsPage'
import NewChatPage from './pages/NewChatPage'
import RegisterPage from './pages/RegisterPage'
import SessionExpiredPage from './pages/SessionExpiredPage'
import SettingsPage from './pages/SettingsPage'

// "/" sends you to the chats if you are logged in, otherwise to the login page
function Home() {
  const { token } = useAuth()
  return <Navigate to={token ? '/chats' : '/login'} replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/session-expired" element={<SessionExpiredPage />} />
      {/* pages that need a login */}
      <Route element={<RequireAuth />}>
        <Route path="/chats" element={<ConversationsPage />} />
        <Route path="/chats/:id" element={<ChatPage />} />
        <Route path="/new-chat" element={<NewChatPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/metrics" element={<MetricsPage />} />
      </Route>
    </Routes>
  )
}
