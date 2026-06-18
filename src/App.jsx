import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import BottomNav from './components/BottomNav.jsx'
import Auth from './screens/Auth.jsx'
import Onboarding from './screens/Onboarding.jsx'
import Dashboard from './screens/Dashboard.jsx'
import DailyChallenge from './screens/DailyChallenge.jsx'
import ExpenseTracker from './screens/ExpenseTracker.jsx'
import Profile from './screens/Profile.jsx'
import Lessons from './screens/Lessons.jsx'
import LessonPlayer from './screens/LessonPlayer.jsx'
import News from './screens/News.jsx'
import Upgrade from './screens/Upgrade.jsx'
import Settings from './screens/Settings.jsx'

function Shell({ children }) {
  return <div className="app-shell">{children}</div>
}

// Rutas inmersivas: flujos a pantalla completa, sin barra inferior.
function esInmersiva(pathname) {
  return /^\/app\/lecciones\/.+/.test(pathname) ||
    pathname === '/app/reto' ||
    pathname === '/app/upgrade'
}

function AppLayout() {
  const { user } = useAuth()
  const loc = useLocation()
  if (!user) return <Navigate to="/auth" replace />
  if (!user.perfil) return <Navigate to="/onboarding" replace />
  return (
    <>
      <Outlet />
      {!esInmersiva(loc.pathname) && <BottomNav />}
    </>
  )
}

export default function App() {
  const { user, loading } = useAuth()
  const loc = useLocation()

  if (loading) {
    return <Shell><div className="screen-full center" style={{ display: 'grid', placeItems: 'center' }}>
      <div className="muted">Cargando Qori…</div>
    </div></Shell>
  }

  return (
    <Shell>
      <Routes location={loc}>
        <Route path="/" element={<Navigate to={user ? '/app' : '/auth'} replace />} />
        <Route path="/auth" element={user ? <Navigate to="/app" replace /> : <Auth />} />
        <Route path="/onboarding" element={user ? <Onboarding /> : <Navigate to="/auth" replace />} />
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="reto" element={<DailyChallenge />} />
          <Route path="lecciones" element={<Lessons />} />
          <Route path="lecciones/:id" element={<LessonPlayer />} />
          <Route path="noticias" element={<News />} />
          <Route path="gastos" element={<ExpenseTracker />} />
          <Route path="perfil" element={<Profile />} />
          <Route path="config" element={<Settings />} />
          <Route path="upgrade" element={<Upgrade />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Shell>
  )
}
