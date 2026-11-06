import './TextField.css'

export default function TextField({ label, type = 'text', value, onChange, placeholder, error }) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      <input
        className={`field__input ${error ? 'field__input--error' : ''}`}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </label>
  )
}