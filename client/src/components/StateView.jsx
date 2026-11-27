import { LoaderCircle, MessagesSquare, TriangleAlert } from 'lucide-react'
import './StateView.css'

const ICONS = { loading: LoaderCircle, empty: MessagesSquare, error: TriangleAlert }

// `icon` lets a screen use a different icon than the default one for its type
export default function StateView({ type, title, subtitle, actionLabel, onAction, icon }) {
  const Icon = icon ?? ICONS[type]
  return (
    <div className={`stateview stateview--${type}`}>
      <div className="stateview__badge">
        <Icon size={28} className={type === 'loading' ? 'spin' : ''} />
      </div>
      <p className="stateview__title">{title}</p>
      {subtitle && <p className="stateview__subtitle">{subtitle}</p>}
      {onAction && (
        <button type="button" className="stateview__action" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  )
}
