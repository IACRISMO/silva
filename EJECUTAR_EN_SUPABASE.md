# 🚀 Cómo Ejecutar el Script SQL en Supabase

## Pasos Rápidos

1. **Abre tu proyecto en Supabase**
   - Ve a [supabase.com](https://supabase.com)
   - Selecciona tu proyecto

2. **Abre el SQL Editor**
   - En el menú lateral, haz clic en **"SQL Editor"**
   - O ve directamente a: `https://supabase.com/dashboard/project/[TU_PROYECTO]/sql`

3. **Copia y pega el script completo**
   - Abre el archivo `supabase_setup.sql` en tu editor
   - Copia TODO el contenido (Ctrl+A, Ctrl+C)
   - Pégalo en el SQL Editor de Supabase (Ctrl+V)

4. **Ejecuta el script**
   - Haz clic en el botón **"Run"** o presiona `Ctrl+Enter`
   - Espera a que termine (debería tomar unos segundos)

5. **Verifica que se crearon las tablas**
   - Ve a **"Table Editor"** en el menú lateral
   - Deberías ver 4 tablas:
     - ✅ `user_profiles` (perfiles de usuario con roles)
     - ✅ `products` (productos/cascos)
     - ✅ `orders` (órdenes/boletas con RUC y DNI)
     - ✅ `order_items` (items de cada orden, relaciona productos con órdenes)

6. **Configura Storage (IMPORTANTE)**
   - Ve a **"Storage"** en el menú lateral
   - Haz clic en **"Create bucket"**
   - Nombre: `product-images`
   - Haz clic en **"Create bucket"**
   - Las políticas de Storage ya están configuradas en el script SQL

7. **Crea tu primera cuenta de admin**
   - Ve a la aplicación y crea una cuenta
   - Luego ejecuta este SQL (reemplaza con tu email):
   ```sql
   UPDATE user_profiles
   SET role = 'admin'
   WHERE email = 'tu-email@ejemplo.com';
   ```

## ✅ Verificación

Para verificar que todo está correcto, ejecuta:

```sql
-- Ver todas las tablas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Ver productos insertados
SELECT COUNT(*) FROM products;

-- Ver perfiles de usuario
SELECT email, name, role FROM user_profiles;

-- Ver relaciones entre tablas
SELECT 
  o.boleta_number,
  o.customer_name,
  o.customer_dni,
  o.customer_ruc,
  o.total,
  COUNT(oi.id) as items_count
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id;
```

## 📋 Estructura de Relaciones

El sistema está completamente relacionado:

- **user_profiles** ← relacionado con → **auth.users**
- **orders** ← relacionado con → **user_profiles** (user_id)
- **order_items** ← relacionado con → **orders** (order_id)
- **order_items** ← relacionado con → **products** (product_id)

Cada boleta incluye:
- ✅ Información del cliente (nombre, email, DNI, RUC)
- ✅ Items de la orden relacionados con productos
- ✅ Número de boleta único generado automáticamente
- ✅ Total y subtotales calculados

## 🎉 ¡Listo!

Tu base de datos está configurada. Ahora puedes:
- Crear cuentas desde la aplicación
- Los usuarios se crearán automáticamente con rol 'user'
- Puedes convertir cualquier usuario en admin con el SQL de arriba

