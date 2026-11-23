-- Conexión Scania · tabla de solicitudes de cotización
-- Pegar en Supabase → SQL Editor → Run. Se puede ejecutar varias veces.

create table if not exists public.cotizaciones (
  id                 uuid primary key default gen_random_uuid(),
  created_at         timestamptz not null default now(),
  codigo             text not null check (char_length(codigo) between 4 and 12),
  nombre             text not null check (char_length(nombre) between 2 and 120),
  telefono           text not null check (char_length(telefono) between 7 and 20),
  ciudad             text not null check (char_length(ciudad) between 2 and 80),
  empresa            text check (char_length(empresa) <= 120),
  email              text check (char_length(email) <= 160),
  vehiculo           text check (char_length(vehiculo) <= 120),
  comentario         text check (char_length(comentario) <= 1000),
  productos          jsonb not null check (jsonb_typeof(productos) = 'array' and jsonb_array_length(productos) between 1 and 100),
  acepta_tratamiento boolean not null check (acepta_tratamiento),   -- prueba de la autorización (Ley 1581)
  version_politica   text not null check (char_length(version_politica) <= 40),
  origen             text check (char_length(origen) <= 120),
  -- Uso interno (lo editas tú desde el Table Editor):
  estado             text not null default 'nueva' check (estado in ('nueva','cotizada','ganada','perdida','descartada')),
  notas              text
);

create index if not exists cotizaciones_created_at_idx on public.cotizaciones (created_at desc);

-- Seguridad: el público SOLO puede insertar. No puede leer, editar ni borrar.
alter table public.cotizaciones enable row level security;
revoke all on public.cotizaciones from anon, authenticated;
grant insert (id, codigo, nombre, telefono, ciudad, empresa, email, vehiculo, comentario,
              productos, acepta_tratamiento, version_politica, origen)
  on public.cotizaciones to anon;

drop policy if exists "publico_inserta_cotizacion" on public.cotizaciones;
create policy "publico_inserta_cotizacion" on public.cotizaciones
  for insert to anon
  with check (acepta_tratamiento = true);

-- Tú ves y gestionas los datos desde el panel de Supabase (Table Editor),
-- que usa permisos de administrador y no necesita políticas adicionales.

-- ------------------------------------------------------------------
-- v1.1 · Repuestos fuera del catálogo y panel privado (/admin)
-- ------------------------------------------------------------------
alter table public.cotizaciones add column if not exists otros_repuestos text check (char_length(otros_repuestos) <= 1000);
alter table public.cotizaciones add column if not exists actualizado_en timestamptz;
alter table public.cotizaciones drop constraint if exists cotizaciones_productos_check;
alter table public.cotizaciones add constraint cotizaciones_productos_check
  check (jsonb_typeof(productos) = 'array' and jsonb_array_length(productos) <= 100);
alter table public.cotizaciones drop constraint if exists cotizaciones_algo_que_cotizar;
alter table public.cotizaciones add constraint cotizaciones_algo_que_cotizar
  check (jsonb_array_length(productos) >= 1 or char_length(coalesce(otros_repuestos, '')) >= 3);
grant insert (otros_repuestos) on public.cotizaciones to anon;

-- Quién puede entrar al panel: usuarios de Supabase Auth listados aquí.
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  creado_en timestamptz not null default now()
);
alter table public.admins enable row level security;
revoke all on public.admins from anon, authenticated;
grant select on public.admins to authenticated;
drop policy if exists "admin_se_ve" on public.admins;
create policy "admin_se_ve" on public.admins for select to authenticated using (user_id = (select auth.uid()));

create or replace function public.es_admin() returns boolean
  language sql stable security definer set search_path = '' as
$$ select exists (select 1 from public.admins where user_id = (select auth.uid())) $$;
revoke all on function public.es_admin() from public, anon;
grant execute on function public.es_admin() to authenticated;

-- El administrador lee, cambia estado/notas y elimina (solicitudes Habeas Data). No puede alterar los datos del cliente.
grant select, delete on public.cotizaciones to authenticated;
grant update (estado, notas, actualizado_en) on public.cotizaciones to authenticated;
drop policy if exists "admin_lee" on public.cotizaciones;
drop policy if exists "admin_actualiza" on public.cotizaciones;
drop policy if exists "admin_borra" on public.cotizaciones;
create policy "admin_lee" on public.cotizaciones for select to authenticated using ((select public.es_admin()));
create policy "admin_actualiza" on public.cotizaciones for update to authenticated using ((select public.es_admin())) with check ((select public.es_admin()));
create policy "admin_borra" on public.cotizaciones for delete to authenticated using ((select public.es_admin()));

-- Para dar acceso: crea el usuario en Authentication → Users y luego:
-- insert into public.admins (user_id) select id from auth.users where email = 'TU_CORREO';

-- ------------------------------------------------------------------
-- v1.2 · Productos gestionados desde /admin + fotos en Storage
-- (ver migraciones en el proyecto: productos_y_fotos, publicaciones, productos_respuesta, fotos_admin_lee)
-- ------------------------------------------------------------------
-- Tabla public.productos: id (slug), nombre, marca, referencia, ref_por_confirmar, categoria, compatible, descripcion,
--   imagenes text[], estado_ficha ('pendiente' | 'revisar' | 'completa'), pregunta, respuesta, publicado, destacado,
--   orden, creado_en, actualizado_en.  RLS: el público ve solo publicados; el admin (es_admin()) crea, edita y borra.
-- Bucket storage "productos": público para leer; solo el admin sube, lee la lista y borra.
-- Tabla public.publicaciones: registro de cada «Publicar cambios» (Edge Function supabase/functions/publicar).
