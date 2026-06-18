// Implementación con SUPABASE (auth + tablas). Misma interfaz que backend.local.js.
// Tablas en /supabase/schema.sql. Auth = Supabase Auth (email/password).
import { supabase } from './supabaseClient.js'
import { nivelPorMonedas } from '../data/niveles.js'

function hoyISO() { return new Date().toISOString().slice(0, 10) }
function diasEntre(a, b) {
  return Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 86400000)
}

// Traduce errores comunes de Supabase a mensajes amigables en español.
function traducir(error) {
  const m = (error?.message || '').toLowerCase()
  if (m.includes('already registered') || m.includes('already been registered')) return 'Ese correo ya está registrado. Intenta iniciar sesión.'
  if (m.includes('invalid login')) return 'Correo o contraseña incorrectos.'
  if (m.includes('email not confirmed')) return 'Tu correo aún no está confirmado. Revisa tu bandeja o desactiva la confirmación en Supabase (Auth → Providers → Email).'
  if (m.includes('password')) return 'La contraseña no cumple los requisitos (mínimo 6 caracteres).'
  return error?.message || 'Ocurrió un error inesperado.'
}

const PRESUPUESTO_DEFAULT = { comida: 300, entretenimiento: 150, transporte: 150 }

async function perfilDe(authUser) {
  const { data } = await supabase.from('users').select('nombre, perfil, avatar, plan').eq('id', authUser.id).maybeSingle()
  return {
    id: authUser.id, email: authUser.email,
    nombre: data?.nombre || authUser.user_metadata?.nombre || '',
    perfil: data?.perfil ?? null, avatar: data?.avatar ?? null,
    plan: data?.plan ?? 'free'
  }
}

// Garantiza que existan las filas en users + progreso_usuario + presupuestos (por si el trigger no corrió).
async function asegurarFilas(authUser, nombre) {
  await supabase.from('users').upsert({ id: authUser.id, email: authUser.email, nombre: nombre ?? authUser.user_metadata?.nombre ?? '' }, { onConflict: 'id', ignoreDuplicates: false })
  await supabase.from('progreso_usuario').upsert({ user_id: authUser.id }, { onConflict: 'user_id', ignoreDuplicates: true })
  await supabase.from('presupuestos').upsert({ user_id: authUser.id }, { onConflict: 'user_id', ignoreDuplicates: true })
}

// ---------- AUTH ----------
export async function signUp({ email, password, nombre }) {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: { data: { nombre: nombre || '' } }
  })
  if (error) throw new Error(traducir(error))
  if (!data.session) {
    // Confirmación de correo activada en el proyecto: no hay sesión todavía.
    throw new Error('Cuenta creada. Confirma tu correo para entrar — o desactiva "Confirm email" en Supabase (Auth → Providers → Email) para el MVP.')
  }
  await asegurarFilas(data.user, nombre)
  return perfilDe(data.user)
}

export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password })
  if (error) throw new Error(traducir(error))
  await asegurarFilas(data.user)
  return perfilDe(data.user)
}

export async function signOut() { await supabase.auth.signOut() }

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return null
  return perfilDe(session.user)
}

export async function updatePerfil(userId, patch) {
  const fields = {}
  if (patch.perfil !== undefined) fields.perfil = patch.perfil
  if (patch.avatar !== undefined) fields.avatar = patch.avatar
  if (patch.nombre !== undefined) fields.nombre = patch.nombre
  const { error } = await supabase.from('users').update(fields).eq('id', userId)
  if (error) throw new Error(traducir(error))
  const { data: { user } } = await supabase.auth.getUser()
  return perfilDe(user)
}

// ---------- PROGRESO ----------
export async function getProgreso(userId) {
  let { data: p } = await supabase.from('progreso_usuario').select('*').eq('user_id', userId).maybeSingle()
  if (!p) {
    await supabase.from('progreso_usuario').upsert({ user_id: userId }, { onConflict: 'user_id', ignoreDuplicates: true })
    p = { user_id: userId, monedas: 0, nivel: 1, streak: 0, ultima_fecha: null, total_ahorrado: 0 }
  }
  const { data: rc } = await supabase.from('retos_completados').select('reto_id, fecha, qori, monto').eq('user_id', userId)
  return {
    ...p,
    total_ahorrado: Number(p.total_ahorrado) || 0,
    lecciones_completadas: p.lecciones_completadas || [],
    retos_completados: (rc || []).map((r) => ({ fecha: r.fecha, retoId: r.reto_id, qori: r.qori, monto: Number(r.monto) }))
  }
}

