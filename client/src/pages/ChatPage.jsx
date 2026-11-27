import { useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, EllipsisVertical, Phone, Video } from 'lucide-react'
import Avatar from '../components/Avatar'
import ConnectionBanner from '../components/ConnectionBanner'
import InputBar from '../components/InputBar'
import MessageBubble from '../components/MessageBubble'
import StateView from '../components/StateView'
import { useChat } from '../context/chatContext'
import './ChatPage.css'

const NO_MESSAGES = []

export default function ChatPage() {
  const { id: peer } = useParams() // the friend's username
  const {
    connection, retry, messagesByPeer, historyStatus,
    openChat, closeChat, reloadHistory, sendMessage,
  } = useChat()
  const bottomRef = useRef(null)

  const messages = messagesByPeer[peer] ?? NO_MESSAGES
  const status = historyStatus[peer] ?? 'loading'

  // Opening the chat loads its history and marks it as read; leaving it stops that
  useEffect(() => {
    openChat(peer)
    return () => closeChat(peer)
  }, [peer, openChat, closeChat])

  // Scroll to the newest message whenever the list changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="chat">
      <header className="chat__header">
        <Link to="/chats" className="icon-btn" aria-label="Back"><ArrowLeft size={22} /></Link>
        <Avatar size={28} />
        <span className="chat__name">{peer}</span>
        <button type="button" className="icon-btn" aria-label="Video call"><Video size={20} /></button>
        <button type="button" className="icon-btn" aria-label="Voice call"><Phone size={20} /></button>
        <button type="button" className="icon-btn" aria-label="Menu"><EllipsisVertical size={20} /></button>
      </header>
      <ConnectionBanner state={connection} onRetry={retry} />

      {status === 'loading' && messages.length === 0 && <StateView type="loading" title="Loading..." />}
      {status === 'error' && messages.length === 0 && (
        <StateView
          type="error" title="Couldn't load messages" subtitle="Check your connection and try again"
          actionLabel="Retry" onAction={() => reloadHistory(peer)}
        />
      )}
      {status === 'ready' && messages.length === 0 && (
        <StateView type="empty" title="No messages yet" subtitle="Say hi to start the conversation" />
      )}
      {messages.length > 0 && (
        <div className="chat__list">
          {messages.map((m) => <MessageBubble key={m.id} {...m} />)}
          <div ref={bottomRef} />
        </div>
      )}
      {(status === 'ready' || messages.length > 0) && <InputBar onSend={(text) => sendMessage(peer, text)} />}
    </div>
  )
}
