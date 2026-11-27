// WebSocket address of this page's own host. Vite proxies /ws-raw and /ws-stomp
// to the backend (see vite.config.js), so the same code works on a laptop and a phone.
const scheme = window.location.protocol === 'https:' ? 'wss' : 'ws'
export const WS_BASE = `${scheme}://${window.location.host}`
