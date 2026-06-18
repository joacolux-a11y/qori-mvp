import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { Button } from './UI.jsx'
import { theme } from '../theme.js'

// Envuelve contenido premium. Si el usuario es 'free', muestra candado + banner.
export default function PremiumGate({ titulo, descripcion, children }) {
  const { user } = useAuth()
  const nav = useNavigate()
  if (user?.plan === 'premium') return children

  return (
    <div className="screen">
      <div style={{ textAlign: 'center', paddingTop: 24 }}>
        <div style={{ fontSize: 64 }}>🔒</div>
        <span className="pill" style={{ marginTop: 10 }}>✨ Premium</span>
        <h1 style={{ fontSize: 24, color: theme.green, margin: '14px 0 8px' }}>{titulo}</h1>
        <p className="muted" style={{ fontSize: 15, lineHeight: 1.5, padding: '0 8px' }}>{descripcion}</p>
      </div>

      <div className="card" style={{ background: theme.green, color: theme.cream, marginTop: 24, textAlign: 'center' }}>
        <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 18 }}>Desbloquea todo Qori</p>
        <p style={{ opacity: .85, fontSize: 14, margin: '8px 0 16px' }}>
          Lecciones de finanzas + Noticias explicadas, además de todo lo que ya tienes.
        </p>
        <Button onClick={() => nav('/app/upgrade')}>Quiero Premium</Button>
      </div>
    </div>
  )
}
