// "10:42 PM"
export function formatClock(timestamp) {
  return new Date(timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

// Conversation list: today = clock time, yesterday = "Yesterday", this week = weekday, older = date
export function formatListTime(timestamp) {
  const date = new Date(timestamp)
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  const dayMs = 24 * 60 * 60 * 1000
  const daysAgo = Math.round((startOfToday - new Date(date).setHours(0, 0, 0, 0)) / dayMs)

  if (daysAgo <= 0) return formatClock(timestamp)
  if (daysAgo === 1) return 'Yesterday'
  if (daysAgo < 7) return date.toLocaleDateString([], { weekday: 'short' })
  return date.toLocaleDateString([], { day: 'numeric', month: 'short' })
}
