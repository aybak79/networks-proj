import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Activity, LogOut, Settings } from 'lucide-react'
import ConnectionBanner from '../components/ConnectionBanner'
import ConversationItem from '../components/ConversationItem'
import MenuButton from '../components/MenuButton'
import StateView from '../components/StateView'
import { useAuth } from '../context/authContext'
import { useChat } from '../context/chatContext'
import './ConversationsPage.css'

export default function ConversationsPage() {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const { connection, retry, conversations, conversationsStatus, reloadConversations } = useChat()
  const [query, setQuery] = useState('')

  const menuItems = [
    { label: 'Settings', Icon: Settings, onClick: () => navigate('/settings') },
    { label: 'Metrics', Icon: Activity, onClick: () => navigate('/metrics') },
    {
      label: 'Log Out',
      Icon: LogOut,
      onClick: () => {
        signOut()
        navigate('/login')
      },
    },
  ]

  const visible = conversations.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  )

  let body
  if (conversationsStatus === 'loading') {
    body = <StateView type="loading" title="Loading..." />
  } else if (conversationsStatus === 'error') {
    body = (
      <StateView
        type="error" title="Couldn't load chats" subtitle="Check your connection and try again"
        actionLabel="Retry" onAction={reloadConversations}
      />
    )
  } else if (conversations.length === 0) {
    body = <StateView type="empty" title="No conversations yet" subtitle="Your chats will show up here" />
  } else {
    body = (
      <div className="convos__list">
        {visible.map((c) => <ConversationItem key={c.id} {...c} />)}
      </div>
    )
  }

  return (
    <div className="convos">
      <header className="convos__header">
        <div className="convos__title-row">
          <h1 className="convos__title">Chats</h1>
          <MenuButton items={menuItems} />
        </div>
        <input
          className="convos__search"
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </header>
      <ConnectionBanner state={connection} onRetry={retry} />
      {body}
    </div>
  )
}
