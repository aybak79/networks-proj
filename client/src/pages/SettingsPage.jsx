import { useState } from 'react'
import ConnectionBanner from '../components/ConnectionBanner'
import PageHeader from '../components/PageHeader'
import SegmentedControl from '../components/SegmentedControl'
import { useChat } from '../context/chatContext'
import { applyTheme, getStoredTheme } from '../utils/theme'
import './SettingsPage.css'

const THEMES = [{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]
const PROTOCOLS = [{ value: 'raw', label: 'RAW' }, { value: 'stomp', label: 'STOMP' }]

export default function SettingsPage() {
  const { connection, retry, protocol, setProtocol } = useChat()
  const [theme, setTheme] = useState(getStoredTheme)

  function changeTheme(next) {
    setTheme(next)
    applyTheme(next)
  }

  return (
    <div className="settings">
      <PageHeader title="Settings" />
      <ConnectionBanner state={connection} onRetry={retry} />
      <div className="settings__body">
        <section className="settings__group">
          <p className="settings__label">Theme</p>
          <SegmentedControl label="Theme" options={THEMES} value={theme} onChange={changeTheme} />
          <p className="settings__hint">Changes the look of the app</p>
        </section>
        <section className="settings__group">
          <p className="settings__label">Connection protocol</p>
          {/* changing it reconnects with the other protocol (you will see the Connecting banner) */}
          <SegmentedControl label="Connection protocol" options={PROTOCOLS} value={protocol} onChange={setProtocol} />
          <p className="settings__hint">Use the same protocol as the people you chat with</p>
        </section>
      </div>
    </div>
  )
}
