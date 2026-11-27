import { Check, CheckCheck, Clock, TriangleAlert } from 'lucide-react'
import './MessageStatus.css'

// As in Figma: clock = sending, gray check = sent / delivered, green double check = seen, warning = failed.
// Delivered and sent share one icon because Figma has no separate one; give 'delivered' its own icon here if you add one.
const ICONS = { sending: Clock, sent: Check, delivered: Check, seen: CheckCheck, failed: TriangleAlert }

export default function MessageStatus({ status }) {
  const Icon = ICONS[status]
  if (!Icon) return null
  return (
    <span className={`status status--${status}`} title={status}>
      <Icon size={12} />
    </span>
  )
}
