import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { addGasto, getGastosDelMes, getPresupuesto, setPresupuesto, hoyISO } from '../lib/backend.js'
import BudgetModal from '../components/BudgetModal.jsx'
import { Button } from '../components/UI.jsx'
import { theme } from '../theme.js'

const CATS = [
  { id: 'comida', label: 'Comida', icon: '🍽️', color: theme.categories.comida },
  { id: 'entretenimiento', label: 'Entretenimiento', icon: '🎬', color: theme.categories.entretenimiento },
  { id: 'transporte', label: 'Transporte', icon: '🚌', color: theme.categories.transporte }
]

export default function ExpenseTracker() {
  const { user } = useAuth()
  const [tab, setTab] = useState('hoy')          // 'hoy' | 'mes'
  const [gastos, setGastos] = useState([])
  const [presupuesto, setPpto] = useState(null)
  const [modal, setModal] = useState(false)
  const [cat, setCat] = useState('comida')
  const [monto, setMonto] = useState('')
  const [nota, setNota] = useState('')

  async function cargar() {
    setGastos(await getGastosDelMes(user.id))
    setPpto(await getPresupuesto(user.id))
  }
  useEffect(() => { cargar() }, [])

  async function registrar(e) {
    e.preventDefault()
    const n = parseFloat(monto)
    if (!n || n <= 0) return
    await addGasto(user.id, { categoria: cat, monto: n, nota })
    setMonto(''); setNota('')
    cargar()
  }

  async function guardarPresupuesto(val) {
    const p = await setPresupuesto(user.id, val)
    setPpto(p)
  }

  const hoy = hoyISO()
  const gastosHoy = useMemo(() => gastos.filter((g) => g.fecha === hoy), [gastos, hoy])

  const totalesMes = useMemo(() => sumarPorCat(gastos), [gastos])
  const totalesHoy = useMemo(() => sumarPorCat(gastosHoy), [gastosHoy])
  const totalMes = sum(totalesMes)
  const totalHoy = sum(totalesHoy)
  const pptoTotal = presupuesto ? presupuesto.comida + presupuesto.entretenimiento + presupuesto.transporte : 0
  const mesNombre = new Date().toLocaleDateString('es-PE', { month: 'long' })

  return (
    <div className="screen">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h1 style={{ fontSize: 26, color: theme.green }}>Mis gastos</h1>
        <button onClick={() => setModal(true)} title="Editar presupuesto"
          style={{ width: 40, height: 40, borderRadius: 12, background: theme.white, boxShadow: 'var(--shadow-sm)', fontSize: 18 }}>✏️</button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, background: '#ECE9E1', padding: 4, borderRadius: 14, marginBottom: 18 }}>
        {[['hoy', 'Hoy'], ['mes', 'Este mes']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            style={{ flex: 1, padding: '9px', borderRadius: 11, fontWeight: 700, fontSize: 14, background: tab === k ? theme.white : 'transparent', color: tab === k ? theme.green : theme.muted, boxShadow: tab === k ? 'var(--shadow-sm)' : 'none' }}>
            {l}
          </button>
        ))}
      </div>

      {/* ---------- TAB HOY ---------- */}
      {tab === 'hoy' && (
        <>
          <div className="card" style={{ background: theme.green, color: theme.cream, marginBottom: 16, textAlign: 'center' }}>
            <span style={{ fontSize: 13, opacity: .8 }}>Gastado hoy</span>
            <div style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 30 }}>S/{totalHoy.toFixed(0)}</div>
          </div>
          {CATS.map((c) => (
            <div key={c.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <span style={{ fontSize: 22 }}>{c.icon}</span>
              <span style={{ flex: 1, fontWeight: 600, color: theme.green }}>{c.label}</span>
              <b style={{ color: theme.green }}>S/{totalesHoy[c.id].toFixed(0)}</b>
            </div>
          ))}
          {totalHoy === 0 && <p className="muted center" style={{ fontSize: 13, marginTop: 8 }}>Aún no registras gastos hoy. ¡Buen comienzo! 🌱</p>}
        </>
      )}

      {/* ---------- TAB MES ---------- */}
      {tab === 'mes' && (
        <>
          <div className="card" style={{ background: theme.green, color: theme.cream, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: 13, opacity: .8, textTransform: 'capitalize' }}>{mesNombre}</span>
              <span style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 24 }}>S/{totalMes.toFixed(0)}</span>
            </div>
            <div className="bar" style={{ margin: '12px 0 6px', background: 'rgba(255,255,255,.15)' }}>
              <span style={{ width: Math.min(100, pptoTotal ? (totalMes / pptoTotal) * 100 : 0) + '%', background: totalMes > pptoTotal ? theme.danger : theme.gold }} />
            </div>
            <span style={{ fontSize: 12, opacity: .8 }}>
              {totalMes > pptoTotal ? '¡Pasaste tu presupuesto del mes!' : `Presupuesto: S/${pptoTotal} · te queda S/${(pptoTotal - totalMes).toFixed(0)}`}
            </span>
          </div>

          <div className="card" style={{ marginBottom: 16 }}>
            {CATS.map((c) => {
              const v = totalesMes[c.id]
              const lim = presupuesto ? presupuesto[c.id] : 0
              const pct = lim > 0 ? v / lim : 0
              const sobre = v > lim
              return (
                <div key={c.id} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 6 }}>
                    <span>{c.icon} {c.label}</span>
                    <span style={{ color: sobre ? theme.danger : theme.green, fontWeight: 700 }}>S/{v.toFixed(0)} <span className="muted" style={{ fontWeight: 400 }}>/ {lim}</span></span>
                  </div>
                  <div className="bar"><span style={{ width: Math.min(100, pct * 100) + '%', background: sobre ? theme.danger : c.color }} /></div>
                </div>
              )
            })}
            {totalMes === 0 && <p className="muted center" style={{ fontSize: 13 }}>Aún no registras gastos este mes.</p>}
          </div>
        </>
      )}

      {/* Registrar gasto (siempre visible) */}
      <form onSubmit={registrar} className="card">
        <p style={{ fontFamily: 'Poppins', fontWeight: 700, color: theme.green, marginBottom: 12 }}>Registrar gasto</p>
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          {CATS.map((c) => (
            <button type="button" key={c.id} onClick={() => setCat(c.id)}
              style={{ flex: 1, padding: '10px 4px', borderRadius: 12, fontSize: 12, fontWeight: 600, border: cat === c.id ? `2px solid ${c.color}` : '1.5px solid #E6E3DC', background: cat === c.id ? c.color + '22' : 'transparent', color: theme.ink }}>
              <div style={{ fontSize: 18 }}>{c.icon}</div>{c.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input className="input" type="number" inputMode="decimal" placeholder="S/ monto" value={monto} onChange={(e) => setMonto(e.target.value)} style={{ flex: 1 }} />
          <input className="input" placeholder="Nota (opcional)" value={nota} onChange={(e) => setNota(e.target.value)} style={{ flex: 1.4 }} />
        </div>
        <div style={{ marginTop: 12 }}><Button type="submit" variant="dark">Agregar</Button></div>
      </form>

      {modal && <BudgetModal presupuesto={presupuesto} onSave={guardarPresupuesto} onClose={() => setModal(false)} />}
    </div>
  )
}

function sumarPorCat(lista) {
  const t = { comida: 0, entretenimiento: 0, transporte: 0 }
  lista.forEach((g) => { t[g.categoria] += g.monto })
  return t
}
function sum(t) { return t.comida + t.entretenimiento + t.transporte }
