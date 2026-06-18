import { useState } from 'react'
import { Button, CoinBadge } from './UI.jsx'
import { theme } from '../theme.js'

// Modal para aceptar un reto eligiendo cuánto ahorrar (slider).
// Rango sugerido: monto base → monto×5. Puntos = monto elegido × 2.
export default function RetoModal({ reto, onConfirm, onClose }) {
  const min = reto.monto
  const max = reto.monto * 5
  const medio = Math.round((min + max) / 2)
  const [monto, setMonto] = useState(medio)
  const [busy, setBusy] = useState(false)
  const puntos = Math.round(monto * 2)

  async function confirmar() {
    setBusy(true)
    await onConfirm(monto)
  }

  return (
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(21,36,31,.5)', display: 'flex', alignItems: 'flex-end', zIndex: 50 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', background: theme.cream, borderRadius: '24px 24px 0 0', padding: '22px 20px 28px' }}>
        <div style={{ width: 40, height: 4, background: '#DCD8CF', borderRadius: 99, margin: '0 auto 18px' }} />
        <span className="pill">🎯 {reto.titulo}</span>
        <h2 style={{ fontSize: 20, color: theme.green, margin: '14px 0 4px' }}>¿Cuánto ahorrarás hoy?</h2>
        <p className="muted" style={{ fontSize: 13, marginBottom: 18 }}>Ajusta el monto a tu realidad: S/{min} — S/{max}</p>

        <div className="center" style={{ marginBottom: 8 }}>
          <div style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 44, color: theme.green }}>S/{monto}</div>
          <div style={{ marginTop: 4 }}><CoinBadge value={`+${puntos}`} /> <span className="muted" style={{ fontSize: 13 }}>al completarlo</span></div>
        </div>

        <input type="range" min={min} max={max} step={1} value={monto}
          onChange={(e) => setMonto(Number(e.target.value))}
          style={{ width: '100%', accentColor: theme.gold, height: 28 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: theme.muted, marginBottom: 18 }}>
          <span>S/{min}</span><span>S/{max}</span>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}><Button variant="ghost" onClick={onClose}>Cancelar</Button></div>
          <div style={{ flex: 1.6 }}><Button onClick={confirmar} disabled={busy}>{busy ? 'Registrando…' : 'Acepto el reto'}</Button></div>
        </div>
      </div>
    </div>
  )
}
