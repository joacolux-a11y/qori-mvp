import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { quiz, avatares, calcularPerfil } from '../data/quiz.js'
import { Button, ProgressBar } from '../components/UI.jsx'
import { theme } from '../theme.js'

export default function Onboarding() {
  const { user, updatePerfil } = useAuth()
  const nav = useNavigate()
  const [paso, setPaso] = useState(0)        // 0..quiz.length-1, luego "resultado"
  const [respuestas, setRespuestas] = useState([])
  const [resultado, setResultado] = useState(null)

  function responder(perfil) {
    const next = [...respuestas, perfil]
    setRespuestas(next)
    if (paso + 1 < quiz.length) {
      setPaso(paso + 1)
    } else {
      const ganador = calcularPerfil(next)
      setResultado(avatares[ganador])
    }
  }

  async function empezar() {
    await updatePerfil({ perfil: resultado.id, avatar: resultado.nombre })
    nav('/app')
  }

  // ---------- Pantalla de resultado ----------
  if (resultado) {
    return (
      <div className="screen-full" style={{ background: theme.green, color: theme.cream }}>
        <div className="vcenter">
        <p className="center" style={{ opacity: .75, letterSpacing: 1, fontSize: 12 }}>TU AVATAR DE FINANZAS</p>
        <div className="pop center" style={{ fontSize: 90, margin: '12px 0' }}>{resultado.emoji}</div>
        <h1 className="center" style={{ fontSize: 30 }}>{resultado.nombre}</h1>
        <p className="center pill" style={{ margin: '12px auto', background: 'rgba(245,166,35,.2)', color: theme.gold }}>{resultado.titulo}</p>
        <p className="center" style={{ opacity: .9, lineHeight: 1.5, margin: '8px 4px 24px' }}>{resultado.descripcion}</p>
        <div style={{ background: 'rgba(255,255,255,.08)', borderRadius: 18, padding: 16, marginBottom: 24 }}>
          <p style={{ fontSize: 13, opacity: .7, marginBottom: 4 }}>💡 Tu primer consejo</p>
          <p style={{ fontSize: 15, lineHeight: 1.45 }}>{resultado.consejoBase}</p>
        </div>
        <Button onClick={empezar}>¡Vamos, {user?.nombre?.split(' ')[0] || 'crack'}!</Button>
        </div>
      </div>
    )
  }

  // ---------- Preguntas ----------
  const q = quiz[paso]
  return (
    <div className="screen-full" style={{ background: theme.cream, display: 'flex', flexDirection: 'column' }}>
      <div style={{ paddingTop: 12 }}>
        <ProgressBar value={(paso) / quiz.length} />
        <p className="muted" style={{ fontSize: 13, marginTop: 8 }}>Pregunta {paso + 1} de {quiz.length}</p>
      </div>
      <h2 style={{ fontSize: 23, lineHeight: 1.25, margin: '24px 0 22px', color: theme.green }}>{q.pregunta}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {q.opciones.map((op, i) => (
          <button key={i} onClick={() => responder(op.perfil)} className="card" style={{ textAlign: 'left', fontSize: 15, lineHeight: 1.4, border: '1.5px solid #EDEAE2', cursor: 'pointer' }}>
            {op.texto}
          </button>
        ))}
      </div>
      <p className="muted center" style={{ fontSize: 12, marginTop: 'auto', paddingTop: 20 }}>No hay respuestas malas. Sé honesto 😉</p>
    </div>
  )
}
