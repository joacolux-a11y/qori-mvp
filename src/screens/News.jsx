import { useEffect, useState } from 'react'
import { getNoticias, porQueImporta } from '../lib/news.js'
import { conceptos } from '../data/conceptos.js'
import PremiumGate from '../components/PremiumGate.jsx'
import { theme } from '../theme.js'

function fmtFecha(iso) {
  try {
    return new Date(iso).toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })
  } catch { return '' }
}

export default function News() {
  const [noticias, setNoticias] = useState([])
  const [fuente, setFuente] = useState('demo')
  const [explica, setExplica] = useState({})   // id -> texto
  const [cargando, setCargando] = useState(true)
  const [abierto, setAbierto] = useState(null) // concepto abierto

  useEffect(() => {
    (async () => {
      const r = await getNoticias()
      setNoticias(r.noticias)
      setFuente(r.fuente)
      setCargando(false)
    })()
  }, [])

  async function verPorque(n) {
    if (explica[n.id]) { setExplica((e) => ({ ...e, [n.id]: null })); return }
    const txt = await porQueImporta(n)
    setExplica((e) => ({ ...e, [n.id]: txt }))
  }

  return (
    <PremiumGate
      titulo="¿Qué está pasando?"
      descripcion="Noticias de economía peruana explicadas en simple, más una biblioteca de conceptos clave."
    >
      <div className="screen">
        <h1 style={{ fontSize: 26, color: theme.green, marginBottom: 4 }}>📰 ¿Qué está pasando?</h1>
        <p className="muted" style={{ fontSize: 14, marginBottom: 18 }}>La economía del día, sin jerga.</p>

        {/* Noticia del día */}
        <p style={{ fontFamily: 'Poppins', fontWeight: 700, color: theme.green, marginBottom: 10 }}>Noticia del día</p>
        {cargando && <div className="card muted">Cargando noticias…</div>}
        {!cargando && noticias.map((n) => (
          <div key={n.id} className="card" style={{ marginBottom: 12, borderLeft: `5px solid ${theme.gold}` }}>
            <p style={{ fontWeight: 600, color: theme.green, fontSize: 16, lineHeight: 1.35 }}>{n.titulo}</p>
            {n.resumen && <p className="muted" style={{ fontSize: 13, margin: '6px 0 0', lineHeight: 1.4 }}>{n.resumen}</p>}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
              <span className="muted" style={{ fontSize: 11 }}>{n.fuente}</span>
              <span className="muted" style={{ fontSize: 11 }}>· {fmtFecha(n.fecha)}</span>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
              <button onClick={() => verPorque(n)}
                style={{ padding: '9px 14px', borderRadius: 12, background: theme.green, color: theme.cream, fontWeight: 700, fontSize: 13 }}>
                {explica[n.id] ? 'Ocultar' : '🤔 ¿Por qué importa?'}
              </button>
              {n.url && (
                <a href={n.url} target="_blank" rel="noopener noreferrer"
                  style={{ padding: '9px 14px', borderRadius: 12, border: `1.5px solid ${theme.green}`, color: theme.green, fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
                  Leer más ↗
                </a>
              )}
            </div>
            {explica[n.id] && (
              <div className="pop" style={{ marginTop: 12, padding: 14, borderRadius: 14, background: '#FFF6E6' }}>
                <p style={{ fontSize: 14, lineHeight: 1.5 }}>{explica[n.id]}</p>
              </div>
            )}
          </div>
        ))}
        {fuente === 'demo' && !cargando && (
          <p className="muted" style={{ fontSize: 11, marginBottom: 6 }}>
            Titulares de ejemplo. Agrega VITE_GNEWS_KEY para noticias reales en vivo.
          </p>
        )}

        {/* Conceptos fijos */}
        <p style={{ fontFamily: 'Poppins', fontWeight: 700, color: theme.green, margin: '22px 0 10px' }}>Conceptos clave 🇵🇪</p>
        {conceptos.map((c) => {
          const open = abierto === c.id
          return (
            <div key={c.id} className="card" style={{ marginBottom: 10, padding: 0, overflow: 'hidden' }}>
              <button onClick={() => setAbierto(open ? null : c.id)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: 16, textAlign: 'left' }}>
                <span style={{ fontSize: 26 }}>{c.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: theme.green }}>{c.titulo}</div>
                  <div className="muted" style={{ fontSize: 12 }}>{c.resumen}</div>
                </div>
                <span className="muted" style={{ fontSize: 14 }}>{open ? '▲' : '▼'}</span>
              </button>
              {open && (
                <div className="pop" style={{ padding: '0 16px 16px' }}>
                  <p style={{ fontSize: 14, lineHeight: 1.55 }}>{c.explicacion}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </PremiumGate>
  )
}
