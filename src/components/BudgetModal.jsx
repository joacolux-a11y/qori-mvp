import { useState } from 'react'
import { Button } from './UI.jsx'
import { theme } from '../theme.js'

const CATS = [
  { id: 'comida', label: 'Comida', icon: '🍽️' },
  { id: 'entretenimiento', label: 'Entretenimiento', icon: '🎬' },
  { id: 'transporte', label: 'Transporte', icon: '🚌' }
]

// Modal para ver y editar el presupuesto mensual por categoría.
export default function BudgetModal({ presupuesto, onSave, onClose }) {
  const [val, setVal] = useState({
    comida: presupuesto?.comida ?? 300,
    entretenimiento: presupuesto?.entretenimiento ?? 150,
    transporte: presupuesto?.transporte ?? 150
  })
  const [busy, setBusy] = useState(false)
  const total = Number(val.comida || 0) + Number(val.entretenimiento || 0) + Number(val.transporte || 0)

  async function guardar() {
    setBusy(true)
    await onSave(val)
    setBusy(false)
    onClose()
  }

  return (
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(21,36,31,.45)', display: 'flex', alignItems: 'flex-end', zIndex: 50 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', background: theme.cream, borderRadius: '24px 24px 0 0', padding: '22px 20px 28px' }}>
        <div style={{ width: 40, height: 4, background: '#DCD8CF', borderRadius: 99, margin: '0 auto 18px' }} />
        <h2 style={{ fontSize: 20, color: theme.green, marginBottom: 4 }}>✏️ Editar presupuesto</h2>
        <p className="muted" style={{ fontSize: 13, marginBottom: 18 }}>Tu límite mensual por categoría (en soles).</p>

        {CATS.map((c) => (
          <div key={c.id} style={{ marginBottom: 14 }}>
            <label className="label">{c.icon} {c.label}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: theme.muted, fontWeight: 600 }}>S/</span>
              <input className="input" type="number" inputMode="decimal" value={val[c.id]}
                onChange={(e) => setVal({ ...val, [c.id]: e.target.value })} />
            </div>
          </div>
        ))}

        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0 16px', fontFamily: 'Poppins', fontWeight: 700, color: theme.green }}>
          <span>Total mensual</span><span>S/{total.toFixed(0)}</span>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}><Button variant="ghost" onClick={onClose}>Cancelar</Button></div>
          <div style={{ flex: 1.4 }}><Button onClick={guardar} disabled={busy}>{busy ? 'Guardando…' : 'Guardar'}</Button></div>
        </div>
      </div>
    </div>
  )
}
