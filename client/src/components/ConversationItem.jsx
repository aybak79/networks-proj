import { Link } from 'react-router-dom'
import Avatar from './Avatar'
import './ConversationItem.css'

export default function ConversationItem({ id, name, lastMessage, time, unread }) {
  return (
    <Link to={`/chats/${id}`} className="convo">
      <Avatar />
      <div className="convo__body">
        <span className="convo__name">{name}</span>
        <span className="convo__preview">{lastMessage}</span>
      </div>
      <div className="convo__meta">
        <span className="convo__time">{time}</span>
        {unread > 0 && <span className="convo__badge">{unread}</span>}
      </div>
    </Link>
  )
}