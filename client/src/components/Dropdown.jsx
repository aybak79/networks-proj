import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import Avatar from './Avatar'
import './Dropdown.css'

// Pick one option from a list. `options` is an array of names, `value` the chosen name (or null).
export default function Dropdown({ options, value, onChange, placeholder }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // Close the list when tapping outside it or pressing Escape
  useEffect(() => {
    if (!open) return
    function onPointerDown(e) {
      if (!ref.current.contains(e.target)) setOpen(false)
    }
    function onKeyDown(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div className="dropdown" ref={ref}>
      <button
        type="button" className="dropdown__field"
        aria-haspopup="listbox" aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {value && <Avatar size={28} />}
        <span className={`dropdown__text ${value ? '' : 'dropdown__text--placeholder'}`}>
          {value ?? placeholder}
        </span>
        <ChevronDown size={20} className="dropdown__chevron" />
      </button>
      {open && (
        <div className="dropdown__list" role="listbox">
          {options.map((name) => (
            <button
              key={name} type="button" role="option" aria-selected={name === value}
              className={`dropdown__item ${name === value ? 'dropdown__item--selected' : ''}`}
              onClick={() => { onChange(name); setOpen(false) }}
            >
              <Avatar size={32} />
              <span className="dropdown__name">{name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
