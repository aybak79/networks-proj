// 12000 -> "11.7 KB" (returned as a value and a unit so the unit can be styled separately)
export function formatBytes(bytes) {
  const units = ['B', 'KB', 'MB', 'GB']
  let value = Math.max(0, Number(bytes) || 0)
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit++
  }
  return { value: unit === 0 ? String(Math.round(value)) : value.toFixed(1), unit: units[unit] }
}

// 3600 -> "1h 0m 0s"
export function formatUptime(totalSeconds) {
  const s = Math.max(0, Math.floor(Number(totalSeconds) || 0))
  const days = Math.floor(s / 86400)
  const hours = Math.floor((s % 86400) / 3600)
  const minutes = Math.floor((s % 3600) / 60)
  const seconds = s % 60
  if (days > 0) return `${days}d ${hours}h ${minutes}m`
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`
  if (minutes > 0) return `${minutes}m ${seconds}s`
  return `${seconds}s`
}
