import { useRef, useState } from 'react'
import { interpretarGastoConIA } from '../lib/voiceExpense.js'
import { Button } from './UI.jsx'
import { theme } from '../theme.js'

const CAT_META = {
  comida: { label: 'Comida', icon: '🍽️' },
  transporte: { label: 'Transporte', icon: '🚌' },
  entretenimiento: { label: 'Diversión', icon: '🎬' },
  ahorro: { label: 'Ahorro', icon: '💰' }
}

// estados: idle | listening | interpreting | confirm | error
export default function VoiceExpense({ onConfirm }) {
  const [estado, setEstado] = useState('idle')
  const [propuesta, setPropuesta] = useState(null) // { monto, categoria }
  const [escuchado, setEscuchado] = useState('')
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)
  const recRef = useRef(null)

  function escuchar() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) {
      setError('Tu navegador no soporta el dictado por voz. Prueba en Chrome.')
      setEstado('error')
      return
    }
    const rec = new SR()
    recRef.current = rec
    rec.lang = 'es-PE'
    rec.interimResults = false
    rec.maxAlternatives = 1
    setError(''); setEscuchado(''); setPropuesta(null)
    setEstado('listening')

    rec.onresult = async (e) => {
      const texto = e.results[0][0].transcript
      setEscuchado(texto)
      setEstado('interpreting')
      try {
        const r = await interpretarGastoConIA(texto)
        setPropuesta(r)
        setEstado('confirm')
      } catch (err) {
        setError(err.message || 'No pude entender, intenta de nuevo')
        setEstado('error')
      }
    }
    rec.onerror = (e) => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        setError('Necesito permiso del micrófono para escucharte. Actívalo en el navegador (icono 🎤 en la barra de direcciones) e intenta de nuevo.')
      } else if (e.error === 'no-speech') {
        setError('No escuché nada. Acerca el micrófono e intenta de nuevo.')
      } else {
        setError('Hubo un problema con el micrófono. Intenta de nuevo.')
      }
      setEstado('error')
    }
    rec.onend = () => {
      // Si terminó sin resultado ni error, volvemos a idle.
      setEstado((s) => (s === 'listening' ? 'idle' : s))
    }
    try { rec.start() } catch { /* ya iniciado */ }
  }

  function cerrar() {
    try { recRef.current?.abort() } catch { /* noop */ }
    setEstado('idle'); setError(''); setPropuesta(null); setEscuchado('')
  }

  async function confirmar() {
    if (!propuesta) return
    setGuardando(true)
    await onConfirm(propuesta.categoria, propuesta.monto)
    setGuardando(false)
    cerrar()
  }

  const cat = propuesta ? CAT_META[propuesta.categoria] : null

  return (
    <>
      {/* Botón micrófono (junto al teclado) */}
      <button onClick={escuchar} type="button"
        style={{
          width: '100%', marginTop: 10, padding: '13px', borderRadius: 16, fontWeight: 700, fontSize: 15,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          background: theme.gold + '22', color: theme.green, border: `1.5px solid ${theme.gold}`
        }}>
        🎤 Registrar por voz
      </button>

      {estado !== 'idle' && (
        <div onClick={estado === 'confirm' || estado === 'error' ? cerrar : undefined}
          style={{ position: 'absolute', inset: 0, background: 'rgba(21,36,31,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60, padding: 24 }}>
          <div onClick={(e) => e.stopPropagation()} className="card center" style={{ maxWidth: 340, width: '100%' }}>

            {(estado === 'listening' || estado === 'interpreting') && (
              <>
                <div className={estado === 'listening' ? 'mic-listening' : ''}
                  style={{ width: 88, height: 88, borderRadius: '50%', margin: '4px auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 38, background: estado === 'listening' ? theme.gold : theme.green + '22', color: estado === 'listening' ? '#3a2600' : theme.green }}>
                  🎤
                </div>
                <h2 style={{ fontSize: 20, color: theme.green }}>
                  {estado === 'listening' ? 'Escuchando…' : 'Entendiendo…'}
                </h2>
                <p className="muted" style={{ fontSize: 14, marginTop: 8, lineHeight: 1.4 }}>
                  {estado === 'listening'
                    ? 'Di algo como: "Gasté 15 soles en almuerzo" o "Ahorré 20 soles".'
                    : (escuchado && `"${escuchado}"`)}
                </p>
                {estado === 'listening' && (
                  <div style={{ marginTop: 18 }}><Button variant="ghost" onClick={cerrar}>Cancelar</Button></div>
                )}
              </>
            )}

            {estado === 'confirm' && cat && (
              <>
                <div style={{ fontSize: 48 }}>{cat.icon}</div>
                <p className="muted" style={{ fontSize: 13, marginTop: 6 }}>Escuché:</p>
                <h2 style={{ fontSize: 24, color: propuesta.categoria === 'ahorro' ? theme.ahorroGreen : theme.green, margin: '4px 0' }}>
                  S/{propuesta.monto} en {cat.label} ✅
                </h2>
                {escuchado && <p className="muted" style={{ fontSize: 12, marginBottom: 16 }}>"{escuchado}"</p>}
                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                  <div style={{ flex: 1 }}><Button variant="ghost" onClick={cerrar}>Cancelar</Button></div>
                  <div style={{ flex: 1.4 }}><Button onClick={confirmar} disabled={guardando}>{guardando ? 'Guardando…' : 'Confirmar'}</Button></div>
                </div>
              </>
            )}

            {estado === 'error' && (
              <>
                <div style={{ fontSize: 48 }}>😕</div>
                <h2 style={{ fontSize: 19, color: theme.green, marginTop: 6 }}>Ups…</h2>
                <p className="muted" style={{ fontSize: 14, margin: '8px 0 16px', lineHeight: 1.45 }}>{error}</p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={{ flex: 1 }}><Button variant="ghost" onClick={cerrar}>Cerrar</Button></div>
                  <div style={{ flex: 1.4 }}><Button onClick={escuchar}>Intentar de nuevo</Button></div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
