# 🚀 Pasos Siguientes - Guía Completa

## ✅ Paso 1: Ejecutar el Script SQL en Supabase

1. **Abre tu proyecto en Supabase**
   - Ve a https://supabase.com/dashboard
   - Selecciona tu proyecto

2. **Abre el SQL Editor**
   - En el menú lateral izquierdo, haz clic en **"SQL Editor"**
   - O ve a: `https://supabase.com/dashboard/project/[TU_PROYECTO]/sql`

3. **Copia y ejecuta el script**
   - Abre el archivo `supabase_setup.sql` en tu editor
   - Selecciona TODO el contenido (Ctrl+A)
   - Cópialo (Ctrl+C)
   - Pégalo en el SQL Editor de Supabase (Ctrl+V)
   - Haz clic en **"Run"** o presiona `Ctrl+Enter`
   - Espera a que termine (debería tomar unos segundos)

4. **Verifica que se crearon las tablas**
   - Ve a **"Table Editor"** en el menú lateral
   - Deberías ver 4 tablas:
     - ✅ `user_profiles`
     - ✅ `products`
     - ✅ `orders`
     - ✅ `order_items`

## ✅ Paso 2: Configurar Storage para Imágenes

1. **Crear el bucket**
   - Ve a **"Storage"** en el menú lateral de Supabase
   - Haz clic en **"Create bucket"**
   - Nombre: `product-images`
   - Marca **"Public bucket"** (para que las imágenes sean accesibles)
   - Haz clic en **"Create bucket"**

2. **Las políticas de Storage ya están configuradas** en el script SQL que ejecutaste

## ✅ Paso 3: Verificar Variables de Entorno

1. **Verifica que el archivo `.env` existe** en la raíz del proyecto con:
   ```
   VITE_SUPABASE_URL=https://gmjtfznnwpckqiylrmio.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtanRmem5ud3Bja3FpeWxybWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4MDEyNDUsImV4cCI6MjA4MzM3NzI0NX0.vPBtIC7OR_Y-ILGJ94b8a-nL-VLZHxRfWwUQxVY-Who
   ```

2. **Si no existe, créalo manualmente** en la raíz del proyecto

## ✅ Paso 4: Instalar Dependencias e Iniciar la Aplicación

1. **Instala las dependencias** (si no lo has hecho):
   ```bash
   npm install
   ```

2. **Inicia el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

3. **Abre tu navegador** en la URL que aparece (normalmente `http://localhost:5173`)

## ✅ Paso 5: Crear tu Primera Cuenta

1. **Ve a la página de Login**
   - Haz clic en **"Iniciar Sesión"** en el header
   - O ve directamente a `http://localhost:5173/login`

2. **Crea tu cuenta**
   - Haz clic en la pestaña **"Crear Cuenta"**
   - Completa el formulario:
     - Nombre completo
     - Email (usa tu email real)
     - Contraseña (mínimo 6 caracteres)
     - Confirmar contraseña
   - Haz clic en **"Crear Cuenta"**

3. **Verifica tu email** (si Supabase lo requiere)
   - Revisa tu bandeja de entrada
   - Haz clic en el enlace de verificación

## ✅ Paso 6: Convertirte en Administrador

1. **Ve a Supabase → SQL Editor**

2. **Ejecuta este SQL** (reemplaza con tu email):
   ```sql
   UPDATE user_profiles
   SET role = 'admin'
   WHERE email = 'tu-email@ejemplo.com';
   ```

3. **Recarga la página** de la aplicación
   - Deberías ver la etiqueta **"Admin"** en el header junto a tu nombre

## ✅ Paso 7: Probar la Aplicación

1. **Explora los productos**
   - Ve a **"Productos"** en el menú
   - Deberías ver 8 cascos de ejemplo

2. **Agrega productos al carrito**
   - Haz clic en **"Agregar"** en cualquier producto
   - Ve a **"Carrito"** para ver los productos

3. **Completa una compra de prueba**
   - Ve a **"Carrito"** → **"Proceder al Pago"**
   - Completa el formulario:
     - Nombre, Email
     - **DNI** (ejemplo: 12345678)
     - **RUC** (opcional, ejemplo: 20123456789)
     - Dirección, Ciudad, Código Postal
     - Datos de tarjeta (puedes usar datos de prueba)
   - Haz clic en **"Confirmar Pago"**

4. **Ver tu boleta**
   - Después del pago, serás redirigido a la página de boleta
   - Verás el número de boleta, productos, DNI, RUC, y totales
   - Puedes hacer clic en **"Imprimir Boleta"**

## ✅ Paso 8: Verificar en Supabase

1. **Ver tus órdenes en Supabase**
   - Ve a **"Table Editor"** → **"orders"**
   - Deberías ver la orden que acabas de crear
   - Verifica que tenga DNI, RUC y número de boleta

2. **Ver los items de la orden**
   - Ve a **"Table Editor"** → **"order_items"**
   - Deberías ver los productos relacionados con tu orden

## 🎉 ¡Listo!

Tu aplicación está completamente configurada y funcionando. Ahora puedes:

- ✅ Crear más cuentas de usuario
- ✅ Agregar más productos (si eres admin)
- ✅ Realizar compras
- ✅ Generar boletas con DNI y RUC
- ✅ Ver el historial de compras

## 🔧 Solución de Problemas

### Si no ves productos:
- Verifica que el script SQL se ejecutó correctamente
- Revisa la consola del navegador (F12) por errores

### Si no puedes crear cuenta:
- Verifica que las variables de entorno estén correctas
- Reinicia el servidor (`Ctrl+C` y luego `npm run dev`)

### Si no aparece la etiqueta "Admin":
- Verifica que ejecutaste el SQL para convertir tu usuario en admin
- Recarga la página
- Verifica en Supabase que tu usuario tenga `role = 'admin'`

### Si hay errores en la consola:
- Abre la consola del navegador (F12)
- Copia los errores y revísalos
- Verifica que todas las tablas se crearon correctamente en Supabase

## 📝 Notas Importantes

- **Todos los usuarios nuevos** tienen rol `'user'` por defecto
- **Solo los admins** pueden agregar/editar/eliminar productos
- **Las boletas** se generan automáticamente con número único
- **Los productos** están relacionados con las órdenes a través de `order_items`
- **DNI y RUC** se guardan en cada orden/boleta


