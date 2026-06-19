import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { addGasto, getGastosDelMes, getPresupuesto, setPresupuesto, hoyISO } from '../lib/backend.js'
import BudgetModal from '../components/BudgetModal.jsx'
import VoiceExpense from '../components/VoiceExpense.jsx'
import { Button, CoinBadge } from '../components/UI.jsx'
import { theme } from '../theme.js'

const CATS = [
  { id: 'comida', label: 'Comida', icon: '🍽️', color: theme.categories.comida, gasto: true },
  { id: 'transporte', label: 'Transporte', icon: '🚌', color: theme.categories.transporte, gasto: true },
  { id: 'entretenimiento', label: 'Diversión', icon: '🎬', color: theme.categories.entretenimiento, gasto: true },
  { id: 'ahorro', label: 'Ahorro', icon: '💰', color: theme.ahorroGreen, gasto: false }
]
const GASTO_CATS = CATS.filter((c) => c.gasto)
const diasDelMes = () => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate() }

export default function ExpenseTracker() {
  const { user, refreshProgreso } = useAuth()
  const [tab, setTab] = useState('hoy')
  const [gastos, setGastos] = useState([])
  const [presupuesto, setPpto] = useState(null)
  const [cat, setCat] = useState('comida')
  const [display, setDisplay] = useState('')
  const [modalBudget, setModalBudget] = useState(false)
  const [verHist, setVerHist] = useState(false)
  const [festejo, setFestejo] = useState(null) // ahorro: { monto, qori }

  async function cargar() {
    setGastos(await getGastosDelMes(user.id))
    setPpto(await getPresupuesto(user.id))
  }
  useEffect(() => { cargar() }, [])

  const monto = parseFloat(display || '0')

  function tecla(k) {
    if (k === '⌫') { setDisplay((d) => d.slice(0, -1)); return }
    if (k === '.') { setDisplay((d) => (d.includes('.') ? d : (d || '0') + '.')); return }
    setDisplay((d) => {
      if (d.includes('.') && d.split('.')[1].length >= 2) return d // máx 2 decimales
      if (d === '0') return k
      return (d + k).slice(0, 9)
    })
  }

  // Registro central (lo usan el teclado y el dictado por voz).
  async function registrarGasto(categoria, montoVal) {
    const { ganancia } = await addGasto(user.id, { categoria, monto: montoVal, nota: '' })
    await cargar()
    if (categoria === 'ahorro') { await refreshProgreso(); setFestejo({ monto: montoVal, qori: ganancia }) }
  }

  async function registrar() {
    if (!monto || monto <= 0) return
    await registrarGasto(cat, monto)
    setDisplay('')
  }

  async function guardarPresupuesto(val) { setPpto(await setPresupuesto(user.id, val)) }

  const hoy = hoyISO()
  const gastosHoy = useMemo(() => gastos.filter((g) => g.fecha === hoy), [gastos, hoy])
  const totMes = useMemo(() => sumarPorCat(gastos), [gastos])
  const totHoy = useMemo(() => sumarPorCat(gastosHoy), [gastosHoy])
  const ahorradoHoy = totHoy.ahorro
  const gastadoHoy = totHoy.comida + totHoy.entretenimiento + totHoy.transporte
  const gastadoMes = totMes.comida + totMes.entretenimiento + totMes.transporte
  const pptoTotal = presupuesto ? presupuesto.comida + presupuesto.entretenimiento + presupuesto.transporte : 0
  const dias = diasDelMes()
  const mesNombre = new Date().toLocaleDateString('es-PE', { month: 'long' })
  const catSel = CATS.find((c) => c.id === cat)

  return (
    <div className="screen">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h1 style={{ fontSize: 26, color: theme.green }}>Mis gastos</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setVerHist(true)} title="Ver historial"
            style={{ width: 40, height: 40, borderRadius: 12, background: theme.white, boxShadow: 'var(--shadow-sm)', fontSize: 18 }}>📜</button>
          <button onClick={() => setModalBudget(true)} title="Editar presupuesto"
            style={{ width: 40, height: 40, borderRadius: 12, background: theme.white, boxShadow: 'var(--shadow-sm)', fontSize: 18 }}>✏️</button>
        </div>
      </div>

      {/* ----- Calculadora de registro rápido ----- */}
      <div className="card" style={{ padding: 16, marginBottom: 18 }}>
        <div style={{ textAlign: 'center', padding: '8px 0 14px' }}>
          <span className="muted" style={{ fontSize: 12 }}>{catSel?.icon} {cat === 'ahorro' ? 'Vas a ahorrar' : 'Vas a gastar'}</span>
          <div style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 44, color: cat === 'ahorro' ? theme.ahorroGreen : theme.green, lineHeight: 1.1 }}>
            S/ {display || '0'}
          </div>
        </div>

        {/* Selector de categoría */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
          {CATS.map((c) => (
            <button key={c.id} onClick={() => setCat(c.id)}
              style={{
                flex: 1, padding: '9px 2px', borderRadius: 12, fontSize: 10.5, fontWeight: 700,
                border: cat === c.id ? `2px solid ${theme.gold}` : '1.5px solid #E6E3DC',
                background: cat === c.id ? theme.gold + '26' : 'transparent', color: theme.ink
              }}>
              <div style={{ fontSize: 20 }}>{c.icon}</div>{c.label}
            </button>
          ))}
        </div>

        {/* Teclado 4x3 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 12 }}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'].map((k) => (
            <button key={k} onClick={() => tecla(k)}
              style={{ padding: '16px 0', borderRadius: 14, background: theme.cream, border: '1.5px solid #ECE9E1', fontSize: 22, fontWeight: 700, color: theme.green, fontFamily: 'Poppins' }}>
              {k}
            </button>
          ))}
        </div>

        <Button variant="dark" onClick={registrar} disabled={!monto || monto <= 0}>
          {cat === 'ahorro' ? '💰 Registrar ahorro' : 'Registrar gasto'}
        </Button>

        {/* Registro por voz (Web Speech API + IA) */}
        <VoiceExpense onConfirm={registrarGasto} />
      </div>

      {/* Tabs de resumen */}
      <div style={{ display: 'flex', gap: 8, background: '#ECE9E1', padding: 4, borderRadius: 14, marginBottom: 16 }}>
        {[['hoy', 'Hoy'], ['mes', 'Este mes']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            style={{ flex: 1, padding: '9px', borderRadius: 11, fontWeight: 700, fontSize: 14, background: tab === k ? theme.white : 'transparent', color: tab === k ? theme.green : theme.muted, boxShadow: tab === k ? 'var(--shadow-sm)' : 'none' }}>
            {l}
          </button>
        ))}
      </div>

      {/* ----- TAB HOY: límite diario por categoría ----- */}
      {tab === 'hoy' && (
        <>
          <div className="card" style={{ background: theme.green, color: theme.cream, marginBottom: 14, display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
            <div><div style={{ fontSize: 12, opacity: .8 }}>Gastado hoy</div><div style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 22 }}>S/{gastadoHoy.toFixed(0)}</div></div>
            <div style={{ width: 1, background: 'rgba(255,255,255,.2)' }} />
            <div><div style={{ fontSize: 12, opacity: .8 }}>Ahorrado hoy</div><div style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 22, color: '#9BE8B6' }}>S/{ahorradoHoy.toFixed(0)}</div></div>
          </div>

          <div className="card" style={{ marginBottom: 16 }}>
            <p className="muted" style={{ fontSize: 12, marginBottom: 12 }}>Límite diario (presupuesto del mes ÷ {dias} días)</p>
            {GASTO_CATS.map((c) => {
              const limite = presupuesto ? presupuesto[c.id] / dias : 0
              const v = totHoy[c.id]
              const pct = limite > 0 ? v / limite : 0
              const sobre = v > limite && limite > 0
              return (
                <div key={c.id} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 6 }}>
                    <span>{c.icon} {c.label}</span>
                    <span style={{ color: sobre ? theme.danger : theme.green, fontWeight: 700 }}>S/{v.toFixed(0)} <span className="muted" style={{ fontWeight: 400 }}>/ {limite.toFixed(0)}</span></span>
                  </div>
                  <div className="bar"><span style={{ width: Math.min(100, pct * 100) + '%', background: sobre ? theme.danger : c.color }} /></div>
                  {sobre && <p style={{ color: theme.danger, fontSize: 12, marginTop: 5 }}>¡Ojo! Pasaste tu límite de hoy</p>}
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* ----- TAB MES ----- */}
      {tab === 'mes' && (
        <>
          <div className="card" style={{ background: theme.green, color: theme.cream, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: 13, opacity: .8, textTransform: 'capitalize' }}>{mesNombre}</span>
              <span style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 24 }}>S/{gastadoMes.toFixed(0)}</span>
            </div>
            <div className="bar" style={{ margin: '12px 0 6px', background: 'rgba(255,255,255,.15)' }}>
              <span style={{ width: Math.min(100, pptoTotal ? (gastadoMes / pptoTotal) * 100 : 0) + '%', background: gastadoMes > pptoTotal ? theme.danger : theme.gold }} />
            </div>
            <span style={{ fontSize: 12, opacity: .8 }}>
              {gastadoMes > pptoTotal ? '¡Pasaste tu presupuesto del mes!' : `Presupuesto: S/${pptoTotal} · te queda S/${(pptoTotal - gastadoMes).toFixed(0)}`}
            </span>
            {totMes.ahorro > 0 && <div style={{ marginTop: 10, fontSize: 13, color: '#9BE8B6' }}>💰 Ahorrado este mes: S/{totMes.ahorro.toFixed(0)}</div>}
          </div>

          <div className="card" style={{ marginBottom: 16 }}>
            {GASTO_CATS.map((c) => {
              const v = totMes[c.id]
              const lim = presupuesto ? presupuesto[c.id] : 0
              const sobre = v > lim
              return (
                <div key={c.id} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 6 }}>
                    <span>{c.icon} {c.label}</span>
                    <span style={{ color: sobre ? theme.danger : theme.green, fontWeight: 700 }}>S/{v.toFixed(0)} <span className="muted" style={{ fontWeight: 400 }}>/ {lim}</span></span>
                  </div>
                  <div className="bar"><span style={{ width: Math.min(100, lim > 0 ? (v / lim) * 100 : 0) + '%', background: sobre ? theme.danger : c.color }} /></div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {modalBudget && <BudgetModal presupuesto={presupuesto} onSave={guardarPresupuesto} onClose={() => setModalBudget(false)} />}
      {verHist && <HistorialModal gastos={gastos} onClose={() => setVerHist(false)} />}
      {festejo && <FestejoAhorro festejo={festejo} onClose={() => setFestejo(null)} />}
    </div>
  )
}

function HistorialModal({ gastos, onClose }) {
  const lista = [...gastos].sort((a, b) => b.fecha.localeCompare(a.fecha))
  return (
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(21,36,31,.45)', display: 'flex', alignItems: 'flex-end', zIndex: 50 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxHeight: '75%', overflowY: 'auto', background: theme.cream, borderRadius: '24px 24px 0 0', padding: '22px 20px 28px' }}>
        <div style={{ width: 40, height: 4, background: '#DCD8CF', borderRadius: 99, margin: '0 auto 18px' }} />
        <h2 style={{ fontSize: 20, color: theme.green, marginBottom: 14 }}>📜 Historial del mes</h2>
        {lista.length === 0 && <p className="muted center" style={{ fontSize: 14, padding: '20px 0' }}>Aún no hay movimientos este mes.</p>}
        {lista.map((g) => {
          const c = CATS.find((x) => x.id === g.categoria)
          const esAhorro = g.categoria === 'ahorro'
          return (
            <div key={g.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 4px', borderBottom: '1px solid #EFECE4' }}>
              <span style={{ fontSize: 14 }}>{c?.icon} {g.nota || c?.label}<span className="muted" style={{ fontSize: 11, marginLeft: 6 }}>{g.fecha.slice(5)}</span></span>
              <b style={{ color: esAhorro ? theme.ahorroGreen : theme.ink }}>{esAhorro ? '+' : ''}S/{Number(g.monto).toFixed(0)}</b>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function FestejoAhorro({ festejo, onClose }) {
  return (
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(21,36,31,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60, padding: 24 }}>
      <div onClick={(e) => e.stopPropagation()} className="card pop center" style={{ maxWidth: 320 }}>
        <div style={{ fontSize: 64 }}>💰</div>
        <h2 style={{ fontSize: 22, color: theme.ahorroGreen, marginTop: 6 }}>¡Ahorraste S/{festejo.monto}!</h2>
        <p style={{ fontSize: 16, margin: '8px 0 4px' }}>Ganaste <b style={{ color: theme.gold }}>+{festejo.qori} 🪙</b></p>
        <p className="muted" style={{ fontSize: 13, marginBottom: 16 }}>Monedas dobles por ahorrar 🔥 ¡y tu racha sube!</p>
        <Button onClick={onClose}>¡Sigamos!</Button>
      </div>
    </div>
  )
}

function sumarPorCat(lista) {
  const t = { comida: 0, entretenimiento: 0, transporte: 0, ahorro: 0 }
  lista.forEach((g) => { t[g.categoria] = (t[g.categoria] || 0) + Number(g.monto) })
  return t
}
