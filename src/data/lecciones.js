// Lecciones tipo Duolingo. 4 niveles temáticos, cada lección 3-5 preguntas.
// Respuesta correcta = +10 monedas. Incorrecta = explicación de la correcta.
import { theme } from '../theme.js'

export const niveles = [
  {
    nivel: 1,
    tema: 'Conceptos básicos',
    icon: '🌱',
    color: theme.gold,
    descripcion: 'Qué es ahorrar, el interés y un presupuesto.',
    lecciones: [
      {
        id: 'l1-ahorro',
        titulo: 'El ahorro',
        preguntas: [
          {
            pregunta: '¿Qué es realmente ahorrar?',
            opciones: ['Que te sobre plata sin querer a fin de mes', 'Separar plata a propósito antes de gastarla', 'Guardar solo cuando ganas mucho'],
            correcta: 1,
            explicacion: 'Ahorrar es separar plata A PROPÓSITO, apenas te llega, antes de que se te vaya en otras cosas. No es lo que sobra: es lo que decides apartar.'
          },
          {
            pregunta: 'Ganas S/1,500. ¿Cuál es una meta de ahorro realista para empezar?',
            opciones: ['S/750 (la mitad)', 'S/150 (el 10%)', 'S/0, mejor cuando gane más'],
            correcta: 1,
            explicacion: 'Empezar con el 10% (S/150) es realista y sostenible. La mitad te ahogaría y "cuando gane más" casi nunca llega. Lo importante es la constancia, no el monto.'
          },
          {
            pregunta: '¿Por qué conviene ahorrar apenas cobras y no al final?',
            opciones: ['Porque el banco lo exige', 'Porque si esperas, ya no queda nada', 'Da igual cuándo lo hagas'],
            correcta: 1,
            explicacion: 'Es el truco de "págate a ti primero": si separas el ahorro apenas cobras, lo demás se acomoda. Si esperas a fin de mes, casi siempre ya no queda.'
          },
          {
            pregunta: 'Un "fondo de emergencia" sirve para...',
            opciones: ['Comprar el último celular', 'Cubrir imprevistos como salud o quedarte sin chamba', 'Prestarle a los patas'],
            correcta: 1,
            explicacion: 'El fondo de emergencia es tu colchón para imprevistos (una emergencia médica, quedarte sin trabajo). Apunta a juntar 1 a 3 meses de tus gastos.'
          }
        ]
      },
      {
        id: 'l1-presupuesto',
        titulo: 'Presupuesto e interés',
        preguntas: [
          {
            pregunta: 'Un presupuesto es básicamente...',
            opciones: ['Un plan de cuánto entra y en qué sale tu plata', 'Una app cara del banco', 'Algo solo para empresas'],
            correcta: 0,
            explicacion: 'Un presupuesto es solo un plan simple: cuánto entra y en qué se va. Saberlo te da el control. No necesitas nada sofisticado para empezar.'
          },
          {
            pregunta: 'La regla 50/30/20 dice que de cada sueldo...',
            opciones: ['50% gustos, 30% deudas, 20% comida', '50% necesidades, 30% gustos, 20% ahorro', 'Todo al ahorro'],
            correcta: 1,
            explicacion: '50% a lo necesario (alquiler, comida, pasajes), 30% a gustos y 20% a ahorro. Es una guía flexible: ajústala a tu realidad.'
          },
          {
            pregunta: '¿Qué es el "interés" en una cuenta de ahorro?',
            opciones: ['Una comisión que te cobran', 'Plata que el banco te paga por tener tu dinero ahí', 'Un impuesto'],
            correcta: 1,
            explicacion: 'El interés es lo que el banco te PAGA por mantener tu plata ahí. Tu dinero trabaja un poquito por ti, aunque sea poco.'
          },
          {
            pregunta: 'El "interés compuesto" es poderoso porque...',
            opciones: ['Ganas interés sobre tu plata Y sobre los intereses ya ganados', 'El banco te cobra el doble', 'Solo aplica a millonarios'],
            correcta: 0,
            explicacion: 'Con el interés compuesto, tus intereses generan más intereses. Por eso, mientras más temprano empiezas, más crece tu plata sola con el tiempo.'
          }
        ]
      }
    ]
  },
  {
    nivel: 2,
    tema: 'Herramientas',
    icon: '🧰',
    color: theme.green,
    descripcion: 'Cuentas de ahorro, AFP y tarjetas de crédito.',
    lecciones: [
      {
        id: 'l2-donde-guardar',
        titulo: 'Dónde guardar tu plata',
        preguntas: [
          {
            pregunta: '¿Por qué guardar todo en efectivo en casa no es ideal?',
            opciones: ['Pierde valor con la inflación y es fácil gastarlo o perderlo', 'Es ilegal', 'El efectivo no sirve en Perú'],
            correcta: 0,
            explicacion: 'El efectivo bajo el colchón no gana interés y la inflación le come valor cada año. Además es más fácil gastarlo de a pocos sin darte cuenta.'
          },
          {
            pregunta: 'Una cuenta de ahorro en un banco o caja te da...',
            opciones: ['Nada, solo comisiones', 'Seguridad y un interés (revisa la TREA)', 'Acciones de la bolsa'],
            correcta: 1,
            explicacion: 'Una cuenta de ahorro guarda tu plata con seguridad y te paga un interés. Compara la TREA (tasa real anual) entre bancos y cajas: las cajas suelen pagar más.'
          },
          {
            pregunta: 'En Perú, ¿quién protege tus ahorros si el banco quiebra?',
            opciones: ['Nadie', 'El Fondo de Seguro de Depósitos (hasta cierto monto)', 'La municipalidad'],
            correcta: 1,
            explicacion: 'El Fondo de Seguro de Depósitos cubre tus ahorros hasta un monto (se actualiza cada trimestre) en entidades reguladas por la SBS. Por eso conviene usar entidades formales.'
          },
          {
            pregunta: '¿Qué es la AFP?',
            opciones: ['Un préstamo del Estado', 'Donde se ahorra para tu jubilación con cada sueldo', 'Una tarjeta de crédito'],
            correcta: 1,
            explicacion: 'La AFP administra tu fondo de jubilación: un porcentaje de tu sueldo se va ahí cada mes y se invierte para tu futuro. Revisa tu estado de cuenta de vez en cuando.'
          }
        ]
      },
      {
        id: 'l2-tarjetas',
        titulo: 'Tarjetas de crédito',
        preguntas: [
          {
            pregunta: 'La diferencia clave entre tarjeta de débito y de crédito es:',
            opciones: ['Ninguna', 'Débito usa TU plata; crédito es plata prestada que devuelves', 'La de crédito es gratis siempre'],
            correcta: 1,
            explicacion: 'Con la de débito gastas tu propia plata. Con la de crédito el banco te presta y tú devuelves. Si no pagas a tiempo, te cobran intereses altos.'
          },
          {
            pregunta: 'Para usar bien una tarjeta de crédito conviene...',
            opciones: ['Pagar solo el mínimo cada mes', 'Pagar el total antes de la fecha de vencimiento', 'Sacar el máximo en cuotas largas'],
            correcta: 1,
            explicacion: 'Pagar el TOTAL a tiempo te deja usar la tarjeta casi gratis. Pagar solo el mínimo dispara los intereses y la deuda crece como bola de nieve.'
          },
          {
            pregunta: 'Pagar "el mínimo" todos los meses significa que...',
            opciones: ['Ya estás libre de deuda', 'La deuda casi no baja y pagas mucho interés', 'El banco te premia'],
            correcta: 1,
            explicacion: 'El pago mínimo apenas cubre intereses: la deuda casi no baja y terminas pagando mucho más. Es la trampa más común de las tarjetas.'
          },
          {
            pregunta: '¿Qué es la línea de crédito?',
            opciones: ['El máximo que el banco te deja gastar con la tarjeta', 'Tu sueldo', 'Una cola en el banco'],
            correcta: 0,
            explicacion: 'La línea de crédito es el tope que el banco te presta. Usar mucho de tu línea (estar siempre al tope) puede afectar tu historial crediticio.'
          }
        ]
      }
    ]
  },
  {
    nivel: 3,
    tema: 'Inversión básica',
    icon: '📈',
    color: theme.gold,
    descripcion: 'Fondos mutuos, la BVL y los ETFs.',
    lecciones: [
      {
        id: 'l3-invertir',
        titulo: 'Primeros pasos invirtiendo',
        preguntas: [
          {
            pregunta: 'La diferencia entre ahorrar e invertir es:',
            opciones: ['Son lo mismo', 'Ahorrar guarda; invertir busca que esa plata crezca asumiendo algo de riesgo', 'Invertir es solo para ricos'],
            correcta: 1,
            explicacion: 'Ahorrar es guardar con seguridad. Invertir es poner esa plata a trabajar para que crezca, asumiendo algo de riesgo a cambio de mayor rendimiento.'
          },
          {
            pregunta: '¿Qué es un fondo mutuo?',
            opciones: ['Un grupo de personas que juntan plata y un experto la invierte por ellos', 'Un préstamo', 'Una cuenta sueldo'],
            correcta: 0,
            explicacion: 'En un fondo mutuo, muchas personas juntan su plata y una administradora (regulada por la SMV) la invierte. Puedes empezar con montos bajos, desde S/100 o S/500.'
          },
          {
            pregunta: 'La BVL es...',
            opciones: ['Un banco', 'La Bolsa de Valores de Lima, donde se compran y venden acciones', 'Una billetera digital'],
            correcta: 1,
            explicacion: 'La BVL (Bolsa de Valores de Lima) es el mercado donde se compran y venden acciones de empresas. Comprar una acción es comprar un pedacito de una empresa.'
          },
          {
            pregunta: '¿Qué es un ETF?',
            opciones: ['Un impuesto', 'Una canasta de muchas acciones que compras de una sola vez', 'Un tipo de AFP'],
            correcta: 1,
            explicacion: 'Un ETF es como una canasta con muchas acciones a la vez. En vez de apostar a una sola empresa, diversificas con una sola compra. Reduce el riesgo.'
          },
          {
            pregunta: '"Diversificar" significa...',
            opciones: ['Poner toda tu plata en una sola cosa', 'No poner todos los huevos en una canasta', 'Gastar más'],
            correcta: 1,
            explicacion: 'Diversificar es repartir tu plata en varias inversiones para que, si a una le va mal, no pierdas todo. Es la regla de oro para reducir riesgo.'
          }
        ]
      }
    ]
  },
  {
    nivel: 4,
    tema: 'Contexto peruano',
    icon: '🇵🇪',
    color: theme.green,
    descripcion: 'Inflación, tipo de cambio y política monetaria.',
    lecciones: [
      {
        id: 'l4-macro',
        titulo: 'Inflación, dólar y BCRP',
        preguntas: [
          {
            pregunta: '¿Qué es la inflación?',
            opciones: ['Que los precios suben y tu plata alcanza para menos', 'Que ganas más', 'Un impuesto nuevo'],
            correcta: 0,
            explicacion: 'Inflación es la subida general de precios. Si todo sube y tu sueldo no, tu plata alcanza para menos: el mismo menú que costaba S/12 ahora cuesta S/14.'
          },
          {
            pregunta: '¿Qué hace principalmente el BCRP (Banco Central)?',
            opciones: ['Reparte bonos', 'Cuida el valor del sol controlando la inflación', 'Da préstamos a personas'],
            correcta: 1,
            explicacion: 'El BCRP cuida que el sol no pierda valor: su misión es mantener la inflación baja y estable, principalmente moviendo la tasa de interés de referencia.'
          },
          {
            pregunta: 'Si el tipo de cambio sube (el dólar se pone más caro)...',
            opciones: ['Lo importado (celulares, gasolina) tiende a subir de precio', 'Todo se abarata', 'No pasa nada'],
            correcta: 0,
            explicacion: 'Si el dólar sube, lo que viene de afuera (electrónicos, combustible, algunos alimentos) tiende a encarecerse, porque se paga en dólares.'
          },
          {
            pregunta: 'Cuando hay mucha inflación, el BCRP suele...',
            opciones: ['Bajar la tasa de interés', 'Subir la tasa de interés para enfriar el gasto', 'No hacer nada'],
            correcta: 1,
            explicacion: 'Para frenar la inflación, el BCRP sube su tasa de referencia: el crédito se encarece, la gente gasta menos y los precios dejan de subir tan rápido.'
          },
          {
            pregunta: '¿Por qué te conviene que tus ahorros ganen interés?',
            opciones: ['Para que no se los coma la inflación', 'Porque es obligatorio', 'No importa'],
            correcta: 0,
            explicacion: 'Si tu plata no gana al menos lo que sube la inflación, en la práctica pierde valor cada año. Por eso conviene que tus ahorros generen algún rendimiento.'
          }
        ]
      }
    ]
  }
]

// Lista plana ordenada de todas las lecciones (para la lógica de desbloqueo).
export const leccionesPlanas = niveles.flatMap((n) =>
  n.lecciones.map((l) => ({ ...l, nivel: n.nivel, tema: n.tema, icon: n.icon, color: n.color }))
)

export function getLeccion(id) {
  return leccionesPlanas.find((l) => l.id === id)
}

// Estado de cada lección según el progreso: completada / desbloqueada / bloqueada.
// Una lección se desbloquea cuando la anterior (en orden) está completada.
export function estadoLecciones(completadas = []) {
  const set = new Set(completadas)
  let anteriorHecha = true
  return leccionesPlanas.map((l) => {
    const completada = set.has(l.id)
    const desbloqueada = completada || anteriorHecha
    anteriorHecha = completada
    return { id: l.id, completada, desbloqueada }
  })
}
