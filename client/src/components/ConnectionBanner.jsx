import { LoaderCircle, TriangleAlert, WifiOff } from 'lucide-react'
import './ConnectionBanner.css'

const CONFIG = {
  connecting: { text: 'Connecting...', Icon: LoaderCircle, spin: true },
  reconnecting: { text: 'Reconnecting...', Icon: LoaderCircle, spin: true },
  disconnected: { text: 'You’re offline', Icon: WifiOff, retry: true },
  error: { text: 'Couldn’t reach the server', Icon: TriangleAlert, retry: true },
}

export default function ConnectionBanner({ state, onRetry }) {
  const config = CONFIG[state]
  if (!config) return null // 'online' shows nothing

  return (
    <div className={`banner banner--${state}`} role="status">
      <config.Icon className={`banner__icon ${config.spin ? 'spin' : ''}`} size={16} />
      <span>{config.text}</span>
      {config.retry && (
        <button type="button" className="banner__retry" onClick={onRetry}>Retry</button>
      )}
    </div>
  )
}