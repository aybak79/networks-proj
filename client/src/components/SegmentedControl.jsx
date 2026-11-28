import './SegmentedControl.css'

// Two (or more) choices in one pill. options = [{ value, label }]
export default function SegmentedControl({ options, value, onChange, label }) {
  return (
    <div className="segmented" role="radiogroup" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value} type="button" role="radio" aria-checked={option.value === value}
          className={`segmented__option ${option.value === value ? 'segmented__option--selected' : ''}`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
