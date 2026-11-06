import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Video, Phone, EllipsisVertical } from 'lucide-react'
import Avatar from '../components/Avatar'
import MessageBubble from '../components/MessageBubble'
import InputBar from '../components/InputBar'
import { getConversation, getMessages } from '../services/chatService'
import { newId } from '../utils/id'
import './ChatPage.css'

export default function ChatPage() {
  const { id } = useParams()
  const [conversation, setConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const bottomRef = useRef(null)

  useEffect(() => {
    getConversation(id).then(setConversation)
    getMessages(id).then(setMessages)
  }, [id])

  // Scroll to the newest message whenever the list changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function updateStatus(msgId, status) {
    setMessages((prev) => prev.map((m) => (m.id === msgId ? { ...m, status } : m)))
  }

  function handleSend(text) {
    const msgId = newId()
    const time = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    setMessages((prev) => [...prev, { id: msgId, from: 'me', text, time, status: 'sending' }])
    // MOCK: pretend the server ACKs, then the recipient receives it.
    // Replaced by the real connection when the backend is ready.
    setTimeout(() => updateStatus(msgId, 'sent'), 600)
    setTimeout(() => updateStatus(msgId, 'delivered'), 1400)
  }

  if (!conversation) return null

  return (
    <div className="chat">
      <header className="chat__header">
        <Link to="/chats" className="icon-btn" aria-label="Back"><ArrowLeft size={22} /></Link>
        <Avatar size={28} />
        <span className="chat__name">{conversation.name}</span>
        <button type="button" className="icon-btn" aria-label="Video call"><Video size={20} /></button>
        <button type="button" className="icon-btn" aria-label="Voice call"><Phone size={20} /></button>
        <button type="button" className="icon-btn" aria-label="Menu"><EllipsisVertical size={20} /></button>
      </header>
      <div className="chat__list">
        {messages.map((m) => <MessageBubble key={m.id} {...m} />)}
        <div ref={bottomRef} />
      </div>
      <InputBar onSend={handleSend} />
    </div>
  )
}