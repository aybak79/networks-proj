import { Clock, Check, TriangleAlert } from 'lucide-react'
import './MessageStatus.css'

const ICONS = { sending: Clock, sent: Check, delivered: Check, failed: TriangleAlert }

export default function MessageStatus({ status }) {
  const Icon = ICONS[status]
  if (!Icon) return null
  return (
    <span className={`status status--${status}`} title={status}>
      <Icon size={14} />
    </span>
  )
}