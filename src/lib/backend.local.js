// Implementación LOCAL (localStorage). Fallback cuando no hay credenciales Supabase.
const KEY = 'qori_db_v1'
const SESSION = 'qori_session_v1'

const PRESUPUESTO_DEFAULT = { comida: 300, entretenimiento: 150, transporte: 150 }

function load() {
  try {
    const db = JSON.parse(localStorage.getItem(KEY)) || {}
    return { users: db.users || [], progreso: db.progreso || {}, gastos: db.gastos || [], presupuestos: db.presupuestos || {}, insignias: db.insignias || {} }
  } catch {
    return { users: [], progreso: {}, gastos: [], presupuestos: {}, insignias: {} }
  }
}
function save(db) { localStorage.setItem(KEY, JSON.stringify(db)) }
function uid() { return 'u_' + Math.random().toString(36).slice(2, 10) }
function hoyISO() { return new Date().toISOString().slice(0, 10) }
function diasEntre(a, b) {
  return Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 86400000)
}
function publicUser(u) {
  return { id: u.id, email: u.email, nombre: u.nombre, perfil: u.perfil, avatar: u.avatar, plan: u.plan || 'free' }
}

export async function signUp({ email, password, nombre }) {
  const db = load()
  email = email.trim().toLowerCase()
  if (db.users.find((u) => u.email === email)) {
    throw new Error('Ese correo ya está registrado. Intenta iniciar sesión.')
  }
  const user = { id: uid(), email, password, nombre: nombre || '', perfil: null, avatar: null, plan: 'free', created_at: hoyISO() }
  db.users.push(user)
  db.progreso[user.id] = { user_id: user.id, monedas: 0, nivel: 1, streak: 0, ultima_fecha: null, retos_completados: [], lecciones_completadas: [], total_ahorrado: 0 }
  db.presupuestos[user.id] = { ...PRESUPUESTO_DEFAULT }
  save(db)
  localStorage.setItem(SESSION, user.id)
  return publicUser(user)
}

export async function signIn({ email, password }) {
  const db = load()
  email = email.trim().toLowerCase()
  const user = db.users.find((u) => u.email === email)
  if (!user || user.password !== password) throw new Error('Correo o contraseña incorrectos.')
  localStorage.setItem(SESSION, user.id)
  return publicUser(user)
}

export async function signOut() { localStorage.removeItem(SESSION) }

export async function getSession() {
  const id = localStorage.getItem(SESSION)
  if (!id) return null
  const db = load()
  const user = db.users.find((u) => u.id === id)
  return user ? publicUser(user) : null
}

export async function updatePerfil(userId, { perfil, avatar, nombre }) {
  const db = load()
  const user = db.users.find((u) => u.id === userId)
  if (!user) throw new Error('Usuario no encontrado')
  if (perfil !== undefined) user.perfil = perfil
  if (avatar !== undefined) user.avatar = avatar
  if (nombre !== undefined) user.nombre = nombre
  save(db)
  return publicUser(user)
}

export async function getProgreso(userId) {
  const db = load()
  const p = db.progreso[userId]
  if (!p) return null
  if (!p.lecciones_completadas) p.lecciones_completadas = []
  return p
}

export async function completarReto(userId, reto, montoElegido) {
  const db = load()
  const p = db.progreso[userId]
  if (!p) throw new Error('Sin progreso')
  const hoy = hoyISO()
  if (p.retos_completados.some((r) => r.fecha === hoy)) return { progreso: p, yaCompletado: true, ganancia: 0 }
  // Monto personalizado: puntos = monto elegido × 2.
  const monto = Number(montoElegido) > 0 ? Number(montoElegido) : reto.monto
  const qori = Math.round(monto * 2)
  if (p.ultima_fecha && diasEntre(p.ultima_fecha, hoy) === 1) p.streak += 1
  else p.streak = 1
  p.ultima_fecha = hoy
  p.monedas += qori
  p.total_ahorrado += monto
  p.retos_completados.push({ fecha: hoy, retoId: reto.id, qori, monto })
  save(db)
  return { progreso: p, yaCompletado: false, ganancia: qori }
}

