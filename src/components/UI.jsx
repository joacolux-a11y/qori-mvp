// Componentes visuales compartidos de Qori
import { theme } from '../theme.js'

export function Logo({ size = 28 }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'Poppins', fontWeight: 800, fontSize: size, color: theme.green }}>
      <span style={{
        width: size * 1.05, height: size * 1.05, borderRadius: '50%',
        background: `radial-gradient(circle at 30% 30%, #FFD27A, ${theme.gold})`,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        color: '#6b4400', fontSize: size * 0.6, boxShadow: '0 2px 8px rgba(245,166,35,.4)'
      }}>Q</span>
      Qori
    </span>
  )
}

export function CoinBadge({ value, size = 'md' }) {
  const big = size === 'lg'
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontWeight: 800, fontFamily: 'Poppins',
      fontSize: big ? 30 : 15, color: theme.green
    }}>
      <span style={{ fontSize: big ? 26 : 15 }}>🪙</span>{value}
    </span>
  )
}

export function StreakBadge({ value }) {
  return (
    <span className="pill" style={{ background: '#FFEDE0', color: '#B5531E' }}>
      🔥 {value} {value === 1 ? 'día' : 'días'}
    </span>
  )
}

export function ProgressBar({ value, color = theme.gold }) {
  const pct = Math.max(0, Math.min(1, value)) * 100
  return <div className="bar"><span style={{ width: pct + '%', background: color }} /></div>
}

export function LevelRing({ nivel }) {
  return (
    <div style={{
      width: 56, height: 56, borderRadius: '50%',
      background: theme.green, color: theme.cream,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Poppins', lineHeight: 1
    }}>
      <span style={{ fontSize: 10, opacity: .7 }}>NIVEL</span>
      <span style={{ fontSize: 22, fontWeight: 800 }}>{nivel}</span>
    </div>
  )
}

export function Button({ children, variant = 'primary', ...props }) {
  return <button className={`btn btn-${variant}`} {...props}>{children}</button>
}
