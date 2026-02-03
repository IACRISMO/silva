# Configuración de Roles de Usuario en Supabase

Esta guía te ayudará a configurar el sistema de roles (Admin y Usuario Normal) en Supabase.

## 1. Crear tabla de perfiles de usuario

Ejecuta este SQL en el SQL Editor de Supabase:

```sql
-- Crear tabla de perfiles de usuario
CREATE TABLE user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Habilitar Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios pueden ver su propio perfil
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Política: Los usuarios pueden actualizar su propio perfil (excepto el rol)
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id AND role = (SELECT role FROM user_profiles WHERE user_id = auth.uid()));

-- Política: Los admins pueden ver todos los perfiles
CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Política: Los admins pueden actualizar cualquier perfil
CREATE POLICY "Admins can update all profiles" ON user_profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Función para crear perfil automáticamente cuando se crea un usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil automáticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## 2. Crear un usuario administrador

Después de crear tu primera cuenta, puedes convertirla en admin ejecutando este SQL (reemplaza `TU_EMAIL_AQUI` con el email del usuario que quieres hacer admin):

```sql
-- Convertir un usuario en admin
UPDATE user_profiles
SET role = 'admin'
WHERE email = 'TU_EMAIL_AQUI';
```

O puedes crear un admin directamente desde el inicio:

```sql
-- Primero, crea el usuario en auth.users (esto se hace automáticamente al registrarse)
-- Luego, actualiza su perfil para ser admin
UPDATE user_profiles
SET role = 'admin'
WHERE email = 'admin@silva.com';
```

## 3. Verificar roles

Para ver todos los usuarios y sus roles:

```sql
SELECT 
  up.email,
  up.name,
  up.role,
  up.created_at
FROM user_profiles up
ORDER BY up.created_at DESC;
```

## 4. Cambiar rol de un usuario

Para cambiar el rol de un usuario (solo admins pueden hacer esto desde la aplicación):

```sql
-- Cambiar a admin
UPDATE user_profiles
SET role = 'admin'
WHERE email = 'usuario@ejemplo.com';

-- Cambiar a usuario normal
UPDATE user_profiles
SET role = 'user'
WHERE email = 'usuario@ejemplo.com';
```

## 5. Uso en la aplicación

En tu aplicación React, puedes verificar si un usuario es admin:

```javascript
import { useAuth } from '../context/AuthContext'

function MyComponent() {
  const { isAdmin, userProfile } = useAuth()

  if (isAdmin) {
    // Mostrar opciones de administrador
  }

  return (
    <div>
      <p>Rol: {userProfile?.role}</p>
      {isAdmin && <button>Panel de Admin</button>}
    </div>
  )
}
```

## Notas importantes

- **Seguridad**: Los roles se verifican tanto en el frontend como en las políticas RLS de Supabase
- **Por defecto**: Todos los nuevos usuarios tienen el rol 'user'
- **Admin**: Solo los usuarios con rol 'admin' pueden ver y modificar todos los perfiles
- **Trigger automático**: Cuando un usuario se registra, se crea automáticamente su perfil con rol 'user'


