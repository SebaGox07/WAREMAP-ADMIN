-- WAREMAP ADMIN: ejecutar en Supabase SQL Editor sobre la misma base de WAREMAP.
-- NO ejecuta ni modifica datos existentes; solo añade permisos a administradores.
-- 1) En Supabase > Authentication > Users, crea un usuario de correo/contraseña.
-- 2) Copia su UUID y sustituye el marcador de abajo ANTES de ejecutar.
-- IMPORTANTE: este script no abre escritura pública para visitantes anónimos.

create table if not exists public.waremap_admins (
 user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.waremap_admins enable row level security;
revoke all on public.waremap_admins from public, anon, authenticated;

create or replace function public.es_admin_waremap()
returns boolean language sql stable security definer set search_path = ''
as $$ select exists(select 1 from public.waremap_admins where user_id = (select auth.uid())); $$;
revoke all on function public.es_admin_waremap() from public, anon;
grant execute on function public.es_admin_waremap() to authenticated;

-- Insertar únicamente el UUID de un usuario creado en Authentication > Users:
-- Sustituye este ejemplo por tu UUID real, quitando los dos guiones iniciales.
-- insert into public.waremap_admins(user_id) values ('REEMPLAZAR_CON_UUID_DE_AUTH_USERS') on conflict do nothing;

-- Mantener la lectura anónima existente de WAREMAP, sin permiso de escritura anónimo.
revoke insert, update, delete on public.ubicaciones from anon;
grant select, update(tipo3d, productos) on public.ubicaciones to authenticated;

drop policy if exists "Admin WAREMAP lectura" on public.ubicaciones;
create policy "Admin WAREMAP lectura" on public.ubicaciones
for select to authenticated using ((select public.es_admin_waremap()));

drop policy if exists "Admin WAREMAP edición" on public.ubicaciones;
create policy "Admin WAREMAP edición" on public.ubicaciones
for update to authenticated
using ((select public.es_admin_waremap()))
with check ((select public.es_admin_waremap()));
