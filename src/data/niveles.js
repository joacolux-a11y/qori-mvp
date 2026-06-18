// Niveles: cada nivel pide acumular cierta cantidad de monedas Qori.
// Cada nivel desbloquea un consejo financiero o un logro visual.
export const niveles = [
  { nivel: 1, nombre: 'Semilla', requiere: 0, insignia: '🌱', consejo: 'Ahorrar no es cuánto guardas, es que lo hagas seguido. Empieza con lo que puedas.' },
  { nivel: 2, nombre: 'Brote', requiere: 60, insignia: '🌿', consejo: 'Pásate los gastos chiquitos: un café diario son ~S/160 al mes. Lo pequeño suma.' },
  { nivel: 3, nombre: 'Raíz', requiere: 150, insignia: '🪴', consejo: 'Arma un "colchón" de emergencia. Apunta a juntar el equivalente a un mes de gastos.' },
  { nivel: 4, nombre: 'Tronco', requiere: 300, insignia: '🌳', consejo: 'Separa tu plata en tres: gastos fijos, gustos y ahorro. Aunque sea 70/20/10.' },
  { nivel: 5, nombre: 'Cosecha', requiere: 500, insignia: '🌾', consejo: 'Cuando tengas tu colchón, infórmate sobre una cuenta de ahorro que te dé interés.' },
  { nivel: 6, nombre: 'Oro', requiere: 800, insignia: '🥇', consejo: 'Ya tienes el hábito. Ponte una meta más grande: un viaje, un curso, tu primer fondo.' },
  { nivel: 7, nombre: 'Qori Maestro', requiere: 1200, insignia: '👑', consejo: 'Comparte lo que aprendiste. Enseñar a alguien más afianza tus propios hábitos.' }
]

export function nivelPorMonedas(monedas) {
  let actual = niveles[0]
  for (const n of niveles) { if (monedas >= n.requiere) actual = n }
  return actual
}

export function siguienteNivel(monedas) {
  for (const n of niveles) { if (monedas < n.requiere) return n }
  return null // ya está en el máximo
}

// Progreso (0..1) hacia el siguiente nivel
export function progresoNivel(monedas) {
  const actual = nivelPorMonedas(monedas)
  const sig = siguienteNivel(monedas)
  if (!sig) return 1
  const span = sig.requiere - actual.requiere
  return span <= 0 ? 1 : (monedas - actual.requiere) / span
}
