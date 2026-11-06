import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import TextField from '../components/TextField'
import Button from '../components/Button'
import './AuthPage.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    // MOCK: accepts any non-empty login. Replace with a backend call later.
    if (!username || !password) {
      setError('Incorrect username or password')
      return
    }
    navigate('/chats')
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