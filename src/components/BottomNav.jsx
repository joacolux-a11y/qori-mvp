import { NavLink } from 'react-router-dom'

const items = [
  { to: '/app', label: 'Inicio', icon: '🏠', end: true },
  { to: '/app/lecciones', label: 'Lecciones', icon: '📚' },
  { to: '/app/noticias', label: 'Noticias', icon: '📰' },
  { to: '/app/gastos', label: 'Gastos', icon: '📊' },
  { to: '/app/perfil', label: 'Perfil', icon: '👤' }
]

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {items.map((it) => (
        <NavLink key={it.to} to={it.to} end={it.end}
          className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          {({ isActive }) => (
            <>
              <span style={{ fontSize: 20 }}>{it.icon}</span>
              {it.label}
              {isActive && <span className="nav-dot" />}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
