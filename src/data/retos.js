// Retos diarios — accionables en <24h, calibrados para ingresos de S/1,000–3,000.
// "monto" = soles que aproximadamente ahorras al completarlo. "qori" = monedas que ganas.
export const retos = [
  { id: 'r1', titulo: 'Café de casa', texto: 'Hoy no compres café afuera. Prepáralo en casa y ahorra S/8.', monto: 8, qori: 20, cat: 'comida' },
  { id: 'r2', titulo: 'Almuerzo de tópper', texto: 'Llévate el almuerzo en lugar de pedir delivery. Ahorras unos S/15.', monto: 15, qori: 30, cat: 'comida' },
  { id: 'r3', titulo: 'Caminata corta', texto: 'Si el viaje es de menos de 15 min, camina en vez de tomar taxi. Ahorra S/10.', monto: 10, qori: 25, cat: 'transporte' },
  { id: 'r4', titulo: 'Lista antes de salir', texto: 'Antes de ir a la bodega, anota qué necesitas y compra solo eso.', monto: 12, qori: 20, cat: 'comida' },
  { id: 'r5', titulo: 'Día sin antojos', texto: 'Pasa el día sin comprar ningún snack ni golosina de impulso. Ahorra S/5.', monto: 5, qori: 20, cat: 'comida' },
  { id: 'r6', titulo: 'Regla de los 10 minutos', texto: '¿Quieres comprar algo no planeado? Espera 10 min. Si se te pasan las ganas, ahorraste.', monto: 20, qori: 35, cat: 'entretenimiento' },
  { id: 'r7', titulo: 'Suscripción dormida', texto: 'Revisa una suscripción que no uses (música, apps) y cancélala hoy.', monto: 16, qori: 40, cat: 'entretenimiento' },
  { id: 'r8', titulo: 'Recarga combinada', texto: 'Junta tus trámites en un solo viaje para no gastar de más en pasajes.', monto: 8, qori: 20, cat: 'transporte' },
  { id: 'r9', titulo: 'Botella propia', texto: 'Lleva tu botella de agua y no compres bebidas afuera. Ahorra S/6.', monto: 6, qori: 15, cat: 'comida' },
  { id: 'r10', titulo: 'Noche en casa', texto: 'Cambia una salida por un plan en casa con amigos. Ahorra S/30.', monto: 30, qori: 45, cat: 'entretenimiento' },
  { id: 'r11', titulo: 'Revisa antes de pagar', texto: 'Antes de una compra grande, busca el mismo producto más barato en otro lado.', monto: 25, qori: 35, cat: 'entretenimiento' },
  { id: 'r12', titulo: 'Apaga lo que no usas', texto: 'Desconecta aparatos en standby hoy. Pequeño ahorro en tu recibo de luz.', monto: 4, qori: 15, cat: 'entretenimiento' },
  { id: 'r13', titulo: 'Guarda el vuelto', texto: 'Todo el sencillo que te sobre hoy, sepáralo en tu chanchito. Ahorra S/5.', monto: 5, qori: 20, cat: 'comida' },
  { id: 'r14', titulo: 'Combi en vez de taxi', texto: 'Usa transporte público para un trayecto que ibas a hacer en taxi. Ahorra S/12.', monto: 12, qori: 25, cat: 'transporte' }
]

// Elige el reto del día de forma estable según la fecha (mismo reto todo el día).
export function retoDelDia(fechaISO) {
  const dias = Math.floor(new Date(fechaISO).getTime() / 86400000)
  return retos[dias % retos.length]
}
