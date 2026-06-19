-- ============================================================
--  Qori — Migración v4 (perfil del usuario + retos por perfil)
--  Ejecuta SOLO este archivo si ya tenías la base creada antes.
-- ============================================================

-- 1) Perfil financiero del usuario (resultado del quiz de onboarding)
--    Valores: ahorrista | indiferente | gastador | endeudado  (null = sin asignar)
alter table public.users
  add column if not exists perfil text default null;

-- 2) Etiqueta de perfil en el catálogo de retos (para filtrar el reto del día)
alter table public.retos
  add column if not exists perfil text not null default 'general';

-- 3) Sembrar los retos por perfil (los generales ya existen; estos son nuevos)
insert into public.retos (id, titulo, texto, monto, qori, cat, perfil) values
 ('a1','Sube tu meta','Aumenta tu meta de ahorro de esta semana en S/20. Tú puedes con más.',20,35,'comida','ahorrista'),
 ('a2','Reto sin gastos','Pásate todo el día sin gastar nada que no sea estrictamente necesario.',25,40,'entretenimiento','ahorrista'),
 ('a3','Cuenta con interés','Averigua hoy una caja o banco que pague más TREA y mueve un poco de tu ahorro ahí.',0,30,'comida','ahorrista'),
 ('a4','Ahorro fantasma','Mete al chanchito el monto de un gusto que NO te diste hoy.',15,30,'entretenimiento','ahorrista'),
 ('g1','Regla de los 10 minutos','Antes de cualquier compra que no planeabas, espera 10 minutos. Si se te pasan las ganas, ahorraste.',20,35,'entretenimiento','gastador'),
 ('g2','Día sin delivery','Hoy cero apps de delivery. Cocina o come en casa y ahorra lo del envío + propina.',18,35,'comida','gastador'),
 ('g3','Carrito en pausa','Deja en el carrito eso que ibas a comprar online y revísalo mañana.',30,40,'entretenimiento','gastador'),
 ('g4','Solo efectivo hoy','Sal con un monto fijo en efectivo y guarda la tarjeta. Cuando se acaba, se acabó.',15,30,'entretenimiento','gastador'),
 ('e1','La deuda más chica','Identifica tu deuda más pequeña y abónale algo hoy. El primer triunfo da impulso.',20,40,'entretenimiento','endeudado'),
 ('e2','Mapa de deudas','Anota todas tus deudas con su monto y a quién le debes. Verlas claro es el primer paso.',0,30,'comida','endeudado'),
 ('e3','Sin nuevas deudas','Hoy no uses la tarjeta de crédito para nada. Ni una cuota más.',15,35,'entretenimiento','endeudado'),
 ('e4','Abono extra','Junta cualquier sencillo que te sobre hoy y abónalo a tu deuda principal.',10,30,'comida','endeudado'),
 ('i1','Anota tus gastos','Anota 3 cosas en las que gastaste hoy. Sin juzgar, solo para verlas.',0,25,'comida','indiferente'),
 ('i2','Tu gasto hormiga','Identifica un gastito diario que repites (gaseosa, snack) y hoy sáltatelo.',6,25,'comida','indiferente'),
 ('i3','Revisa tu saldo','Entra a tu app del banco y mira cuánto tienes de verdad. Conocerlo ya es ganar.',0,20,'comida','indiferente'),
 ('i4','Guarda S/5','Separa solo S/5 hoy a un lado. Empezar pequeño también cuenta.',5,25,'comida','indiferente')
on conflict (id) do nothing;
