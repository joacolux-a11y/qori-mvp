// Quiz de onboarding: 5 preguntas conversacionales. Cada opción suma a un perfil.
// Perfiles: ahorrista, indiferente, gastador, endeudado
export const quiz = [
  {
    id: 'q1',
    pregunta: '¿Qué suele pasar a fin de quincena?',
    opciones: [
      { texto: 'Me sobra plata', perfil: 'ahorrista' },
      { texto: 'Justo justo', perfil: 'indiferente' },
      { texto: 'Me falta plata', perfil: 'gastador' },
      { texto: 'Tengo deudas que pagar', perfil: 'endeudado' }
    ]
  },
  {
    id: 'q2',
    pregunta: '¿Cuánto ahorras al mes?',
    opciones: [
      { texto: 'Tengo una meta fija', perfil: 'ahorrista' },
      { texto: 'Algo cuando sobra', perfil: 'indiferente' },
      { texto: 'Casi nada', perfil: 'gastador' },
      { texto: 'Nada, primero pago deudas', perfil: 'endeudado' }
    ]
  },
  {
    id: 'q3',
    pregunta: '¿Tienes deudas ahora mismo?',
    opciones: [
      { texto: 'No tengo ninguna', perfil: 'ahorrista' },
      { texto: 'Sí, pero las manejo', perfil: 'indiferente' },
      { texto: 'Sí, me preocupan un poco', perfil: 'gastador' },
      { texto: 'Sí, es mi mayor problema', perfil: 'endeudado' }
    ]
  },
  {
    id: 'q4',
    pregunta: 'Cuando ves algo que quieres comprar pero no planeabas...',
    opciones: [
      { texto: 'Lo pienso bien antes', perfil: 'ahorrista' },
      { texto: 'A veces lo compro', perfil: 'indiferente' },
      { texto: 'Casi siempre lo compro', perfil: 'gastador' },
      { texto: 'No compro nada extra', perfil: 'endeudado' }
    ]
  },
  {
    id: 'q5',
    pregunta: '¿Qué te gustaría lograr con Qori?',
    opciones: [
      { texto: 'Ahorrar más cada mes', perfil: 'ahorrista' },
      { texto: 'Entender mejor mi plata', perfil: 'indiferente' },
      { texto: 'Gastar menos en cosas que no necesito', perfil: 'gastador' },
      { texto: 'Salir de mis deudas', perfil: 'endeudado' }
    ]
  }
]

// Avatares de finanzas según el perfil dominante.
export const avatares = {
  ahorrista: {
    id: 'ahorrista',
    nombre: 'El Constructor',
    emoji: '🏗️',
    titulo: 'Ahorrista',
    descripcion: 'Ya tienes el hábito. Aquí vas a ver tu progreso crecer, ladrillo por ladrillo, hasta cumplir tus metas.',
    consejoBase: 'Ponle nombre a tu ahorro: "viaje", "emergencia". Ahorrar para algo concreto lo hace más fácil.'
  },
  indiferente: {
    id: 'indiferente',
    nombre: 'El Explorador',
    emoji: '🧭',
    titulo: 'Indiferente',
    descripcion: 'Llevas tu plata sobre la marcha. Vamos a explorar juntos, sin complicarte, para que entiendas mejor en qué se te va.',
    consejoBase: 'No tienes que volverte experto. Con anotar tus gastos del día ya estás dando el primer paso.'
  },
  gastador: {
    id: 'gastador',
    nombre: 'El Guerrero',
    emoji: '⚔️',
    titulo: 'Gastador',
    descripcion: 'Vives el momento y a veces se te va la mano. Tu batalla será frenar un toque antes de gastar y sentir el premio al ahorrar.',
    consejoBase: 'Antes de cada compra que no planeaste, espera 10 minutos. Muchas veces se te pasan las ganas.'
  },
  endeudado: {
    id: 'endeudado',
    nombre: 'El Aventurero',
    emoji: '🎯',
    titulo: 'Endeudado',
    descripcion: 'Tienes deudas pero quieres salir. Vamos paso a paso, sin abrumarte, hasta verte libre.',
    consejoBase: 'Lista tus deudas de la más chica a la más grande. Liquida la más chica primero: ese triunfo te da impulso.'
  }
}

export function calcularPerfil(respuestas) {
  const conteo = { ahorrista: 0, indiferente: 0, gastador: 0, endeudado: 0 }
  respuestas.forEach((r) => { if (conteo[r] !== undefined) conteo[r]++ })
  let ganador = 'ahorrista'
  let max = -1
  for (const k of Object.keys(conteo)) {
    if (conteo[k] > max) { max = conteo[k]; ganador = k }
  }
  return ganador
}
