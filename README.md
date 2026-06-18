# 🪙 Qori — educación financiera gamificada

App web (React + Vite) que ayuda a jóvenes peruanos (18–30) a crear hábitos de ahorro
con retos cortos, monedas, niveles y un avatar financiero. Tono motivador, realista y
en lenguaje cotidiano peruano.

## Cómo correrla

```bash
npm install
npm run dev      # abre http://localhost:5173
```

Funciona **sin configurar nada**: por defecto usa un backend local (`localStorage`),
así que puedes registrarte, hacer el quiz, completar retos y ver tu progreso de inmediato.

> Tip de demo: en **Perfil → Reiniciar progreso** vuelves a empezar de cero.
> El reto del día cambia cada día automáticamente.

## Pantallas (flujo)

`Auth` → `Onboarding (quiz + avatar)` → `Dashboard` → `Reto del día`.
Navegación inferior: **Inicio · Lecciones · Noticias · Gastos · Perfil**.
Desde Perfil se llega a **Configuración** y a **Upgrade (Premium)**.

### Funciones nuevas (v2)

- **Lecciones tipo Duolingo** (Premium) — 4 niveles temáticos (Conceptos básicos →
  Herramientas → Inversión → Contexto peruano) con quizzes de 3-5 preguntas.
  Respuesta correcta = +10 🪙 + celebración; incorrecta = explicación de la correcta.
  Las lecciones se desbloquean en orden y el progreso se guarda en `progreso_usuario`.
- **Noticias "¿Qué está pasando?"** (Premium) — noticia del día (curada por defecto;
  GNews si defines `VITE_GNEWS_API_KEY`) con botón "¿Por qué importa?" que explica en
  lenguaje cotidiano, + biblioteca de conceptos peruanos (dólar, inflación, BCRP, AFP…).
- **Modelo freemium** — campo `users.plan` (`free`/`premium`). Las secciones premium
  muestran 🔒 + banner de upgrade. La pantalla de Upgrade lista beneficios; sin pasarela
  de pago todavía ("Próximamente"), con un botón para activar Premium en modo prueba.
- **Tracker con tabs** — "Hoy" (gastos del día por categoría) y "Este mes" (barras vs
  presupuesto). Botón ✏️ abre un modal para editar el presupuesto por categoría
  (se guarda en la tabla `presupuestos`).
- **Configuración** — editar presupuesto, ver/mejorar plan y cerrar sesión.

## Estructura

```
qori/
├─ index.html
├─ supabase/
│  ├─ schema.sql                # instalación nueva (todas las tablas + RLS)
│  └─ migration_v2.sql          # si ya corriste schema.sql antes: corre solo esto
└─ src/
   ├─ theme.js · index.css · App.jsx
   ├─ context/AuthContext.jsx   # sesión, progreso y plan global
   ├─ lib/
   │  ├─ backend.js             # dispatcher: elige Supabase o local
   │  ├─ backend.supabase.js    # Supabase (auth + tablas)
   │  ├─ backend.local.js       # localStorage (modo demo)
   │  ├─ supabaseClient.js      # cliente Supabase
   │  └─ news.js                # noticias (fallback + GNews) + motor de explicaciones
   ├─ data/
   │  ├─ quiz.js · retos.js · niveles.js
   │  ├─ lecciones.js           # 4 niveles de quizzes educativos
   │  └─ conceptos.js           # tarjetas explicativas (contexto peruano)
   ├─ components/               # UI, BottomNav, PremiumGate, BudgetModal
   └─ screens/                  # Auth, Onboarding, Dashboard, DailyChallenge,
                                # Lessons, LessonPlayer, News, ExpenseTracker,
                                # Profile, Settings, Upgrade
```

> **¿Ya tenías la base de datos creada?** Corre las migraciones que te falten en el SQL
> Editor: `migration_v2.sql` (plan, presupuestos, lecciones) y `migration_v3.sql`
> (categoría `ahorro` en gastos + tabla `insignias_usuario`).
> En instalaciones nuevas, `schema.sql` ya lo incluye todo.

### Funciones nuevas (v3)

- **Tracker estilo calculadora** — display grande, 4 categorías (Comida, Transporte,
  Diversión, Ahorro 💰), teclado 4×3 y botón verde "Registrar". Historial detrás del
  botón 📜. Registro en menos de 5 segundos.
- **Categoría Ahorro** — al registrar un ahorro: monedas **dobles** (monto × 2), sube la
  racha y aparece en **verde** en el historial. (En Supabase: `migration_v3.sql` amplía el
  check de `gastos.categoria`.)
- **Límite diario** — en el tab "Hoy", límite por categoría = presupuesto mensual ÷ días
  del mes, con barra que se pone **roja** y avisa "¡Ojo! Pasaste tu límite de hoy".
- **Retos con monto personalizado** — al aceptar un reto, un slider deja elegir cuánto
  ahorrar (rango sugerido); los puntos son monto × 2. El monto se guarda en
  `retos_completados`.
- **Insignias** — sección "Mis logros" en Perfil con 6 insignias (Semilla, Racha 7 días,
  Mes en verde, Estudioso, Primer ahorro, Qori Maestro). Las obtenidas van a color, las
  pendientes en gris con su requisito. Se guardan en `insignias_usuario`.
- **Scroll** — todas las pantallas hacen scroll libre; las pantallas inmersivas
  (reto, lección, upgrade) ocultan la barra inferior para no tapar contenido.

## Lógica de gamificación

- Cada reto otorga **monedas Qori** y suma a tu **total ahorrado** (en soles).
- La **racha** sube si completas un reto en días consecutivos; se reinicia si pierdes un día.
- Los **niveles** dependen de tus monedas acumuladas (Semilla → … → Qori Maestro).
  Cada nivel desbloquea un **consejo financiero** nuevo.
- Solo se puede completar **un reto por día**.

## Supabase — ✅ conectado

El proyecto ya está enlazado a Supabase mediante `.env.local` (URL + anon key).
Al detectar credenciales, `backend.js` usa automáticamente `backend.supabase.js`
(auth real + tablas en la nube). Si borras `.env.local`, vuelve solo al modo local.

**Antes de probar el login, asegúrate en tu panel de Supabase de 2 cosas:**

1. **Correr el esquema** — SQL Editor → pega y ejecuta `supabase/schema.sql`.
   Crea las tablas (`users`, `retos`, `progreso_usuario`, `retos_completados`, `gastos`),
   las políticas RLS, el trigger de alta de usuario y siembra los 14 retos.
   *Si saltas este paso, el registro fallará porque las tablas no existen.*
2. **Desactivar confirmación de correo (recomendado para el MVP)** —
   Authentication → Providers → Email → apaga **"Confirm email"**.
   Así el registro entra directo sin tener que verificar el correo.
   (Si lo dejas activo, la app pedirá confirmar el correo antes de entrar.)

Luego: `npm install && npm run dev`, regístrate y tu progreso queda guardado en la nube
(pruébalo desde otro navegador con el mismo correo). Migración de datos: la auth y las
tablas reemplazan al `localStorage`; **las pantallas no cambiaron**, solo la capa de datos.

## Identidad visual

Dorado `#F5A623` · blanco roto `#FAF9F6` · verde oscuro `#1A3C34`.
Tipografías Poppins (títulos) + Inter (texto). Diseño mobile-first centrado en desktop.
