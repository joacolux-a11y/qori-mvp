// Sección "¿Qué está pasando?" — noticia del día + motor de explicaciones.
//
// FUENTE DE NOTICIAS:
//   - Si defines VITE_GNEWS_API_KEY en .env.local, trae noticias reales de Perú (GNews).
//   - Si no, usa un set curado de titulares de ejemplo para que la sección funcione ya.
//
// EXPLICACIONES ("¿Por qué importa?"):
//   - Hoy: motor local por temas (offline, sin costo).
//   - Mañana: conecta un LLM en `explicarConLLM()` (ver nota más abajo).

const GNEWS_KEY = import.meta.env.VITE_GNEWS_API_KEY

// ---------- Titulares curados (fallback demo) ----------
const NOTICIAS_DEMO = [
  {
    id: 'demo-1',
    titulo: 'El dólar cerró al alza y vuelve a presionar los precios de productos importados',
    fuente: 'Demo económico',
    resumen: 'El tipo de cambio subió en la última jornada por mayor demanda de dólares en el mercado local.',
    url: null,
    tema: 'tipo-cambio'
  },
  {
    id: 'demo-2',
    titulo: 'BCRP mantiene la tasa de interés de referencia para seguir controlando la inflación',
    fuente: 'Demo económico',
    resumen: 'El Banco Central decidió no mover su tasa mientras la inflación se acerca a su rango meta.',
    url: null,
    tema: 'bcrp'
  }
]

// Detecta el tema de un titular según palabras clave.
function detectarTema(texto = '') {
  const t = texto.toLowerCase()
  if (/(d[oó]lar|tipo de cambio|sol se deprecia|divisa)/.test(t)) return 'tipo-cambio'
  if (/(bcrp|banco central|tasa de inter[eé]s de referencia|pol[ií]tica monetaria)/.test(t)) return 'bcrp'
  if (/(inflaci[oó]n|precios suben|canasta|costo de vida)/.test(t)) return 'inflacion'
  if (/(afp|pensi[oó]n|jubilaci[oó]n|onp)/.test(t)) return 'afp'
  if (/(elecci[oó]n|gobierno|congreso|pol[ií]tic)/.test(t)) return 'elecciones'
  if (/(bvl|bolsa|acciones|fondo mutuo|inversi[oó]n)/.test(t)) return 'inversion'
  return 'general'
}

// Explicaciones simples por tema, en lenguaje cotidiano peruano.
const EXPLICACIONES = {
  'tipo-cambio':
    'En cristiano: el dólar subió. ¿Y eso qué tiene que ver contigo? Que casi todo lo importado —tu próximo celular, la gasolina, varios productos del super— se paga en dólares. ' +
    'Si el dólar está más caro, esas cosas tienden a subir de precio, aunque tú sigas cobrando en soles. No cunde el pánico, pero es buen momento para no gastar de más en cosas importadas.',
  bcrp:
    'Traducido: el Banco Central (BCRP) está cuidando que los precios no se disparen. Su tasa de interés es como el termostato de la economía: la sube para enfriar los precios y la baja para animar el consumo. ' +
    'Que la mantenga suele ser señal de calma. Para tu bolsillo significa que las cuotas de créditos y los intereses de ahorro probablemente no cambien mucho por ahora.',
  inflacion:
    'O sea: los precios están subiendo y tu plata rinde menos. El mismo menú que pagabas S/12 capaz ahora cuesta S/14. ' +
    'Tu mejor defensa es que tu plata no se quede dormida: si tus ahorros ganan algún interés, le empatas o le ganas a la inflación en vez de perder valor sin darte cuenta.',
  afp:
    'En simple: esto toca tu plata de la jubilación. Cada mes un porcentaje de tu sueldo se va a tu cuenta en la AFP y se invierte para tu futuro. ' +
    'Aunque te falte un montón para jubilarte, vale la pena entrar de vez en cuando a revisar tu fondo: es tuyo y mientras antes le prestes atención, mejor te irá.',
  elecciones:
    'Lo que significa para ti: la incertidumbre política pone nervioso al dólar. Cuando no se sabe qué va a pasar, mucha gente compra dólares para protegerse y eso lo hace subir. ' +
    'No tienes que volverte experto en política, pero sí tener un fondo de emergencia y no tomar decisiones de plata en pánico.',
  inversion:
    'En palabras simples: están hablando de poner la plata a trabajar (bolsa, fondos). Invertir puede hacer crecer tus ahorros más que una cuenta normal, pero con algo de riesgo. ' +
    'La regla de oro: no pongas todos los huevos en una canasta y nunca inviertas plata que vas a necesitar el próximo mes.',
  general:
    'En corto: esta es una noticia de economía que puede mover precios o el dólar. La pregunta clave siempre es la misma: ¿esto encarece lo que compro o afecta mis ahorros? ' +
    'Si la respuesta es sí, ajusta un poco tu presupuesto y sigue con tus hábitos. La calma y la constancia ganan.'
}

// ---------- API pública ----------

// Trae la(s) noticia(s) del día. Usa GNews si hay key; si no, el set curado.
export async function getNoticias() {
  if (!GNEWS_KEY) {
    return { fuente: 'demo', noticias: NOTICIAS_DEMO }
  }
  try {
    const url = `https://gnews.io/api/v4/search?q=econom%C3%ADa%20OR%20d%C3%B3lar%20OR%20inflaci%C3%B3n&lang=es&country=pe&max=2&apikey=${GNEWS_KEY}`
    const res = await fetch(url)
    if (!res.ok) throw new Error('GNews respondió ' + res.status)
    const data = await res.json()
    const noticias = (data.articles || []).map((a, i) => ({
      id: 'gnews-' + i,
      titulo: a.title,
      fuente: a.source?.name || 'GNews',
      resumen: a.description || '',
      url: a.url || null,
      tema: detectarTema(a.title + ' ' + (a.description || ''))
    }))
    return { fuente: 'gnews', noticias: noticias.length ? noticias : NOTICIAS_DEMO }
  } catch (e) {
    // Si falla la red o la key, no rompemos la sección: caemos al demo.
    return { fuente: 'demo', noticias: NOTICIAS_DEMO, error: e.message }
  }
}

// "¿Por qué importa?" — explicación simple para alguien de 20 años.
export async function porQueImporta(noticia) {
  // 👉 PARA CONECTAR UN LLM EN VIVO:
  // Despliega una Supabase Edge Function que reciba el titular y devuelva una
  // explicación generada por tu API de IA, y descomenta esto:
  //
  //   const r = await explicarConLLM(noticia.titulo)
  //   if (r) return r
  //
  // Mientras tanto, usamos el motor local por temas:
  const tema = noticia.tema || detectarTema(noticia.titulo + ' ' + (noticia.resumen || ''))
  return EXPLICACIONES[tema] || EXPLICACIONES.general
}

// Hook listo para el futuro. Implementa la llamada a tu Edge Function aquí.
// eslint-disable-next-line no-unused-vars
export async function explicarConLLM(titular) {
  // Ejemplo:
  // const { data } = await supabase.functions.invoke('explicar-noticia', { body: { titular } })
  // return data?.explicacion
  return null
}
