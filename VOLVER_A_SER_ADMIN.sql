-- ============================================
-- VOLVER A VER EL PANEL ADMIN
-- Ejecuta en Supabase: SQL Editor
-- ============================================
-- Reemplaza 'TU_EMAIL@ejemplo.com' por el email con el que inicias sesión.

-- Opción 1: Si ya tienes fila en user_profiles, solo actualizar el rol
UPDATE user_profiles
SET role = 'admin'
WHERE email = 'TU_EMAIL@ejemplo.com';

-- Opción 2: Si no tienes fila (o no estás seguro), usar este bloque
-- Reemplaza TU_EMAIL y TU_USER_ID (el UUID del usuario en auth.users)
/*
INSERT INTO user_profiles (user_id, name, email, role)
SELECT id, raw_user_meta_data->>'name', email, 'admin'
FROM auth.users
WHERE email = 'TU_EMAIL@ejemplo.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
*/

-- Para ver tu user_id y email: en Supabase > Authentication > Users
-- Para ver perfiles actuales: SELECT id, user_id, email, name, role FROM user_profiles;
