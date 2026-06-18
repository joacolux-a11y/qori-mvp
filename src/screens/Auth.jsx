import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { Logo, Button } from '../components/UI.jsx'
import { theme } from '../theme.js'

export default function Auth() {
  const { signUp, signIn } = useAuth()
  const nav = useNavigate()
  const [modo, setModo] = useState('registro') // registro | login
  const [form, setForm] = useState({ nombre: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  async function submit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      if (modo === 'registro') {
        await signUp(form)
        nav('/onboarding')
      } else {
        const u = await signIn(form)
        nav(u.perfil ? '/app' : '/onboarding')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="screen-full" style={{ background: theme.green, color: theme.cream, display: 'flex', flexDirection: 'column' }}>
      <div style={{ paddingTop: 28 }}>
        <div style={{ filter: 'brightness(1.6)' }}><Logo size={32} /></div>
        <h1 style={{ fontSize: 30, marginTop: 28, lineHeight: 1.15 }}>
          Tu oro<br />empieza hoy.
        </h1>
        <p style={{ opacity: .8, marginTop: 10, fontSize: 15 }}>
          Aprende a ahorrar jugando. Retos cortos, premios reales, cero aburrimiento.
        </p>
      </div>

      <form onSubmit={submit} style={{ marginTop: 'auto', background: theme.cream, color: theme.ink, margin: '32px -22px -24px', borderRadius: '28px 28px 0 0', padding: '24px 22px 32px' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {[['registro', 'Crear cuenta'], ['login', 'Iniciar sesión']].map(([k, l]) => (
            <button key={k} type="button" onClick={() => { setModo(k); setError('') }}
              style={{
                flex: 1, padding: '10px', borderRadius: 12, fontWeight: 700, fontSize: 14,
                background: modo === k ? theme.green : 'transparent',
                color: modo === k ? theme.cream : theme.muted,
                border: modo === k ? 'none' : '1.5px solid #E6E3DC'
              }}>{l}</button>
          ))}
        </div>

        {modo === 'registro' && (
          <div style={{ marginBottom: 14 }}>
            <label className="label">¿Cómo te llamas?</label>
            <input className="input" placeholder="Tu nombre" value={form.nombre} onChange={set('nombre')} required />
          </div>
        )}
        <div style={{ marginBottom: 14 }}>
          <label className="label">Correo</label>
          <input className="input" type="email" placeholder="tucorreo@email.com" value={form.email} onChange={set('email')} required />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label className="label">Contraseña</label>
          <input className="input" type="password" placeholder="••••••••" value={form.password} onChange={set('password')} required minLength={4} />
        </div>

        {error && <p style={{ color: theme.danger, fontSize: 13, marginBottom: 12 }}>{error}</p>}

        <Button type="submit" disabled={busy}>
          {busy ? 'Un momento…' : modo === 'registro' ? 'Empezar mi camino' : 'Entrar'}
        </Button>
        <p className="muted center" style={{ fontSize: 12, marginTop: 14 }}>
          Datos guardados en tu dispositivo (demo). Conecta Supabase para usar la nube.
        </p>
      </form>
    </div>
  )
}
