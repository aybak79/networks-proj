import { useEffect, useState } from 'react'
import ConnectionBanner from '../components/ConnectionBanner'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import StateView from '../components/StateView'
import { useChat } from '../context/chatContext'
import { fetchMetrics } from '../services/chatApi'
import { formatBytes, formatUptime } from '../utils/format'
import './MetricsPage.css'

const REFRESH_MS = 2000 // the numbers are fetched again every 2 seconds

export default function MetricsPage() {
  const { connection, retry } = useChat()
  const [metrics, setMetrics] = useState(null) // the latest numbers from GET /api/metrics
  const [updatedAt, setUpdatedAt] = useState(null)
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    function load() {
      fetchMetrics()
        .then((data) => {
          if (cancelled) return
          setMetrics(data)
          setUpdatedAt(new Date())
          setStatus('ready')
        })
        .catch(() => {
          // a failed refresh keeps the numbers we already have; only a failed first load shows the error
          if (!cancelled) setStatus((s) => (s === 'ready' ? s : 'error'))
        })
    }
    load()
    const timer = setInterval(load, REFRESH_MS)
    return () => {
      cancelled = true
      clearInterval(timer)
    }
  }, [attempt])

  function reload() {
    setStatus('loading')
    setAttempt((a) => a + 1)
  }

  let body
  if (status === 'loading') {
    body = <StateView type="loading" title="Loading..." />
  } else if (status === 'error') {
    body = (
      <StateView
        type="error" title="Couldn't load metrics" subtitle="Check your connection and try again"
        actionLabel="Retry" onAction={reload}
      />
    )
  } else {
    const data = formatBytes(metrics.totalBytes)
    const rate = formatBytes(metrics.bytesPerSecond)
    body = (
      <div className="metrics__body">
        <div className="metrics__row">
          <StatCard label="Active connections" value={metrics.activeConnections} />
          <StatCard label="Total connections" value={metrics.totalConnections} />
        </div>
        <div className="metrics__row">
          <StatCard label="Total messages" value={metrics.totalMessages} />
          <StatCard label="Messages per second" value={metrics.messagesPerSecond} />
        </div>
        <div className="metrics__row">
          <StatCard label="Peak messages per second" value={metrics.peakMessagesPerSecond} />
          <StatCard label="Total data" value={data.value} unit={data.unit} />
        </div>
        <div className="metrics__row">
          <StatCard label="Data per second" value={rate.value} unit={`${rate.unit}/s`} />
          <StatCard label="Uptime" value={formatUptime(metrics.uptimeSeconds)} />
        </div>
        <p className="metrics__updated">
          Updated {updatedAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit' })}
        </p>
      </div>
    )
  }

  return (
    <div className="metrics">
      <PageHeader title="Metrics" />
      <ConnectionBanner state={connection} onRetry={retry} />
      {body}
    </div>
  )
}
