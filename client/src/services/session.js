// Keeps the login (JWT + username) in localStorage so a refresh does not log you out.
const TOKEN_KEY = 'link.token'
const USER_KEY = 'link.username'

function read(key) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function write(key, value) {
  try {
    if (value === null) localStorage.removeItem(key)
    else localStorage.setItem(key, value)
  } catch {
    /* storage unavailable: the session just won't survive a refresh */
  }
}

export const getToken = () => read(TOKEN_KEY)
export const getUsername = () => read(USER_KEY)

export function saveSession(token, username) {
  write(TOKEN_KEY, token)
  write(USER_KEY, username)
}

export function clearSession() {
  write(TOKEN_KEY, null)
  write(USER_KEY, null)
}

// A JWT is three base64 parts; the middle one holds "exp" (expiry, in seconds).
export function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    return typeof payload.exp === 'number' && payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

// Timestamp (server time) of the newest message this user has received.
// It is sent when joining so the server can resend what was missed while offline.
export function getLastTimestamp(username) {
  return Number(read(`link.lastTimestamp.${username}`)) || 0
}

export function setLastTimestamp(username, timestamp) {
  write(`link.lastTimestamp.${username}`, String(timestamp))
}

// Which protocol the user picked in Settings: 'raw' (plain WebSocket) or 'stomp'
export function getStoredProtocol() {
  return read('link.protocol') === 'stomp' ? 'stomp' : 'raw'
}

export function storeProtocol(protocol) {
  write('link.protocol', protocol)
}
