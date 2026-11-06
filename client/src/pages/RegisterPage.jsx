import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import TextField from '../components/TextField'
import Button from '../components/Button'
import './AuthPage.css'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!username || !password) {
      setError('Please fill in all fields')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    // MOCK: pretend the account was created. Replace with a backend call later.
    navigate('/chats')
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