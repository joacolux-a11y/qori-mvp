import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { niveles, estadoLecciones } from '../data/lecciones.js'
import PremiumGate from '../components/PremiumGate.jsx'
import { theme } from '../theme.js'

export default function Lessons() {
  const { progreso, refreshProgreso } = useAuth()
  const nav = useNavigate()
  useEffect(() => { refreshProgreso() }, [])

  const estado = useMemo(() => {
    const map = {}
    estadoLecciones(progreso?.lecciones_completadas || []).forEach((e) => { map[e.id] = e })
    return map
  }, [progreso])

  const totalHechas = (progreso?.lecciones_completadas || []).length

  return (
    <PremiumGate
      titulo="Lecciones de finanzas"
      descripcion="Aprende paso a paso con quizzes cortos. Cada respuesta correcta te da +10 monedas Qori."
    >
      <div className="screen">
        <h1 style={{ fontSize: 26, color: theme.green, marginBottom: 4 }}>📚 Lecciones</h1>
        <p className="muted" style={{ fontSize: 14, marginBottom: 18 }}>
          {totalHechas} {totalHechas === 1 ? 'lección completada' : 'lecciones completadas'} · gana monedas aprendiendo
        </p>

        {niveles.map((n) => (
          <div key={n.nivel} style={{ marginBottom: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 22 }}>{n.icon}</span>
              <div>
                <div style={{ fontFamily: 'Poppins', fontWeight: 700, color: theme.green, fontSize: 15 }}>
                  Nivel {n.nivel} · {n.tema}
                </div>
                <div className="muted" style={{ fontSize: 12 }}>{n.descripcion}</div>
              </div>
            </div>

            {n.lecciones.map((l) => {
              const e = estado[l.id] || {}
              const bloqueada = !e.desbloqueada
              return (
                <button
                  key={l.id}
                  disabled={bloqueada}
                  onClick={() => nav('/app/lecciones/' + l.id)}
                  className="card"
                  style={{
                    width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12,
                    marginBottom: 10, padding: 16, cursor: bloqueada ? 'not-allowed' : 'pointer',
                    opacity: bloqueada ? .55 : 1,
                    border: e.completada ? `1.5px solid ${theme.gold}` : '1.5px solid #EDEAE2'
                  }}
                >
                  <span style={{ fontSize: 24 }}>{bloqueada ? '🔒' : e.completada ? '✅' : '▶️'}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: theme.green }}>{l.titulo}</div>
                    <div className="muted" style={{ fontSize: 12 }}>
                      {l.preguntas.length} preguntas · {e.completada ? 'Completada' : bloqueada ? 'Termina la anterior' : `hasta +${l.preguntas.length * 10} 🪙`}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </PremiumGate>
  )
}
