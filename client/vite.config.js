/* global process */
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Where the Spring Boot server runs. If it runs on another computer, start Vite with
// BACKEND=<ip>:8080 (PowerShell: $env:BACKEND="<ip>:8080"; npm run dev).
const BACKEND = process.env.BACKEND ?? 'localhost:8080'

// The browser (laptop or phone) only talks to this Vite server. Vite forwards the
// REST calls and both WebSocket endpoints to the backend, so only port 5173 has to
// be reachable and there are no CORS problems.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': { target: `http://${BACKEND}`, changeOrigin: true },
      '/ws-raw': { target: `ws://${BACKEND}`, ws: true, changeOrigin: true },
      '/ws-stomp': { target: `ws://${BACKEND}`, ws: true, changeOrigin: true },
    },
  },
})
