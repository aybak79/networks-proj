import MessageStatus from './MessageStatus'
import './MessageBubble.css'

export default function MessageBubble({ from, text, time, status }) {
  return (
    <div className={`msg msg--${from}`}>
      <div className="msg__bubble">{text}</div>
      <div className="msg__meta">
        <span>{time}</span>
        {from === 'me' && <MessageStatus status={status} />}
      </div>
    </div>
  )
}