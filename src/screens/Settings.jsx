import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { getPresupuesto, setPresupuesto } from '../lib/backend.js'
import BudgetModal from '../components/BudgetModal.jsx'
import { Button } from '../components/UI.jsx'
import { theme } from '../theme.js'

export default function Settings() {
  const { user, signOut } = useAuth()
  const nav = useNavigate()
  const [presupuesto, setPpto] = useState(null)
  const [modal, setModal] = useState(false)
  const esPremium = user?.plan === 'premium'

  useEffect(() => { getPresupuesto(user.id).then(setPpto) }, [])

  async function guardarPresupuesto(val) {
    setPpto(await setPresupuesto(user.id, val))
  }

  const pptoTotal = presupuesto ? presupuesto.comida + presupuesto.entretenimiento + presupuesto.transporte : 0

  return (
    <div className="screen">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <button onClick={() => nav(-1)} className="muted" style={{ fontSize: 20 }}>←</button>
        <h1 style={{ fontSize: 24, color: theme.green }}>Configuración</h1>
      </div>

      {/* Presupuesto */}
      <p style={{ fontFamily: 'Poppins', fontWeight: 700, color: theme.green, marginBottom: 10 }}>Presupuesto mensual</p>
      <button onClick={() => setModal(true)} className="card" style={{ width: '100%', textAlign: 'left', marginBottom: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontWeight: 600, color: theme.green }}>Editar límites por categoría</span>
          <span style={{ fontSize: 18 }}>✏️</span>
        </div>
        {presupuesto && (
          <div className="muted" style={{ fontSize: 13, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span>🍽️ Comida · S/{presupuesto.comida}</span>
            <span>🎬 Entretenimiento · S/{presupuesto.entretenimiento}</span>
            <span>🚌 Transporte · S/{presupuesto.transporte}</span>
            <span style={{ color: theme.green, fontWeight: 700, marginTop: 4 }}>Total: S/{pptoTotal}</span>
          </div>
        )}
      </button>

      {/* Plan */}
      <p style={{ fontFamily: 'Poppins', fontWeight: 700, color: theme.green, margin: '22px 0 10px' }}>Mi plan</p>
      <div className="card" style={{ background: esPremium ? theme.green : theme.white, color: esPremium ? theme.cream : theme.ink }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 18 }}>
              {esPremium ? '👑 Premium' : 'Plan Gratis'}
            </div>
            <div style={{ fontSize: 13, opacity: esPremium ? .85 : .6 }}>
              {esPremium ? 'Tienes acceso a todo Qori' : 'Dashboard, retos, gastos y perfil'}
            </div>
          </div>
          {!esPremium && (
            <button onClick={() => nav('/app/upgrade')}
              style={{ padding: '10px 16px', borderRadius: 12, background: theme.gold, color: '#3a2600', fontWeight: 700, fontSize: 14 }}>
              Mejorar
            </button>
          )}
        </div>
      </div>

      {/* Sesión */}
      <div style={{ marginTop: 28 }}>
        <Button variant="dark" onClick={async () => { await signOut(); nav('/auth') }}>Cerrar sesión</Button>
      </div>
      <p className="muted center" style={{ fontSize: 12, marginTop: 14 }}>{user.email}</p>

      {modal && <BudgetModal presupuesto={presupuesto} onSave={guardarPresupuesto} onClose={() => setModal(false)} />}
    </div>
  )
}
