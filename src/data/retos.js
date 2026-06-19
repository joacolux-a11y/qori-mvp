// Retos diarios — accionables en <24h, calibrados para ingresos de S/1,000–3,000.
// "monto" = soles base sugeridos. "qori" = monedas base. "perfil" = a quién aplica
// ('general' aplica a todos; o uno de: ahorrista, indiferente, gastador, endeudado).
export const retos = [
  // ---------- Generales (aplican a todos) ----------
  { id: 'r1', titulo: 'Café de casa', texto: 'Hoy no compres café afuera. Prepáralo en casa y ahorra S/8.', monto: 8, qori: 20, cat: 'comida', perfil: 'general' },
  { id: 'r2', titulo: 'Almuerzo de tópper', texto: 'Llévate el almuerzo en lugar de pedir delivery. Ahorras unos S/15.', monto: 15, qori: 30, cat: 'comida', perfil: 'general' },
  { id: 'r3', titulo: 'Caminata corta', texto: 'Si el viaje es de menos de 15 min, camina en vez de tomar taxi. Ahorra S/10.', monto: 10, qori: 25, cat: 'transporte', perfil: 'general' },
  { id: 'r4', titulo: 'Lista antes de salir', texto: 'Antes de ir a la bodega, anota qué necesitas y compra solo eso.', monto: 12, qori: 20, cat: 'comida', perfil: 'general' },
  { id: 'r5', titulo: 'Día sin antojos', texto: 'Pasa el día sin comprar ningún snack ni golosina de impulso. Ahorra S/5.', monto: 5, qori: 20, cat: 'comida', perfil: 'general' },
  { id: 'r6', titulo: 'Botella propia', texto: 'Lleva tu botella de agua y no compres bebidas afuera. Ahorra S/6.', monto: 6, qori: 15, cat: 'comida', perfil: 'general' },
  { id: 'r7', titulo: 'Recarga combinada', texto: 'Junta tus trámites en un solo viaje para no gastar de más en pasajes.', monto: 8, qori: 20, cat: 'transporte', perfil: 'general' },
  { id: 'r8', titulo: 'Combi en vez de taxi', texto: 'Usa transporte público para un trayecto que ibas a hacer en taxi. Ahorra S/12.', monto: 12, qori: 25, cat: 'transporte', perfil: 'general' },

  // ---------- Ahorrista (El Constructor 🏗️) ----------
  { id: 'a1', titulo: 'Sube tu meta', texto: 'Aumenta tu meta de ahorro de esta semana en S/20. Tú puedes con más.', monto: 20, qori: 35, cat: 'comida', perfil: 'ahorrista' },
  { id: 'a2', titulo: 'Reto sin gastos', texto: 'Pásate todo el día sin gastar nada que no sea estrictamente necesario.', monto: 25, qori: 40, cat: 'entretenimiento', perfil: 'ahorrista' },
  { id: 'a3', titulo: 'Cuenta con interés', texto: 'Averigua hoy una caja o banco que pague más TREA y mueve un poco de tu ahorro ahí.', monto: 0, qori: 30, cat: 'comida', perfil: 'ahorrista' },
  { id: 'a4', titulo: 'Ahorro fantasma', texto: 'Mete al chanchito el monto de un gusto que NO te diste hoy.', monto: 15, qori: 30, cat: 'entretenimiento', perfil: 'ahorrista' },

  // ---------- Gastador (El Guerrero ⚔️) ----------
  { id: 'g1', titulo: 'Regla de los 10 minutos', texto: 'Antes de cualquier compra que no planeabas, espera 10 minutos. Si se te pasan las ganas, ahorraste.', monto: 20, qori: 35, cat: 'entretenimiento', perfil: 'gastador' },
  { id: 'g2', titulo: 'Día sin delivery', texto: 'Hoy cero apps de delivery. Cocina o come en casa y ahorra lo del envío + propina.', monto: 18, qori: 35, cat: 'comida', perfil: 'gastador' },
  { id: 'g3', titulo: 'Carrito en pausa', texto: 'Deja en el carrito eso que ibas a comprar online y revísalo mañana.', monto: 30, qori: 40, cat: 'entretenimiento', perfil: 'gastador' },
  { id: 'g4', titulo: 'Solo efectivo hoy', texto: 'Sal con un monto fijo en efectivo y guarda la tarjeta. Cuando se acaba, se acabó.', monto: 15, qori: 30, cat: 'entretenimiento', perfil: 'gastador' },

  // ---------- Endeudado (El Aventurero 🎯) ----------
  { id: 'e1', titulo: 'La deuda más chica', texto: 'Identifica tu deuda más pequeña y abónale algo hoy. El primer triunfo da impulso.', monto: 20, qori: 40, cat: 'entretenimiento', perfil: 'endeudado' },
  { id: 'e2', titulo: 'Mapa de deudas', texto: 'Anota todas tus deudas con su monto y a quién le debes. Verlas claro es el primer paso.', monto: 0, qori: 30, cat: 'comida', perfil: 'endeudado' },
  { id: 'e3', titulo: 'Sin nuevas deudas', texto: 'Hoy no uses la tarjeta de crédito para nada. Ni una cuota más.', monto: 15, qori: 35, cat: 'entretenimiento', perfil: 'endeudado' },
  { id: 'e4', titulo: 'Abono extra', texto: 'Junta cualquier sencillo que te sobre hoy y abónalo a tu deuda principal.', monto: 10, qori: 30, cat: 'comida', perfil: 'endeudado' },

  // ---------- Indiferente (El Explorador 🧭) ----------
  { id: 'i1', titulo: 'Anota tus gastos', texto: 'Anota 3 cosas en las que gastaste hoy. Sin juzgar, solo para verlas.', monto: 0, qori: 25, cat: 'comida', perfil: 'indiferente' },
  { id: 'i2', titulo: 'Tu gasto hormiga', texto: 'Identifica un gastito diario que repites (gaseosa, snack) y hoy sáltatelo.', monto: 6, qori: 25, cat: 'comida', perfil: 'indiferente' },
  { id: 'i3', titulo: 'Revisa tu saldo', texto: 'Entra a tu app del banco y mira cuánto tienes de verdad. Conocerlo ya es ganar.', monto: 0, qori: 20, cat: 'comida', perfil: 'indiferente' },
  { id: 'i4', titulo: 'Guarda S/5', texto: 'Separa solo S/5 hoy a un lado. Empezar pequeño también cuenta.', monto: 5, qori: 25, cat: 'comida', perfil: 'indiferente' }
]

// Retos disponibles para un perfil: los suyos + los generales.
// Si no hay perfil, solo generales.
export function retosDePerfil(perfil) {
  return retos.filter((r) => r.perfil === 'general' || (perfil && r.perfil === perfil))
}

// Elige el reto del día de forma estable según la fecha (mismo reto todo el día),
// filtrado por el perfil del usuario.
export function retoDelDia(fechaISO, perfil) {
  const pool = retosDePerfil(perfil)
  const dias = Math.floor(new Date(fechaISO).getTime() / 86400000)
  return pool[dias % pool.length]
}
