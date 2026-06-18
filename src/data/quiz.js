// Quiz de onboarding: 5 preguntas. Cada opción suma a un perfil.
// Perfiles: gastador, ahorrista, endeudado, indiferente
export const quiz = [
  {
    id: 'q1',
    pregunta: 'Te llega tu sueldo o tu propina. ¿Qué pasa primero?',
    opciones: [
      { texto: 'Ya tengo en mente algo que me quiero comprar', perfil: 'gastador' },
      { texto: 'Separo algo para guardar, aunque sea poco', perfil: 'ahorrista' },
      { texto: 'Pienso en las deudas que tengo que pagar', perfil: 'endeudado' },
      { texto: 'La verdad, ni lo pienso, gasto sobre la marcha', perfil: 'indiferente' }
    ]
  },
  {
    id: 'q2',
    pregunta: '¿Cómo llevas la cuenta de tu plata?',
    opciones: [
      { texto: 'No la llevo, me doy cuenta cuando ya no hay', perfil: 'gastador' },
      { texto: 'Guardo efectivo o en una cuenta, pero sin orden', perfil: 'ahorrista' },
      { texto: 'Sé cuánto debo, eso lo tengo clarísimo', perfil: 'endeudado' },
      { texto: 'No me interesa hacer cuentas', perfil: 'indiferente' }
    ]
  },
  {
    id: 'q3',
    pregunta: 'Cuando piensas en "ahorrar", ¿qué sientes?',
    opciones: [
      { texto: 'Que es difícil, siempre aparece algo que comprar', perfil: 'gastador' },
      { texto: 'Que quiero hacerlo mejor pero no sé por dónde', perfil: 'ahorrista' },
      { texto: 'Que primero tengo que salir de lo que debo', perfil: 'endeudado' },
      { texto: 'Aburrimiento, no es lo mío', perfil: 'indiferente' }
    ]
  },
  {
    id: 'q4',
    pregunta: '¿Qué te haría engancharte con una app de plata?',
    opciones: [
      { texto: 'Que me frene un toque antes de gastar de más', perfil: 'gastador' },
      { texto: 'Ver mi progreso crecer con el tiempo', perfil: 'ahorrista' },
      { texto: 'Un plan claro para reducir mis deudas', perfil: 'endeudado' },
      { texto: 'Que sea entretenida y me dé premios', perfil: 'indiferente' }
    ]
  },
  {
    id: 'q5',
    pregunta: 'Tu meta más honesta con la plata hoy es...',
    opciones: [
      { texto: 'Dejar de gastar en tonterías', perfil: 'gastador' },
      { texto: 'Juntar para algo que quiero', perfil: 'ahorrista' },
      { texto: 'Quedar libre de deudas', perfil: 'endeudado' },
      { texto: 'Solo no quedar en cero a fin de mes', perfil: 'indiferente' }
    ]
  }
]

// Avatares de finanzas según el perfil dominante
export const avatares = {
  gastador: {
    id: 'gastador',
    nombre: 'El Explorador',
    emoji: '🧭',
    titulo: 'Gastador Impulsivo',
    descripcion: 'Vives el momento. Tu superpoder será frenar un toque antes de gastar y sentir el premio cuando ahorras.',
    consejoBase: 'Antes de cada compra que no planeaste, espera 10 minutos. Muchas veces se te pasan las ganas.'
  },
  ahorrista: {
    id: 'ahorrista',
    nombre: 'El Constructor',
    emoji: '🧱',
    titulo: 'Ahorrista Informal',
    descripcion: 'Ya guardas, pero sin estructura. Aquí vas a ver tu progreso crecer, ladrillo por ladrillo.',
    consejoBase: 'Ponle nombre a tu ahorro: "viaje", "emergencia". Ahorrar para algo concreto es más fácil.'
  },
  endeudado: {
    id: 'endeudado',
    nombre: 'El Guerrero',
    emoji: '⚔️',
    titulo: 'Endeudado Consciente',
    descripcion: 'Tienes deudas pero quieres salir. Vamos paso a paso, sin abrumarte, hasta verte libre.',
    consejoBase: 'Lista tus deudas de la más chica a la más grande. Liquida la más chica primero: ese primer triunfo te da impulso.'
  },
  indiferente: {
    id: 'indiferente',
    nombre: 'El Aventurero',
    emoji: '🎲',
    titulo: 'Indiferente Financiero',
    descripcion: 'El tema no te emociona... todavía. Aquí el juego manda: retos cortos, premios y cero aburrimiento.',
    consejoBase: 'No tienes que volverte experto. Con completar un reto al día ya estás ganando.'
  }
}

export function calcularPerfil(respuestas) {
  const conteo = { gastador: 0, ahorrista: 0, endeudado: 0, indiferente: 0 }
  respuestas.forEach((r) => { if (conteo[r] !== undefined) conteo[r]++ })
  let ganador = 'ahorrista'
  let max = -1
  for (const k of Object.keys(conteo)) {
    if (conteo[k] > max) { max = conteo[k]; ganador = k }
  }
  return ganador
}
