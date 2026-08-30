-- Ejecutar en Supabase SQL Editor después de que el usuario se haya registrado.
-- Sustituir el correo por el del primer administrador.
update public.profiles
set role = 'admin'
where email = 'admin@example.com';
