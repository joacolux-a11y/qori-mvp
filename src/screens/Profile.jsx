import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { avatares } from '../data/quiz.js'
import { niveles, nivelPorMonedas, siguienteNivel, progresoNivel } from '../data/niveles.js'
import { resetUsuario } from '../lib/backend.js'
import { Button, ProgressBar, CoinBadge } from '../components/UI.jsx'
import { theme } from '../theme.js'

export default function Profile() {
  const { user, progreso, signOut, refreshProgreso } = useAuth()
  const nav = useNavigate()
  useEffect(() => { refreshProgreso() }, [])
  if (!progreso) return null

  const avatar = avatares[user.perfil]
  const nivel = nivelPorMonedas(progreso.monedas)
  const sig = siguienteNivel(progreso.monedas)

  async function reiniciar() {
    if (!confirm('¿Reiniciar tu progreso? (solo para demostración)')) return
    await resetUsuario(user.id)
    await refreshProgreso()
  }

  return (
    <div className="screen">
      {/* Cabecera del avatar */}
      <div className="card" style={{ background: theme.green, color: theme.cream, textAlign: 'center', marginBottom: 18 }}>
        <div style={{ fontSize: 64 }}>{avatar?.emoji}</div>
        <h1 style={{ fontSize: 24, marginTop: 6 }}>{user.nombre || 'Usuario Qori'}</h1>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginTop: 8 }}>
          <span className="pill" style={{ background: 'rgba(245,166,35,.2)', color: theme.gold }}>
            {avatar?.nombre} · {nivel.insignia} {nivel.nombre}
          </span>
          <span className="pill" style={{ background: user.plan === 'premium' ? 'rgba(245,166,35,.2)' : 'rgba(255,255,255,.15)', color: user.plan === 'premium' ? theme.gold : theme.cream }}>
            {user.plan === 'premium' ? '👑 Premium' : '🆓 Gratis'}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 28, marginTop: 18 }}>
          <Metric label="Monedas" value={`🪙 ${progreso.monedas}`} />
          <Metric label="Racha" value={`🔥 ${progreso.streak}`} />
          <Metric label="Ahorrado" value={`S/${progreso.total_ahorrado}`} />
        </div>
      </div>

      {/* Progreso de nivel */}
      <div className="card" style={{ marginBottom: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <b style={{ color: theme.green }}>Nivel {nivel.nivel} · {nivel.nombre}</b>
          <CoinBadge value={progreso.monedas} />
        </div>
        <ProgressBar value={progresoNivel(progreso.monedas)} />
        <p className="muted" style={{ fontSize: 13, marginTop: 8 }}>
          {sig ? `${sig.requiere - progreso.monedas} monedas para ${sig.nombre} ${sig.insignia}` : '¡Eres Qori Maestro! 👑'}
        </p>
      </div>

      {/* Camino de niveles (logros) */}
      <p style={{ fontFamily: 'Poppins', fontWeight: 700, color: theme.green, marginBottom: 10 }}>Tu camino</p>
      <div className="card">
        {niveles.map((n) => {
          const desbloqueado = progreso.monedas >= n.requiere
          return (
            <div key={n.nivel} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid #EFECE4', opacity: desbloqueado ? 1 : .45 }}>
              <div style={{ fontSize: 26, filter: desbloqueado ? 'none' : 'grayscale(1)' }}>{n.insignia}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <b style={{ fontSize: 14, color: theme.green }}>Nivel {n.nivel} · {n.nombre}</b>
                  <span className="muted" style={{ fontSize: 12 }}>{desbloqueado ? '✓' : `🪙 ${n.requiere}`}</span>
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.4, color: desbloqueado ? theme.ink : theme.muted, marginTop: 2 }}>
                  {desbloqueado ? n.consejo : 'Consejo bloqueado — sigue completando retos.'}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {user.plan !== 'premium' && (
        <button onClick={() => nav('/app/upgrade')} className="card" style={{ width: '100%', background: theme.green, color: theme.cream, marginTop: 18, display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}>
          <span style={{ fontSize: 26 }}>👑</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'Poppins', fontWeight: 700 }}>Pásate a Premium</div>
            <div style={{ fontSize: 12, opacity: .85 }}>Lecciones + Noticias económicas</div>
          </div>
          <span>›</span>
        </button>
      )}

      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Button variant="ghost" onClick={() => nav('/app/config')}>⚙️ Configuración</Button>
        <Button variant="ghost" onClick={reiniciar}>Reiniciar progreso (demo)</Button>
        <Button variant="dark" onClick={async () => { await signOut(); nav('/auth') }}>Cerrar sesión</Button>
      </div>
      <p className="muted center" style={{ fontSize: 12, marginTop: 14 }}>{user.email}</p>
    </div>
  )
}

function Metric({ label, value }) {
  return (
    <div>
      <div style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 16 }}>{value}</div>
      <div style={{ fontSize: 11, opacity: .7 }}>{label}</div>
    </div>
  )
}
