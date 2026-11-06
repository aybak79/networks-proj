import { useState } from 'react'
import { Send } from 'lucide-react'
import './InputBar.css'

export default function InputBar({ onSend }) {
  const [text, setText] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    onSend(trimmed)
    setText('')
  }

  return (
    <form className="inputbar" onSubmit={handleSubmit}>
      <input
        className="inputbar__field"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message"
      />
      <button className="inputbar__send" type="submit" aria-label="Send"><Send size={20} /></button>
    </form>
  )
}