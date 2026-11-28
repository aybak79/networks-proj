import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import './PageHeader.css'

// Back arrow + title, used by New chat, Settings and Metrics (Figma: 53px high, 10px sides, 30px gap)
export default function PageHeader({ title, backTo = '/chats' }) {
  return (
    <header className="pageheader">
      <Link to={backTo} className="pageheader__back" aria-label="Back"><ArrowLeft size={24} /></Link>
      <span className="pageheader__title">{title}</span>
    </header>
  )
}
