import { MessageSquarePlus } from 'lucide-react'
import './Fab.css'

// The round "new chat" button floating at the bottom right of the Chats page
export default function Fab({ onClick }) {
  return (
    <button type="button" className="fab" aria-label="New chat" onClick={onClick}>
      <MessageSquarePlus size={24} />
    </button>
  )
}
