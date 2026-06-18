import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { Button } from '../components/UI.jsx'
import { theme } from '../theme.js'

const beneficios = [
  { icon: '🏠', txt: 'Dashboard, retos diarios y tracker de gastos', free: true },
  { icon: '🏆', txt: 'Niveles, racha y recompensas', free: true },
  { icon: '📚', txt: 'Lecciones de finanzas (quizzes que dan monedas)', free: false },
  { icon: '📰', txt: 'Noticias económicas explicadas en simple', free: false },
  { icon: '🎯', txt: 'Retos avanzados y consejos personalizados', free: false }
]

export default function Upgrade() {
  const { user, actualizarPlan } = useAuth()
  const nav = useNavigate()
  const [aviso, setAviso] = useState(false)
  const esPremium = user?.plan === 'premium'

  return (
    <div className="screen-full" style={{ background: theme.green, color: theme.cream, display: 'flex', flexDirection: 'column' }}>
      <button onClick={() => nav(-1)} style={{ color: theme.cream, opacity: .8, fontSize: 14, alignSelf: 'flex-start' }}>← Volver</button>

      <div style={{ textAlign: 'center', marginTop: 12 }}>
        <div style={{ fontSize: 56 }}>👑</div>
        <h1 style={{ fontSize: 28, marginTop: 6 }}>Qori Premium</h1>
        <p style={{ opacity: .85, marginTop: 8, fontSize: 15 }}>
          Aprende más, decide mejor y haz que tu oro crezca.
        </p>
      </div>

      <div className="card" style={{ color: theme.ink, marginTop: 24 }}>
        {beneficios.map((b, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: i < beneficios.length - 1 ? '1px solid #EFECE4' : 'none' }}>
            <span style={{ fontSize: 22 }}>{b.icon}</span>
            <span style={{ flex: 1, fontSize: 14, lineHeight: 1.35 }}>{b.txt}</span>
            <span style={{ fontSize: 18 }}>{b.free ? '✅' : '✨'}</span>
          </div>
        ))}
        <p className="muted center" style={{ fontSize: 12, marginTop: 12 }}>
          ✅ ya lo tienes &nbsp;·&nbsp; ✨ se desbloquea con Premium
        </p>
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 24 }}>
        {esPremium ? (
          <Button variant="primary" disabled>Ya eres Premium 👑</Button>
        ) : aviso ? (
          <div className="card center" style={{ color: theme.ink }}>
            <div style={{ fontSize: 40 }}>🛠️</div>
            <p style={{ fontFamily: 'Poppins', fontWeight: 700, color: theme.green, marginTop: 8 }}>Próximamente</p>
            <p className="muted" style={{ fontSize: 14, margin: '6px 0 16px', lineHeight: 1.45 }}>
              La pasarela de pago está en camino. Mientras tanto, puedes activar Premium gratis para probar todas las funciones.
            </p>
            <Button onClick={async () => { await actualizarPlan('premium'); nav('/app') }}>
              Activar Premium (modo prueba)
            </Button>
          </div>
        ) : (
          <>
            <Button onClick={() => setAviso(true)}>Quiero Premium</Button>
            <p className="center" style={{ opacity: .7, fontSize: 12, marginTop: 12 }}>
              Sin pasarela de pago todavía — esto es un MVP.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
