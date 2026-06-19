// Sección "¿Qué está pasando?" — noticias económicas de Perú + explicaciones.
//
// FUENTE: GNews. Define VITE_GNEWS_KEY en .env.local para traer noticias reales.
//   Endpoint: https://gnews.io/api/v4/search?q=economia+peru&lang=es&country=pe&max=5&apikey=...
//   Si la key no está o la API falla, caemos a un set curado (demo) sin romper la sección.
//
// EXPLICACIONES ("¿Por qué importa?"): se intenta primero el hook explicarConLLM()
//   (para cuando conectes una Edge Function con IA); si devuelve null, usamos el
//   motor local de plantillas por tema.

const GNEWS_KEY = import.meta.env.VITE_GNEWS_KEY

// ---------- Titulares curados (fallback demo) ----------
const NOTICIAS_DEMO = [
  {
    id: 'demo-1',
    titulo: 'El dólar cerró al alza y vuelve a presionar los precios de productos importados',
    fuente: 'Demo económico',
    resumen: 'El tipo de cambio subió en la última jornada por mayor demanda de dólares en el mercado local.',
    fecha: new Date().toISOString(),
    url: null,
    tema: 'tipo-cambio'
  },
  {
    id: 'demo-2',
    titulo: 'BCRP mantiene la tasa de interés de referencia para seguir controlando la inflación',
    fuente: 'Demo económico',
    resumen: 'El Banco Central decidió no mover su tasa mientras la inflación se acerca a su rango meta.',
    fecha: new Date().toISOString(),
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

// Explicaciones simples por tema, en lenguaje cotidiano peruano (motor local de respaldo).
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
    'Aunque te falte un montón para jubilarte, vale la pena entrar de vez en cuando a revisar tu fondo: es tuyo y mientras antes le prestes atención, mejor.',
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

// Trae noticias económicas de Perú. Usa GNews si hay key; si no, el set curado.
export async function getNoticias() {
  if (!GNEWS_KEY) {
    return { fuente: 'demo', noticias: NOTICIAS_DEMO }
  }
  try {
    const url = `https://gnews.io/api/v4/search?q=economia+peru&lang=es&country=pe&max=5&apikey=${GNEWS_KEY}`
    const res = await fetch(url)
    if (!res.ok) throw new Error('GNews respondió ' + res.status)
    const data = await res.json()
    const noticias = (data.articles || []).map((a, i) => ({
      id: 'gnews-' + i,
      titulo: a.title,
      fuente: a.source?.name || 'GNews',
      resumen: a.description || '',
      fecha: a.publishedAt || new Date().toISOString(),
      url: a.url || null,
      tema: detectarTema(a.title + ' ' + (a.description || ''))
    }))
    return { fuente: 'gnews', noticias: noticias.length ? noticias : NOTICIAS_DEMO }
  } catch (e) {
    // Si falla la red o la key, no rompemos la sección: caemos al demo.
    return { fuente: 'demo', noticias: NOTICIAS_DEMO, error: e.message }
  }
}

// "¿Por qué importa?" — intenta el LLM; si no, usa el motor local por temas.
export async function porQueImporta(noticia) {
  try {
    const r = await explicarConLLM(noticia)
    if (r) return r
  } catch { /* si el LLM falla, seguimos con el motor local */ }
  const tema = noticia.tema || detectarTema(noticia.titulo + ' ' + (noticia.resumen || ''))
  return EXPLICACIONES[tema] || EXPLICACIONES.general
}

// Hook para generación en vivo. Implementa aquí tu Edge Function con IA.
// Recibe la noticia y debe devolver una explicación simple (string) o null.
export async function explicarConLLM(noticia) {
  // Ejemplo de implementación futura:
  //   const { data } = await supabase.functions.invoke('explicar-noticia', {
  //     body: { titulo: noticia.titulo, resumen: noticia.resumen }
  //   })
  //   return data?.explicacion ?? null
  return null
}
