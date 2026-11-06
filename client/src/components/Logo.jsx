import logo from '../assets/logo.svg'
import './Logo.css'

export default function Logo() {
  return (
    <div
      className="logo"
      role="img"
      aria-label="Link"
      style={{ maskImage: `url(${logo})`, WebkitMaskImage: `url(${logo})` }}
    />
  )
}