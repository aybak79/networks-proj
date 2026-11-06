import { useEffect, useState } from 'react'
import { EllipsisVertical } from 'lucide-react'
import ConversationItem from '../components/ConversationItem'
import { getConversations } from '../services/chatService'
import './ConversationsPage.css'

export default function ConversationsPage() {
  const [conversations, setConversations] = useState([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    getConversations().then(setConversations)
  }, [])

  const visible = conversations.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="convos">
      <header className="convos__header">
        <div className="convos__title-row">
          <h1 className="convos__title">Chats</h1>
          <button className="icon-btn" aria-label="Menu"><EllipsisVertical size={20} /></button>
        </div>
        <input
          className="convos__search"
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </header>
      <div className="convos__list">
        {visible.map((c) => <ConversationItem key={c.id} {...c} />)}
      </div>
    </div>
  )
}