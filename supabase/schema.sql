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
