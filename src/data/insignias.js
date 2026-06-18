// Sistema de insignias (logros) de Qori.
import { niveles } from './niveles.js'

const NIVEL_MAX = niveles[niveles.length - 1].requiere // monedas del nivel máximo

export const insignias = [
  { id: 'semilla', emoji: '🌱', nombre: 'Semilla', requisito: 'Registra tu primer gasto' },
  { id: 'racha7', emoji: '🔥', nombre: 'Racha 7 días', requisito: '7 días seguidos con un registro' },
  { id: 'mes_verde', emoji: '🎯', nombre: 'Mes en verde', requisito: 'No pases tu presupuesto en ninguna categoría' },
  { id: 'estudioso', emoji: '📚', nombre: 'Estudioso', requisito: 'Completa tu primera lección' },
  { id: 'primer_ahorro', emoji: '💰', nombre: 'Primer ahorro', requisito: 'Registra tu primer ahorro' },
  { id: 'maestro', emoji: '🏆', nombre: 'Qori Maestro', requisito: 'Alcanza el nivel máximo' }
]

const CATS_GASTO = ['comida', 'entretenimiento', 'transporte']

// Devuelve los ids de insignias que el usuario CUMPLE ahora mismo, dada su data.
export function evaluarInsignias({ progreso, gastos = [], presupuesto, mesISO }) {
  const ids = []
  const mes = mesISO || new Date().toISOString().slice(0, 7)
  const delMes = gastos.filter((g) => (g.fecha || '').startsWith(mes))

  if (gastos.length > 0) ids.push('semilla')
  if ((progreso?.streak || 0) >= 7) ids.push('racha7')
  if ((progreso?.lecciones_completadas || []).length >= 1) ids.push('estudioso')
  if (gastos.some((g) => g.categoria === 'ahorro')) ids.push('primer_ahorro')
  if ((progreso?.monedas || 0) >= NIVEL_MAX) ids.push('maestro')

  // Mes en verde: hay gasto este mes y ninguna categoría de gasto supera su presupuesto.
  if (presupuesto && delMes.some((g) => CATS_GASTO.includes(g.categoria))) {
    const enVerde = CATS_GASTO.every((c) => {
      const total = delMes.filter((g) => g.categoria === c).reduce((s, g) => s + Number(g.monto), 0)
      return total <= (presupuesto[c] ?? Infinity)
    })
    if (enVerde) ids.push('mes_verde')
  }
  return ids
}
