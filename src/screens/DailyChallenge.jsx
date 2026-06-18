import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { retoDelDia } from '../data/retos.js'
import { nivelPorMonedas } from '../data/niveles.js'
import { hoyISO, completarReto, retoCompletadoHoy, getProgreso } from '../lib/backend.js'
import { Button, CoinBadge } from '../components/UI.jsx'
import { theme } from '../theme.js'

const catLabel = { comida: '🍽️ Comida', entretenimiento: '🎬 Entretenimiento', transporte: '🚌 Transporte' }

export default function DailyChallenge() {
  const { user, progreso, refreshProgreso } = useAuth()
  const nav = useNavigate()
  const reto = retoDelDia(hoyISO())
  const [hecho, setHecho] = useState(false)
  const [celebrar, setCelebrar] = useState(null) // { qori, subioNivel, nivel }

  useEffect(() => { retoCompletadoHoy(user.id).then(setHecho) }, [])

  async function completar() {
    const nivelAntes = nivelPorMonedas(progreso?.monedas || 0).nivel
    const { ganancia, yaCompletado } = await completarReto(user.id, reto)
    await refreshProgreso()
    setHecho(true)
    if (!yaCompletado) {
      const p = await getProgreso(user.id)
      const nivelDespues = nivelPorMonedas(p.monedas).nivel
      setCelebrar({ qori: ganancia, subioNivel: nivelDespues > nivelAntes, nivel: nivelPorMonedas(p.monedas) })
    }
  }

  // ---------- Celebración ----------
  if (celebrar) {
    return (
      <div className="screen-full center" style={{ background: theme.green, color: theme.cream, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="pop" style={{ fontSize: 84 }}>{celebrar.subioNivel ? celebrar.nivel.insignia : '🪙'}</div>
        <h1 style={{ fontSize: 28, marginTop: 12 }}>{celebrar.subioNivel ? `¡Subiste a ${celebrar.nivel.nombre}!` : '¡Reto completado!'}</h1>
        <p style={{ fontSize: 19, marginTop: 8 }}>Ganaste <b style={{ color: theme.gold }}>+{celebrar.qori} 🪙</b></p>
        {celebrar.subioNivel && (
          <div style={{ background: 'rgba(255,255,255,.08)', borderRadius: 18, padding: 16, margin: '22px 6px' }}>
            <p style={{ fontSize: 13, opacity: .7, marginBottom: 4 }}>💡 Nuevo consejo desbloqueado</p>
            <p style={{ fontSize: 15, lineHeight: 1.45 }}>{celebrar.nivel.consejo}</p>
          </div>
        )}
        <div style={{ marginTop: 24 }}>
          <Button onClick={() => nav('/app')}>Volver al inicio</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="screen">
      <button onClick={() => nav(-1)} className="muted" style={{ fontSize: 14, marginBottom: 16 }}>← Volver</button>
      <p className="muted" style={{ fontSize: 13 }}>{new Date().toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
      <h1 style={{ fontSize: 26, color: theme.green, margin: '4px 0 20px' }}>Reto del día</h1>

      <div className="card" style={{ textAlign: 'center', padding: 28 }}>
        <span className="pill">{catLabel[reto.cat]}</span>
        <h2 style={{ fontSize: 24, color: theme.green, margin: '18px 0 10px' }}>{reto.titulo}</h2>
        <p style={{ fontSize: 16, lineHeight: 1.5 }}>{reto.texto}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, margin: '22px 0 6px' }}>
          <div><div style={{ fontSize: 12 }} className="muted">Recompensa</div><CoinBadge value={`+${reto.qori}`} /></div>
          <div style={{ width: 1, background: '#EAE7DF' }} />
          <div><div style={{ fontSize: 12 }} className="muted">Ahorras</div><div style={{ fontFamily: 'Poppins', fontWeight: 800, color: theme.green }}>S/{reto.monto}</div></div>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        {hecho
          ? <Button variant="ghost" disabled>✅ Ya lo completaste hoy</Button>
          : <Button onClick={completar}>Marcar como completado</Button>}
      </div>
      <p className="muted center" style={{ fontSize: 12, marginTop: 14 }}>
        Solo márcalo si de verdad lo hiciste. El único que gana eres tú 💪
      </p>
    </div>
  )
}