export async function retoCompletadoHoy(userId) {
  const db = load()
  const p = db.progreso[userId]
  if (!p) return false
  return p.retos_completados.some((r) => r.fecha === hoyISO())
}

export async function addGasto(userId, { categoria, monto, nota }) {
  const db = load()
  const hoy = hoyISO()
  const g = { id: 'g_' + Math.random().toString(36).slice(2, 9), user_id: userId, fecha: hoy, categoria, monto: Number(monto), nota: nota || '' }
  db.gastos.push(g)
  // Ahorro: recompensa especial → monedas dobles (monto × 2), sube la racha y suma al ahorro.
  let ganancia = 0
  if (categoria === 'ahorro') {
    const p = db.progreso[userId]
    if (p) {
      ganancia = Math.round(Number(monto) * 2)
      if (p.ultima_fecha !== hoy) {
        if (p.ultima_fecha && diasEntre(p.ultima_fecha, hoy) === 1) p.streak += 1
        else p.streak = 1
        p.ultima_fecha = hoy
      }
      p.monedas += ganancia
      p.total_ahorrado += Number(monto)
    }
  }
  save(db)
  return { gasto: g, ganancia }
}

export async function getGastosDelMes(userId, mesISO = hoyISO().slice(0, 7)) {
  const db = load()
  return db.gastos.filter((g) => g.user_id === userId && g.fecha.startsWith(mesISO))
}

export async function getGastos(userId) {
  const db = load()
  return db.gastos.filter((g) => g.user_id === userId).sort((a, b) => b.fecha.localeCompare(a.fecha))
}

export async function resetUsuario(userId) {
  const db = load()
  db.progreso[userId] = { user_id: userId, monedas: 0, nivel: 1, streak: 0, ultima_fecha: null, retos_completados: [], lecciones_completadas: [], total_ahorrado: 0 }
  db.gastos = db.gastos.filter((g) => g.user_id !== userId)
  if (db.insignias) db.insignias[userId] = []
  save(db)
}

// ---------- INSIGNIAS ----------
export async function getInsignias(userId) {
  const db = load()
  return db.insignias[userId] || []
}

// Une las insignias recién desbloqueadas con las ya guardadas (no se pierden nunca).
export async function guardarInsignias(userId, ids) {
  const db = load()
  const set = new Set([...(db.insignias[userId] || []), ...ids])
  db.insignias[userId] = [...set]
  save(db)
  return db.insignias[userId]
}

// ---------- PLAN (freemium) ----------
export async function setPlan(userId, plan) {
  const db = load()
  const user = db.users.find((u) => u.id === userId)
  if (!user) throw new Error('Usuario no encontrado')
  user.plan = plan
  save(db)
  return publicUser(user)
}

// ---------- PRESUPUESTO ----------
export async function getPresupuesto(userId) {
  const db = load()
  return { ...PRESUPUESTO_DEFAULT, ...(db.presupuestos[userId] || {}) }
}

export async function setPresupuesto(userId, presupuesto) {
  const db = load()
  db.presupuestos[userId] = {
    comida: Number(presupuesto.comida),
    entretenimiento: Number(presupuesto.entretenimiento),
    transporte: Number(presupuesto.transporte)
  }
  save(db)
  return db.presupuestos[userId]
}

// ---------- LECCIONES ----------
export async function completarLeccion(userId, leccionId, aciertos) {
  const db = load()
  const p = db.progreso[userId]
  if (!p) throw new Error('Sin progreso')
  if (!p.lecciones_completadas) p.lecciones_completadas = []
  if (p.lecciones_completadas.includes(leccionId)) {
    return { progreso: p, yaCompletada: true, ganancia: 0 }
  }
  const ganancia = aciertos * 10
  p.monedas += ganancia
  p.lecciones_completadas.push(leccionId)
  save(db)
  return { progreso: p, yaCompletada: false, ganancia }
}
