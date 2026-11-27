import { getToken } from './session'

export class ApiError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status // 0 means the request never reached the server
  }
}

// AuthContext registers a function here that logs the user out when the server says 401.
let onUnauthorized = () => {}
export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler
}

// fetch() wrapper: adds the JWT, turns failures into ApiError, parses JSON replies.
export async function apiFetch(path, { method = 'GET', body, auth = true } = {}) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  const token = getToken()
  if (auth && token) headers.Authorization = `Bearer ${token}`

  let response
  try {
    response = await fetch(path, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError(0, 'Network error')
  }

  if (response.status === 401 && auth) onUnauthorized()
  if (!response.ok) {
    throw new ApiError(response.status, await response.text().catch(() => ''))
  }

  const type = response.headers.get('content-type') ?? ''
  return type.includes('application/json') ? response.json() : response.text()
}
