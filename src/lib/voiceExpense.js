// Interpreta un gasto dicho por voz y lo convierte en { monto, categoria }.
//
// Usa Google Gemini (gemini-1.5-flash) si hay VITE_GEMINI_KEY configurada.
// Si no hay key o la API falla, intenta un intérprete LOCAL simple para que la
// función siga siendo usable en modo demo. Si nada logra extraer un monto, lanza error.

const GEMINI_KEY = import.meta.env.VITE_GEMINI_KEY
const CATEGORIAS = ['comida', 'transporte', 'entretenimiento', 'ahorro']

// Valida que el resultado tenga un monto positivo y una categoría permitida.
function validar(obj) {
  if (!obj) return null
  const monto = Number(obj.monto)
  const categoria = String(obj.categoria || '').toLowerCase().trim()
  if (!monto || monto <= 0 || !Number.isFinite(monto)) return null
  if (!CATEGORIAS.includes(categoria)) return null
  return { monto: Math.round(monto * 100) / 100, categoria }
}

// Intérprete local de respaldo: regex para el monto + palabras clave para la categoría.
function interpretarLocal(texto) {
  const t = (texto || '').toLowerCase()
  const m = t.replace(',', '.').match(/(\d+(?:\.\d{1,2})?)/)
  if (!m) return null
  const monto = parseFloat(m[1])

  let categoria = null
  if (/(ahorr|guard|chanchito|separ)/.test(t)) categoria = 'ahorro'
  else if (/(taxi|combi|pasaje|bus|uber|metropolitano|gasolina|transport|micro|mototaxi)/.test(t)) categoria = 'transporte'
  else if (/(cine|fiesta|salida|trago|cerveza|juego|netflix|spotify|diversi|entreten|concierto)/.test(t)) categoria = 'entretenimiento'
  else if (/(comida|almuerzo|desayuno|cena|men[uú]|caf[eé]|delivery|restaurante|pollo|snack|bodega|mercado)/.test(t)) categoria = 'comida'
  else categoria = 'comida' // por defecto; el usuario confirma antes de guardar

  return validar({ monto, categoria })
}

// Llama a Gemini pidiendo SOLO un JSON estricto.
async function interpretarGemini(texto) {
  const prompt =
    'Eres un asistente que extrae los datos de un gasto a partir de una frase en español peruano. ' +
    'Devuelve ÚNICAMENTE un JSON válido, sin texto adicional ni explicaciones, con exactamente dos campos: ' +
    '"monto" (número en soles, sin símbolo) y "categoria" (una sola de estas: comida, transporte, entretenimiento, ahorro). ' +
    'Si la frase menciona guardar o ahorrar dinero, la categoria es "ahorro". ' +
    'Ejemplo de salida: {"monto": 15, "categoria": "comida"}. ' +
    `Frase: "${texto}"`

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0, responseMimeType: 'application/json' }
    })
  })
  if (!res.ok) throw new Error('Gemini respondió ' + res.status)
  const data = await res.json()
  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
  // Quita posibles ``` o ```json y extrae el primer objeto JSON.
  const limpio = raw.replace(/```json|```/gi, '').trim()
  const match = limpio.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('Respuesta no es JSON')
  return JSON.parse(match[0])
}

// API pública. Devuelve { monto, categoria } o lanza un error si no se entiende.
export async function interpretarGastoConIA(texto) {
  if (!texto || !texto.trim()) throw new Error('No pude entender, intenta de nuevo')

  if (GEMINI_KEY) {
    try {
      const r = validar(await interpretarGemini(texto))
      if (r) return r
    } catch {
      // si Gemini falla, intentamos el intérprete local antes de rendirnos
    }
  }

  const local = interpretarLocal(texto)
  if (local) return local

  throw new Error('No pude entender, intenta de nuevo')
}
