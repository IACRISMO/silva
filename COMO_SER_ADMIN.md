# Cómo convertirse en Administrador

## Pasos para activar tu cuenta como Admin

### 1. Registra una cuenta en la aplicación

Primero, regístrate con tu email en la aplicación:
- Ejecuta el servidor: `npm run dev`
- Ve a http://localhost:5173
- Haz clic en "Iniciar Sesión" → "Registrarse"
- Completa el formulario de registro

### 2. Convertir tu cuenta en Admin

Una vez registrado, necesitas actualizar tu rol a 'admin' en Supabase:

**Opción A: Desde el SQL Editor de Supabase**

1. Ve a tu proyecto en [Supabase](https://supabase.com)
2. Haz clic en "SQL Editor" en el menú lateral
3. Ejecuta esta consulta (reemplaza `TU_EMAIL_AQUI` con tu email):

```sql
UPDATE user_profiles
SET role = 'admin'
WHERE email = 'TU_EMAIL_AQUI';
```

4. Haz clic en "Run" para ejecutar

**Opción B: Desde Table Editor**

1. Ve a "Table Editor" en Supabase
2. Selecciona la tabla `user_profiles`
3. Busca tu fila (con tu email)
4. Haz doble clic en la columna `role`
5. Cambia `user` por `admin`
6. Guarda los cambios

### 3. Verifica que eres Admin

1. Cierra sesión en la aplicación
2. Vuelve a iniciar sesión
3. Deberías ver:
   - Una etiqueta "Admin" junto a tu nombre
   - Un enlace "⚙️ Admin" en el menú de navegación

### 4. Accede al Panel de Administración

1. Haz clic en "⚙️ Admin" en el menú superior
2. ¡Ya puedes agregar, editar y eliminar productos!

## Cómo agregar productos

### Método 1: Subir imagen desde tu computadora (Recomendado)

1. Ve al Panel de Admin (`/admin`)
2. Haz clic en "+ Nuevo Producto"
3. Completa el formulario:
   - **Nombre**: Nombre del casco
   - **Descripción**: Descripción detallada
   - **Precio**: Precio en pesos (sin puntos ni comas)
   - **Stock**: Cantidad disponible
   - **Categoría**: Selecciona del menú desplegable
   - **Imagen del Producto**: Haz clic y selecciona una imagen desde tu PC
4. Haz clic en "Crear Producto"

### Método 2: Usar URL de imagen

1. En lugar de subir una imagen, puedes pegar una URL en el campo "URL de Imagen"
2. Puedes usar imágenes de:
   - Unsplash: https://unsplash.com/
   - Tu propio servidor
   - Cualquier URL pública de imagen

**Nota**: Si subes una imagen Y pones una URL, la imagen subida tendrá prioridad.

## Editar o Eliminar Productos

En el Panel de Admin:
- **Editar**: Haz clic en "Editar" junto al producto
- **Eliminar**: Haz clic en "Eliminar" (te pedirá confirmación)

## Configurar Storage de Supabase (Primera vez)

Si es la primera vez que vas a subir imágenes, necesitas configurar el bucket de Storage:

1. Ve a tu proyecto en Supabase
2. Haz clic en "Storage" en el menú lateral
3. Haz clic en "Create a new bucket"
4. Nombre: `product-images`
5. Marca "Public bucket" ✅
6. Haz clic en "Create bucket"

Las políticas de seguridad ya están configuradas en el script SQL que ejecutaste anteriormente.

## Verificar que los productos aparecen en la web

1. Ve a la página de inicio (`/`)
2. Los productos destacados deberían mostrarse automáticamente
3. Ve a "Productos" para ver todos los productos
4. Los productos se cargan desde Supabase en tiempo real

## Solución de problemas

### No veo el enlace "Admin" en el menú

- Verifica que tu rol sea 'admin' en la tabla `user_profiles`
- Cierra sesión y vuelve a iniciar sesión
- Refresca la página (F5)

### Error al subir imágenes

- Verifica que el bucket `product-images` existe en Storage
- Verifica que el bucket sea público
- Revisa las políticas de Storage en el SQL Editor

### Los productos no aparecen en la web

- Verifica que los productos existen en la tabla `products` de Supabase
- Abre la consola del navegador (F12) y busca errores
- Verifica que las políticas RLS estén configuradas correctamente

## Comandos útiles de SQL

### Ver todos los usuarios y sus roles

```sql
SELECT email, name, role, created_at
FROM user_profiles
ORDER BY created_at DESC;
```

### Ver todos los productos

```sql
SELECT id, name, category, price, stock, created_at
FROM products
ORDER BY created_at DESC;
```

### Cambiar el rol de un usuario

```sql
-- De user a admin
UPDATE user_profiles
SET role = 'admin'
WHERE email = 'usuario@ejemplo.com';

-- De admin a user
UPDATE user_profiles
SET role = 'user'
WHERE email = 'usuario@ejemplo.com';
```

---

¡Listo! Ya puedes gestionar tu tienda de cascos como administrador. 🏍️
