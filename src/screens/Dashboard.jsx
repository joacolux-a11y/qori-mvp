import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { retoDelDia } from '../data/retos.js'
import { nivelPorMonedas, siguienteNivel, progresoNivel } from '../data/niveles.js'
import { avatares } from '../data/quiz.js'
import { hoyISO, retoCompletadoHoy } from '../lib/backend.js'
import { CoinBadge, StreakBadge, LevelRing, ProgressBar, Button, Logo } from '../components/UI.jsx'
import { theme } from '../theme.js'

export default function Dashboard() {
  const { user, progreso, refreshProgreso } = useAuth()
  const nav = useNavigate()
  const [hechoHoy, setHechoHoy] = useState(false)
  const reto = retoDelDia(hoyISO(), user.perfil)

  useEffect(() => { refreshProgreso() }, [])
  useEffect(() => { retoCompletadoHoy(user.id).then(setHechoHoy) }, [progreso])

  if (!progreso) return null
  const nivel = nivelPorMonedas(progreso.monedas)
  const sig = siguienteNivel(progreso.monedas)
  const avatar = user.perfil ? avatares[user.perfil] : null
  const faltan = sig ? sig.requiere - progreso.monedas : 0
  const hora = new Date().getHours()
  const saludo = hora < 12 ? 'Buenos días' : hora < 19 ? 'Buenas tardes' : 'Buenas noches'

  return (
    <div className="screen">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <Logo size={22} />
        <StreakBadge value={progreso.streak} />
      </header>

      <p className="muted" style={{ fontSize: 14 }}>{saludo},</p>
      <h1 style={{ fontSize: 26, color: theme.green, marginBottom: 18 }}>
        {avatar?.emoji} {user.nombre?.split(' ')[0] || 'crack'}
      </h1>

      {/* Tarjeta resumen */}
      <div className="card" style={{ background: theme.green, color: theme.cream, display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
        <LevelRing nivel={nivel.nivel} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontFamily: 'Poppins', fontWeight: 700 }}>{nivel.insignia} {nivel.nombre}</span>
            <span style={{ fontWeight: 800, fontFamily: 'Poppins' }}>🪙 {progreso.monedas}</span>
          </div>
          <div style={{ margin: '10px 0 6px' }}><ProgressBar value={progresoNivel(progreso.monedas)} /></div>
          <span style={{ fontSize: 12, opacity: .8 }}>
            {sig ? `Te faltan ${faltan} monedas para ${sig.nombre} ${sig.insignia}` : '¡Nivel máximo alcanzado! 👑'}
          </span>
        </div>
      </div>

      {/* Stats rápidos */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
        <Stat icon="🔥" label="Racha" value={`${progreso.streak} ${progreso.streak === 1 ? 'día' : 'días'}`} />
        <Stat icon="💰" label="Ahorrado" value={`S/${progreso.total_ahorrado}`} />
        <Stat icon="✅" label="Retos" value={progreso.retos_completados.length} />
      </div>

      {/* Reto del día */}
      <p style={{ fontFamily: 'Poppins', fontWeight: 700, color: theme.green, marginBottom: 10 }}>Reto de hoy</p>
      <div className="card" style={{ borderLeft: `5px solid ${theme.gold}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span className="pill">🎯 {reto.titulo}</span>
          <CoinBadge value={`+${reto.qori}`} />
        </div>
        <p style={{ fontSize: 15, lineHeight: 1.45, margin: '8px 0 16px' }}>{reto.texto}</p>
        {hechoHoy
          ? <Button variant="ghost" disabled>✅ Completado hoy — ¡vuelve mañana!</Button>
          : <Button onClick={() => nav('/app/reto')}>Ver y completar reto</Button>}
      </div>
    </div>
  )
}

function Stat({ icon, label, value }) {
  return (
    <div className="card" style={{ flex: 1, padding: 14, textAlign: 'center' }}>
      <div style={{ fontSize: 20 }}>{icon}</div>
      <div style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 17, color: theme.green, marginTop: 2 }}>{value}</div>
      <div className="muted" style={{ fontSize: 11 }}>{label}</div>
    </div>
  )
}
