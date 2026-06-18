import { useState } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { getLeccion } from '../data/lecciones.js'
import { completarLeccion } from '../lib/backend.js'
import { Button, ProgressBar, CoinBadge } from '../components/UI.jsx'
import { theme } from '../theme.js'

export default function LessonPlayer() {
  const { id } = useParams()
  const { user, progreso, refreshProgreso } = useAuth()
  const nav = useNavigate()
  const leccion = getLeccion(id)

  const [idx, setIdx] = useState(0)
  const [elegida, setElegida] = useState(null) // índice elegido (bloquea hasta continuar)
  const [aciertos, setAciertos] = useState(0)
  const [fin, setFin] = useState(null) // { aciertos, ganancia, yaCompletada }

  if (!leccion) return <Navigate to="/app/lecciones" replace />
  if (user?.plan !== 'premium') return <Navigate to="/app/lecciones" replace />

  const q = leccion.preguntas[idx]
  const esUltima = idx === leccion.preguntas.length - 1
  const acerto = elegida === q.correcta

  function elegir(i) {
    if (elegida !== null) return
    setElegida(i)
    if (i === q.correcta) setAciertos((a) => a + 1)
  }

  async function continuar() {
    if (!esUltima) {
      setIdx(idx + 1)
      setElegida(null)
    } else {
      const r = await completarLeccion(user.id, leccion.id, aciertos)
      await refreshProgreso()
      setFin({ aciertos, ganancia: r.ganancia, yaCompletada: r.yaCompletada })
    }
  }

  // ---------- Pantalla final ----------
  if (fin) {
    const perfecto = fin.aciertos === leccion.preguntas.length
    return (
      <div className="screen-full" style={{ background: theme.green, color: theme.cream }}>
        <div className="vcenter center">
          <div className="pop" style={{ fontSize: 84 }}>{perfecto ? '🏆' : '🎉'}</div>
          <h1 style={{ fontSize: 28, marginTop: 12 }}>{perfecto ? '¡Perfecto!' : '¡Lección terminada!'}</h1>
          <p style={{ fontSize: 17, marginTop: 8, opacity: .9 }}>
            Acertaste {fin.aciertos} de {leccion.preguntas.length}
          </p>
          <div style={{ margin: '20px 0' }}>
            {fin.yaCompletada
              ? <p style={{ opacity: .8 }}>Ya habías completado esta lección antes 😉</p>
              : <p style={{ fontSize: 20 }}>Ganaste <b style={{ color: theme.gold }}>+{fin.ganancia} 🪙</b></p>}
          </div>
          <div><Button onClick={() => nav('/app/lecciones')}>Volver a lecciones</Button></div>
        </div>
      </div>
    )
  }

  return (
    <div className="screen-full" style={{ background: theme.cream, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 8 }}>
        <button onClick={() => nav('/app/lecciones')} className="muted" style={{ fontSize: 20 }}>✕</button>
        <div style={{ flex: 1 }}><ProgressBar value={(idx) / leccion.preguntas.length} /></div>
        <CoinBadge value={aciertos * 10} />
      </div>

      <p className="muted" style={{ fontSize: 13, marginTop: 18 }}>{leccion.titulo} · {idx + 1}/{leccion.preguntas.length}</p>
      <h2 style={{ fontSize: 22, lineHeight: 1.3, color: theme.green, margin: '8px 0 22px' }}>{q.pregunta}</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {q.opciones.map((op, i) => {
          let borde = '1.5px solid #EDEAE2', bg = theme.white, marca = null
          if (elegida !== null) {
            if (i === q.correcta) { borde = `2px solid ${theme.green}`; bg = '#E9F3EF'; marca = '✅' }
            else if (i === elegida) { borde = `2px solid ${theme.danger}`; bg = '#FBECEC'; marca = '✕' }
          }
          return (
            <button key={i} onClick={() => elegir(i)} disabled={elegida !== null}
              className="card" style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10, padding: 16, border: borde, background: bg, fontSize: 15, lineHeight: 1.35, cursor: elegida === null ? 'pointer' : 'default' }}>
              <span style={{ flex: 1 }}>{op}</span>
              {marca && <span>{marca}</span>}
            </button>
          )
        })}
      </div>

      {/* Feedback + botón Continuar (aparece recién al responder) */}
      {elegida !== null && (
        <div style={{ marginTop: 16, paddingBottom: 8 }}>
          <div className="pop" style={{ padding: 16, borderRadius: 16, background: acerto ? '#E9F3EF' : '#FFF6E6', borderLeft: `4px solid ${acerto ? theme.green : theme.gold}` }}>
            <p style={{ fontWeight: 700, color: acerto ? theme.green : '#8a5a00', marginBottom: 4 }}>
              {acerto ? '¡Correcto! +10 🪙' : 'Casi. Mira por qué:'}
            </p>
            <p style={{ fontSize: 14, lineHeight: 1.45 }}>{q.explicacion}</p>
          </div>
          <div style={{ marginTop: 14 }}>
            <Button onClick={continuar}>
              {esUltima ? 'Ver resultado' : `Continuar (${idx + 1}/${leccion.preguntas.length})`}
            </Button>
          </div>
        </div>
      )}

      <div style={{ flex: 1 }} />
    </div>
  )
}
