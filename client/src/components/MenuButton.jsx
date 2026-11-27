import { useEffect, useRef, useState } from 'react'
import { EllipsisVertical } from 'lucide-react'
import './MenuButton.css'

export default function MenuButton({ items }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // Close the menu when tapping outside it or pressing Escape
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
    <div className="menu-anchor" ref={ref}>
      <button
        type="button" className="icon-btn" aria-label="Menu" aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <EllipsisVertical size={20} />
      </button>
      {open && (
        <div className="menu" role="menu">
          {items.map(({ label, Icon, onClick }) => (
            <button
              key={label} type="button" role="menuitem" className="menu__item"
              onClick={() => { setOpen(false); onClick() }}
            >
              <Icon size={20} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}