export async function completarReto(userId, reto, montoElegido) {
  const hoy = hoyISO()
  const prog = await getProgreso(userId)
  if (prog.retos_completados.some((r) => r.fecha === hoy)) return { progreso: prog, yaCompletado: true, ganancia: 0 }

  // Monto personalizado: puntos = monto elegido × 2.
  const monto = Number(montoElegido) > 0 ? Number(montoElegido) : reto.monto
  const qori = Math.round(monto * 2)
  const streak = (prog.ultima_fecha && diasEntre(prog.ultima_fecha, hoy) === 1) ? prog.streak + 1 : 1
  const monedas = prog.monedas + qori
  const total = prog.total_ahorrado + monto
  const nivel = nivelPorMonedas(monedas).nivel

  const { error: e1 } = await supabase.from('retos_completados')
    .insert({ user_id: userId, reto_id: reto.id, fecha: hoy, qori, monto })
  if (e1) {
    if ((e1.message || '').includes('duplicate')) return { progreso: prog, yaCompletado: true, ganancia: 0 }
    throw new Error(traducir(e1))
  }
  const { error: e2 } = await supabase.from('progreso_usuario')
    .update({ monedas, total_ahorrado: total, streak, ultima_fecha: hoy, nivel, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
  if (e2) throw new Error(traducir(e2))

  const progreso = await getProgreso(userId)
  return { progreso, yaCompletado: false, ganancia: qori }
}

export async function retoCompletadoHoy(userId) {
  const { data } = await supabase.from('retos_completados').select('id').eq('user_id', userId).eq('fecha', hoyISO()).maybeSingle()
  return Boolean(data)
}

// ---------- GASTOS ----------
export async function addGasto(userId, { categoria, monto, nota }) {
  const hoy = hoyISO()
  const { data, error } = await supabase.from('gastos')
    .insert({ user_id: userId, categoria, monto: Number(monto), nota: nota || '', fecha: hoy })
    .select().single()
  if (error) throw new Error(traducir(error))

  // Ahorro: recompensa especial → monedas dobles, sube la racha y suma al ahorro.
  let ganancia = 0
  if (categoria === 'ahorro') {
    const prog = await getProgreso(userId)
    ganancia = Math.round(Number(monto) * 2)
    const patch = { monedas: prog.monedas + ganancia, total_ahorrado: prog.total_ahorrado + Number(monto), updated_at: new Date().toISOString() }
    if (prog.ultima_fecha !== hoy) {
      patch.streak = (prog.ultima_fecha && diasEntre(prog.ultima_fecha, hoy) === 1) ? prog.streak + 1 : 1
      patch.ultima_fecha = hoy
    }
    patch.nivel = nivelPorMonedas(patch.monedas).nivel
    await supabase.from('progreso_usuario').update(patch).eq('user_id', userId)
  }
  return { gasto: { ...data, monto: Number(data.monto) }, ganancia }
}

export async function getGastosDelMes(userId, mesISO = hoyISO().slice(0, 7)) {
  const desde = mesISO + '-01'
  const { data } = await supabase.from('gastos').select('*')
    .eq('user_id', userId).gte('fecha', desde).order('fecha', { ascending: true })
  return (data || []).map((g) => ({ ...g, monto: Number(g.monto) }))
}

export async function getGastos(userId) {
  const { data } = await supabase.from('gastos').select('*').eq('user_id', userId).order('fecha', { ascending: false })
  return (data || []).map((g) => ({ ...g, monto: Number(g.monto) }))
}

export async function resetUsuario(userId) {
  await supabase.from('retos_completados').delete().eq('user_id', userId)
  await supabase.from('gastos').delete().eq('user_id', userId)
  await supabase.from('insignias_usuario').delete().eq('user_id', userId)
  await supabase.from('progreso_usuario')
    .update({ monedas: 0, nivel: 1, streak: 0, ultima_fecha: null, total_ahorrado: 0, lecciones_completadas: [] })
    .eq('user_id', userId)
}

// ---------- INSIGNIAS ----------
export async function getInsignias(userId) {
  const { data } = await supabase.from('insignias_usuario').select('insignia_id').eq('user_id', userId)
  return (data || []).map((r) => r.insignia_id)
}

export async function guardarInsignias(userId, ids) {
  if (ids && ids.length) {
    const filas = ids.map((insignia_id) => ({ user_id: userId, insignia_id }))
    await supabase.from('insignias_usuario').upsert(filas, { onConflict: 'user_id,insignia_id', ignoreDuplicates: true })
  }
  return getInsignias(userId)
}

// ---------- PLAN (freemium) ----------
export async function setPlan(userId, plan) {
  const { error } = await supabase.from('users').update({ plan }).eq('id', userId)
  if (error) throw new Error(traducir(error))
  const { data: { user } } = await supabase.auth.getUser()
  return perfilDe(user)
}

// ---------- PRESUPUESTO ----------
export async function getPresupuesto(userId) {
  let { data } = await supabase.from('presupuestos').select('comida, entretenimiento, transporte').eq('user_id', userId).maybeSingle()
  if (!data) {
    await supabase.from('presupuestos').upsert({ user_id: userId }, { onConflict: 'user_id', ignoreDuplicates: true })
    data = PRESUPUESTO_DEFAULT
  }
  return { comida: Number(data.comida), entretenimiento: Number(data.entretenimiento), transporte: Number(data.transporte) }
}

export async function setPresupuesto(userId, presupuesto) {
  const fila = {
    user_id: userId,
    comida: Number(presupuesto.comida),
    entretenimiento: Number(presupuesto.entretenimiento),
    transporte: Number(presupuesto.transporte),
    updated_at: new Date().toISOString()
  }
  const { error } = await supabase.from('presupuestos').upsert(fila, { onConflict: 'user_id' })
  if (error) throw new Error(traducir(error))
  return fila
}

// ---------- LECCIONES ----------
export async function completarLeccion(userId, leccionId, aciertos) {
  const prog = await getProgreso(userId)
  const hechas = prog.lecciones_completadas || []
  if (hechas.includes(leccionId)) return { progreso: prog, yaCompletada: true, ganancia: 0 }

  const ganancia = aciertos * 10
  const monedas = prog.monedas + ganancia
  const lecciones = [...hechas, leccionId]
  const { error } = await supabase.from('progreso_usuario')
    .update({ monedas, lecciones_completadas: lecciones, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
  if (error) throw new Error(traducir(error))
  const progreso = await getProgreso(userId)
  return { progreso, yaCompletada: false, ganancia }
}
