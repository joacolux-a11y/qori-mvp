// Capa de datos de Qori — punto único de entrada para las pantallas.
// Elige automáticamente la implementación según haya o no credenciales de Supabase:
//   - Con .env.local configurado  → backend.supabase.js  (auth + tablas en la nube)
//   - Sin credenciales            → backend.local.js      (localStorage, modo demo)
// La interfaz es idéntica en ambas, así que las pantallas no cambian.
import { supabaseEnabled } from './supabaseClient.js'
import * as local from './backend.local.js'
import * as remote from './backend.supabase.js'

const impl = supabaseEnabled ? remote : local

export const usandoSupabase = supabaseEnabled

export function hoyISO() { return new Date().toISOString().slice(0, 10) }

export const signUp = (...a) => impl.signUp(...a)
export const signIn = (...a) => impl.signIn(...a)
export const signOut = (...a) => impl.signOut(...a)
export const getSession = (...a) => impl.getSession(...a)
export const updatePerfil = (...a) => impl.updatePerfil(...a)
export const getProgreso = (...a) => impl.getProgreso(...a)
export const completarReto = (...a) => impl.completarReto(...a)
export const retoCompletadoHoy = (...a) => impl.retoCompletadoHoy(...a)
export const addGasto = (...a) => impl.addGasto(...a)
export const getGastosDelMes = (...a) => impl.getGastosDelMes(...a)
export const getGastos = (...a) => impl.getGastos(...a)
export const resetUsuario = (...a) => impl.resetUsuario(...a)
export const setPlan = (...a) => impl.setPlan(...a)
export const getPresupuesto = (...a) => impl.getPresupuesto(...a)
export const setPresupuesto = (...a) => impl.setPresupuesto(...a)
export const completarLeccion = (...a) => impl.completarLeccion(...a)
