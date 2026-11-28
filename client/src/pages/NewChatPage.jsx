import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users } from 'lucide-react'
import Button from '../components/Button'
import ConnectionBanner from '../components/ConnectionBanner'
import Dropdown from '../components/Dropdown'
import PageHeader from '../components/PageHeader'
import StateView from '../components/StateView'
import { useChat } from '../context/chatContext'
import { searchUsers } from '../services/chatApi'
import './NewChatPage.css'

export default function NewChatPage() {
  const navigate = useNavigate()
  const { connection, retry } = useChat()
  const [users, setUsers] = useState([]) // usernames of everyone else
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'
  const [attempt, setAttempt] = useState(0)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    let cancelled = false
    searchUsers()
      .then((list) => {
        if (cancelled) return
        setUsers(list)
        setStatus('ready')
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })
    return () => { cancelled = true }
  }, [attempt])

  function reload() {
    setStatus('loading')
    setAttempt((a) => a + 1)
  }

  // "replace" so that Back inside the chat goes to the Chats list, not to this screen
  function startChat() {
    navigate(`/chats/${encodeURIComponent(selected)}`, { replace: true })
  }

  let body
  if (status === 'loading') {
    body = <StateView type="loading" title="Loading..." />
  } else if (status === 'error') {
    body = (
      <StateView
        type="error" title="Couldn't load users" subtitle="Check your connection and try again"
        actionLabel="Retry" onAction={reload}
      />
    )
  } else if (users.length === 0) {
    body = <StateView type="empty" icon={Users} title="No other users yet" subtitle="Ask a friend to register" />
  } else {
    body = (
      <div className="newchat__body">
        <p className="newchat__label">Select a user</p>
        <Dropdown options={users} value={selected} onChange={setSelected} placeholder="Select a user" />
        <Button disabled={!selected} onClick={startChat}>Start chat</Button>
      </div>
    )
  }

  return (
    <div className="newchat">
      <PageHeader title="New chat" />
      <ConnectionBanner state={connection} onRetry={retry} />
      {body}
    </div>
  )
}
