import { useNavigate } from 'react-router-dom'
import StateView from '../components/StateView'

export default function SessionExpiredPage() {
  const navigate = useNavigate()
  return (
    <div className="page-center">
      <StateView
        type="error"
        title="Session expired"
        subtitle="Please log in again to continue"
        actionLabel="Log in"
        onAction={() => navigate('/login')}
      />
    </div>
  )
}