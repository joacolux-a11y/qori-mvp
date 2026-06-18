-- ============================================================
--  Qori — Migración v2 (freemium + presupuestos + lecciones)
--  Si ya corriste schema.sql antes, ejecuta SOLO este archivo.
--  Si es una instalación nueva, schema.sql ya incluye todo esto.
-- ============================================================

-- 1) Plan freemium en users
alter table public.users
  add column if not exists plan text not null default 'free'
  check (plan in ('free','premium'));

-- 2) Progreso de lecciones (array de ids de lecciones completadas)
alter table public.progreso_usuario
  add column if not exists lecciones_completadas jsonb not null default '[]'::jsonb;

-- 3) Presupuesto mensual por categoría (1 fila por usuario)
create table if not exists public.presupuestos (
  user_id          uuid primary key references public.users(id) on delete cascade,
  comida           numeric not null default 300,
  entretenimiento  numeric not null default 150,
  transporte       numeric not null default 150,
  updated_at       timestamptz default now()
);

alter table public.presupuestos enable row level security;

drop policy if exists "presupuestos_self" on public.presupuestos;
create policy "presupuestos_self" on public.presupuestos
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 4) Crear presupuesto por defecto al dar de alta (actualiza el trigger existente)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.users (id, email) values (new.id, new.email);
  insert into public.progreso_usuario (user_id) values (new.id);
  insert into public.presupuestos (user_id) values (new.id);
  return new;
end;
$$;
