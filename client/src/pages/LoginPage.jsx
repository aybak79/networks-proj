import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Logo from '../components/Logo'
import TextField from '../components/TextField'
import { useAuth } from '../context/authContext'
import { login } from '../services/authService'
import './AuthPage.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (busy) return
    if (!username || !password) {
      setError('Incorrect username or password')
      return
    }
    setBusy(true)
    try {
      const result = await login(username, password)
      signIn(result.token, result.username)
      navigate('/chats')
    } catch (err) {
      // 400/401 = the server rejected the credentials; anything else = the server is not answering
      setError(err.status === 400 || err.status === 401
        ? 'Incorrect username or password'
        : 'Couldn’t reach the server')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="auth" onSubmit={handleSubmit}>
      <Logo />
      <h1 className="auth__title">Welcome back to Link</h1>
      <p className="auth__subtitle">Log in to continue chatting</p>
      <TextField label="Username" value={username} onChange={setUsername} placeholder="Enter your username" />
      <TextField label="Password" type="password" value={password} onChange={setPassword} placeholder="Enter your password" error={!!error} />
      {error && <p className="auth__error">{error}</p>}
      <Button type="submit">Log in</Button>
      <p className="auth__footer">Don't have an account? <Link to="/register">Register</Link></p>
    </form>
  )
}
