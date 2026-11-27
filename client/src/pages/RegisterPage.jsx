import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Logo from '../components/Logo'
import TextField from '../components/TextField'
import { useAuth } from '../context/authContext'
import { register } from '../services/authService'
import './AuthPage.css'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (busy) return
    // the same rules the server enforces: username 3-30 characters, password 6-100
    if (!username || !password) {
      setError('Please fill in all fields')
      return
    }
    if (username.length < 3 || username.length > 30) {
      setError('Username must be 3 to 30 characters')
      return
    }
    if (password.length < 6 || password.length > 100) {
      setError('Password must be at least 6 characters')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    setBusy(true)
    try {
      // registering also logs you in: the server replies with a token
      const result = await register(username, password)
      signIn(result.token, result.username)
      navigate('/chats')
    } catch (err) {
      if (err.status === 409) setError('Username already taken')
      else if (err.status === 400) setError('Please check your username and password')
      else setError('Couldn’t reach the server')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="auth" onSubmit={handleSubmit}>
      <Logo />
      <h1 className="auth__title">Welcome to Link</h1>
      <p className="auth__subtitle">Register to start chatting</p>
      <TextField label="Username" value={username} onChange={setUsername} placeholder="Enter your username" />
      <TextField label="Password" type="password" value={password} onChange={setPassword} placeholder="Enter your password" />
      <TextField label="Confirm Password" type="password" value={confirm} onChange={setConfirm} placeholder="Enter your password again" error={!!error} />
      {error && <p className="auth__error">{error}</p>}
      <Button type="submit">Register</Button>
      <p className="auth__footer">Already have an account? <Link to="/login">Login</Link></p>
    </form>
  )
}
