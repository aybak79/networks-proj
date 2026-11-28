import './StatCard.css'

// One number on the Metrics page. `unit` (optional) is shown small next to the value.
export default function StatCard({ label, value, unit }) {
  return (
    <div className="stat">
      <span className="stat__label">{label}</span>
      <div className="stat__value">
        <span className="stat__number">{value}</span>
        {unit && <span className="stat__unit">{unit}</span>}
      </div>
    </div>
  )
}
