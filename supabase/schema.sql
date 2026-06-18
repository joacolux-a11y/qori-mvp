-- ============================================================
--  Qori — Esquema de base de datos (Supabase / PostgreSQL)
--  Ejecuta este script en el SQL Editor de tu proyecto Supabase.
--  Auth (email/password) la maneja Supabase Auth (auth.users).
--  Estas tablas guardan el perfil, los retos, el progreso y los gastos.
-- ============================================================

-- 1) USERS — perfil público vinculado a auth.users
create table if not exists public.users (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  nombre      text default '',
  perfil      text,                       -- gastador | ahorrista | endeudado | indiferente
  avatar      text,                       -- explorador | constructor | guerrero | aventurero
  plan        text not null default 'free' check (plan in ('free','premium')),
  created_at  timestamptz default now()
);

-- 2) RETOS — catálogo de retos diarios
create table if not exists public.retos (
  id        text primary key,
  titulo    text not null,
  texto     text not null,
  monto     numeric not null default 0,   -- soles ahorrados estimados
  qori      integer not null default 0,   -- monedas que otorga
  cat       text not null                 -- comida | entretenimiento | transporte
);

-- 3) PROGRESO_USUARIO — gamificación (1:1 con users)
create table if not exists public.progreso_usuario (
  user_id         uuid primary key references public.users(id) on delete cascade,
  monedas         integer not null default 0,
  nivel           integer not null default 1,
  streak          integer not null default 0,
  ultima_fecha    date,
  total_ahorrado  numeric not null default 0,
  lecciones_completadas jsonb not null default '[]'::jsonb,
  updated_at      timestamptz default now()
);

-- PRESUPUESTOS — límite mensual por categoría (1:1 con users)
create table if not exists public.presupuestos (
  user_id          uuid primary key references public.users(id) on delete cascade,
  comida           numeric not null default 300,
  entretenimiento  numeric not null default 150,
  transporte       numeric not null default 150,
  updated_at       timestamptz default now()
);

-- INSIGNIAS — logros desbloqueados por usuario
create table if not exists public.insignias_usuario (
  user_id      uuid references public.users(id) on delete cascade,
  insignia_id  text not null,
  unlocked_at  timestamptz default now(),
  primary key (user_id, insignia_id)
);

-- Retos completados (historial; un registro por día/usuario)
create table if not exists public.retos_completados (
  id          bigint generated always as identity primary key,
  user_id     uuid references public.users(id) on delete cascade,
  reto_id     text references public.retos(id),
  fecha       date not null default current_date,
  qori        integer not null default 0,
  monto       numeric not null default 0,
  unique (user_id, fecha)
);

-- 4) GASTOS — tracker simplificado
create table if not exists public.gastos (
  id         bigint generated always as identity primary key,
  user_id    uuid references public.users(id) on delete cascade,
  categoria  text not null check (categoria in ('comida','entretenimiento','transporte','ahorro')),
  monto      numeric not null,
  nota       text default '',
  fecha      date not null default current_date,
  created_at timestamptz default now()
);

-- ============================================================
--  Row Level Security: cada usuario solo ve y edita lo suyo
-- ============================================================
alter table public.users               enable row level security;
alter table public.progreso_usuario    enable row level security;
alter table public.retos_completados   enable row level security;
alter table public.gastos              enable row level security;
alter table public.retos               enable row level security;
alter table public.presupuestos        enable row level security;
alter table public.insignias_usuario   enable row level security;

create policy "users_self"        on public.users
  for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "progreso_self"     on public.progreso_usuario
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "retos_compl_self"  on public.retos_completados
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "gastos_self"       on public.gastos
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "retos_read_all"    on public.retos
  for select using (true);
create policy "presupuestos_self" on public.presupuestos
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "insignias_self" on public.insignias_usuario
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
--  Trigger: al registrarse, crea fila en users + progreso_usuario
-- ============================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.users (id, email) values (new.id, new.email);
  insert into public.progreso_usuario (user_id) values (new.id);
  insert into public.presupuestos (user_id) values (new.id);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
--  Semilla de retos (coincide con src/data/retos.js)
-- ============================================================
insert into public.retos (id, titulo, texto, monto, qori, cat) values
 ('r1','Café de casa','Hoy no compres café afuera. Prepáralo en casa y ahorra S/8.',8,20,'comida'),
 ('r2','Almuerzo de tópper','Llévate el almuerzo en lugar de pedir delivery. Ahorras unos S/15.',15,30,'comida'),
 ('r3','Caminata corta','Si el viaje es de menos de 15 min, camina en vez de tomar taxi. Ahorra S/10.',10,25,'transporte'),
 ('r4','Lista antes de salir','Antes de ir a la bodega, anota qué necesitas y compra solo eso.',12,20,'comida'),
 ('r5','Día sin antojos','Pasa el día sin comprar ningún snack ni golosina de impulso. Ahorra S/5.',5,20,'comida'),
 ('r6','Regla de los 10 minutos','¿Quieres comprar algo no planeado? Espera 10 min. Si se te pasan las ganas, ahorraste.',20,35,'entretenimiento'),
 ('r7','Suscripción dormida','Revisa una suscripción que no uses (música, apps) y cancélala hoy.',16,40,'entretenimiento'),
 ('r8','Recarga combinada','Junta tus trámites en un solo viaje para no gastar de más en pasajes.',8,20,'transporte'),
 ('r9','Botella propia','Lleva tu botella de agua y no compres bebidas afuera. Ahorra S/6.',6,15,'comida'),
 ('r10','Noche en casa','Cambia una salida por un plan en casa con amigos. Ahorra S/30.',30,45,'entretenimiento'),
 ('r11','Revisa antes de pagar','Antes de una compra grande, busca el mismo producto más barato en otro lado.',25,35,'entretenimiento'),
 ('r12','Apaga lo que no usas','Desconecta aparatos en standby hoy. Pequeño ahorro en tu recibo de luz.',4,15,'entretenimiento'),
 ('r13','Guarda el vuelto','Todo el sencillo que te sobre hoy, sepáralo en tu chanchito. Ahorra S/5.',5,20,'comida'),
 ('r14','Combi en vez de taxi','Usa transporte público para un trayecto que ibas a hacer en taxi. Ahorra S/12.',12,25,'transporte')
on conflict (id) do nothing;
