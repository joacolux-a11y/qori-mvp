-- ============================================================
--  Qori — Migración v3 (Ahorro + retos con monto + insignias)
--  Si ya corriste schema.sql / migration_v2.sql, ejecuta SOLO este archivo.
-- ============================================================

-- 1) Permitir la categoría 'ahorro' en gastos
alter table public.gastos drop constraint if exists gastos_categoria_check;
alter table public.gastos
  add constraint gastos_categoria_check
  check (categoria in ('comida','entretenimiento','transporte','ahorro'));

-- 2) retos_completados ya tiene la columna `monto` (monto personalizado del reto).
--    Nada que migrar aquí; el monto elegido se guarda en esa columna.

-- 3) Insignias desbloqueadas por usuario
create table if not exists public.insignias_usuario (
  user_id      uuid references public.users(id) on delete cascade,
  insignia_id  text not null,
  unlocked_at  timestamptz default now(),
  primary key (user_id, insignia_id)
);

alter table public.insignias_usuario enable row level security;

drop policy if exists "insignias_self" on public.insignias_usuario;
create policy "insignias_self" on public.insignias_usuario
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
