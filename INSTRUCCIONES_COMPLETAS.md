# 🏍️ Instrucciones Completas - Silva Cascos

## ⚠️ IMPORTANTE: Si ya ejecutaste el script anterior
Si ya ejecutaste el script `supabase_setup.sql` y tienes el error de recursión infinita, sigue estas instrucciones para corregirlo.

---

## 📋 Pasos para Configurar Todo Correctamente

### 1️⃣ Ejecutar el Script Corregido en Supabase

1. **Abre Supabase:**
   - Ve a https://supabase.com
   - Inicia sesión en tu cuenta
   - Selecciona tu proyecto: **crack2i16's Project**

2. **Abre el SQL Editor:**
   - En el menú lateral izquierdo, haz clic en **"SQL Editor"**
   - Aparecerá un editor de código

3. **Copia y Pega el Script:**
   - Abre el archivo: `supabase_setup_CORREGIDO.sql` (está en la carpeta del proyecto)
   - Copia TODO el contenido
   - Pégalo en el SQL Editor de Supabase

4. **Ejecuta el Script:**
   - Haz clic en el botón **"Run"** (o presiona `Ctrl + Enter`)
   - Espera a que termine (puede tardar unos segundos)
   - Si ves mensajes en verde, todo está bien
   - Si ves errores en rojo, cópialos y dime qué dice

---

### 2️⃣ Crear el Bucket de Storage para Imágenes

1. **Ve a Storage:**
   - En el menú lateral de Supabase, haz clic en **"Storage"**

2. **Crea un nuevo bucket:**
   - Haz clic en **"Create a new bucket"** (botón verde)
   - **Name:** `product-images`
   - **Public bucket:** ✅ Marca esta opción como YES/Enabled
   - Haz clic en **"Create bucket"**

3. **Verifica que se creó:**
   - Deberías ver el bucket `product-images` en la lista

---

### 3️⃣ Registrarte en la Aplicación

1. **Asegúrate de que el servidor esté corriendo:**
   - Abre PowerShell o CMD
   - Ve a la carpeta del proyecto:
     ```bash
     cd C:\Users\elcra\Desktop\26K\silva
     ```
   - Si no está corriendo, ejecuta:
     ```bash
     npm run dev
     ```
   - Deberías ver: `Local: http://localhost:5173/`

2. **Abre la aplicación en tu navegador:**
   - Ve a: http://localhost:5173

3. **Regístrate:**
   - Haz clic en **"Iniciar Sesión"** (botón azul arriba a la derecha)
   - Luego haz clic en **"Registrarse"** (link abajo del formulario)
   - Completa el formulario:
     - **Nombre:** Silva (o el nombre que quieras)
     - **Email:** silva@gmail.com
     - **Contraseña:** (elige una contraseña segura, al menos 6 caracteres)
   - Haz clic en **"Registrarse"**

4. **Verifica el registro:**
   - La aplicación debería iniciar sesión automáticamente
   - Deberías ver "Hola, silva" en el menú superior
   - **IMPORTANTE:** Aún NO verás el enlace "Admin" porque todavía no eres admin

---

### 4️⃣ Convertirte en Administrador

1. **Vuelve a Supabase → SQL Editor**

2. **Ejecuta esta consulta** (reemplaza con TU email):
   ```sql
   UPDATE user_profiles
   SET role = 'admin'
   WHERE email = 'silva@gmail.com';
   ```

3. **Haz clic en "Run"**

4. **Verifica que funcionó:**
   ```sql
   SELECT email, name, role, created_at
   FROM user_profiles
   WHERE email = 'silva@gmail.com';
   ```
   - Deberías ver tu usuario con `role = 'admin'`

---

### 5️⃣ Cerrar Sesión y Volver a Entrar

1. **En la aplicación (http://localhost:5173):**
   - Haz clic en el botón **"Salir"** (rojo, arriba a la derecha)

2. **Vuelve a iniciar sesión:**
   - Haz clic en **"Iniciar Sesión"**
   - Ingresa:
     - **Email:** silva@gmail.com
     - **Contraseña:** (la que pusiste al registrarte)
   - Haz clic en **"Iniciar Sesión"**

3. **¡Verifica que ahora eres admin!**

   Deberías ver en el menú superior:
   ```
   🏍️ Silva Cascos  |  Productos  |  ⚙️ Admin  |  🛒 Carrito  |  Hola, silva [Admin] [Salir]
   ```

   **Elementos que DEBES ver:**
   - ✅ Un enlace **"⚙️ Admin"** (en morado/púrpura)
   - ✅ Una etiqueta **"Admin"** (morada) junto a tu nombre
   - ✅ No debe haber errores en la consola del navegador (presiona F12 para verificar)

---

### 6️⃣ Acceder al Panel de Administración

1. **Haz clic en "⚙️ Admin"** en el menú superior

2. **Deberías ver el Panel de Admin con:**
   - Un botón **"+ Nuevo Producto"**
   - Una tabla con los productos existentes (8 productos de ejemplo)
   - Botones "Editar" y "Eliminar" en cada producto

---

## 🎨 Cómo Agregar un Nuevo Producto

1. **Haz clic en "+ Nuevo Producto"**

2. **Completa el formulario:**
   - **Nombre:** Ejemplo: "Casco Jet Negro Mate"
   - **Descripción:** Descripción detallada del producto
   - **Precio:** Solo números, sin símbolos (ejemplo: 75000)
   - **Stock:** Cantidad disponible (ejemplo: 15)
   - **Categoría:** Selecciona del menú desplegable
   - **Imagen del Producto:**
     - **Opción A:** Haz clic en "Elegir archivo" y selecciona una imagen desde tu PC
     - **Opción B:** Pega una URL de imagen (ejemplo: https://example.com/casco.jpg)
     - Si subes archivo Y pones URL, se usa el archivo subido

3. **Haz clic en "Crear Producto"**

4. **Verifica que se creó:**
   - Deberías ver un mensaje verde: "Producto creado exitosamente"
   - El producto aparecerá en la tabla
   - También aparecerá en la página de inicio y en "Productos"

---

## 🔧 Editar o Eliminar Productos

### Editar:
1. Haz clic en **"Editar"** junto al producto
2. Modifica los campos que quieras
3. Puedes cambiar la imagen subiendo una nueva o cambiando la URL
4. Haz clic en **"Actualizar Producto"**

### Eliminar:
1. Haz clic en **"Eliminar"** junto al producto
2. Confirma la eliminación
3. El producto desaparecerá de la tabla y de la web

---

## ✅ Verificar que Todo Funciona

### Verificar en la Web:
1. **Página de Inicio** (http://localhost:5173/)
   - Deberías ver los 3 productos más recientes en "Productos Destacados"

2. **Página de Productos** (http://localhost:5173/productos)
   - Deberías ver todos los productos
   - Puedes buscar por nombre
   - Puedes filtrar por categoría

3. **Agregar al Carrito:**
   - Haz clic en "Agregar al carrito" en cualquier producto
   - El contador del carrito (arriba) debería aumentar

### Verificar en Supabase:

```sql
-- Ver todos los usuarios
SELECT email, name, role, created_at 
FROM user_profiles 
ORDER BY created_at DESC;

-- Ver todos los productos
SELECT id, name, category, price, stock, created_at 
FROM products 
ORDER BY created_at DESC;

-- Verificar que eres admin (debe retornar 'true')
SELECT is_admin();

-- Ver las imágenes en Storage
-- Ve a Storage > product-images y deberías ver las imágenes subidas
```

---

## ❌ Solución de Problemas

### Problema 1: No veo el enlace "⚙️ Admin"
**Solución:**
1. Verifica que tu rol sea 'admin' en Supabase:
   ```sql
   SELECT role FROM user_profiles WHERE email = 'silva@gmail.com';
   ```
2. Cierra sesión y vuelve a iniciar sesión
3. Recarga la página completamente (Ctrl + Shift + R)
4. Abre la consola del navegador (F12) y busca errores

### Problema 2: Error "infinite recursion" en la consola
**Solución:**
- Ejecuta el script `supabase_setup_CORREGIDO.sql` completo
- Este error ya está corregido en el nuevo script

### Problema 3: No puedo subir imágenes
**Solución:**
1. Verifica que el bucket `product-images` existe en Storage
2. Verifica que el bucket sea PÚBLICO (Public bucket: YES)
3. Verifica que las políticas de Storage estén creadas (están en el script corregido)

### Problema 4: Los productos no aparecen en la web
**Solución:**
1. Verifica en Supabase que los productos existen:
   ```sql
   SELECT * FROM products;
   ```
2. Abre la consola del navegador (F12) y busca errores
3. Verifica que las políticas RLS estén correctas (están en el script corregido)

### Problema 5: Error al crear/editar productos
**Solución:**
1. Verifica que eres admin:
   ```sql
   SELECT is_admin();
   ```
2. Si retorna `false`, ejecuta:
   ```sql
   UPDATE user_profiles SET role = 'admin' WHERE email = 'silva@gmail.com';
   ```
3. Cierra sesión y vuelve a iniciar sesión

---

## 📞 Si Sigues Teniendo Problemas

1. **Abre la consola del navegador** (F12)
2. **Busca errores** (líneas en rojo)
3. **Toma capturas de pantalla** del error
4. **Copia el mensaje de error** completo
5. **Envíamelo** para ayudarte a solucionarlo

---

## 🎉 ¡Listo!

Si seguiste todos los pasos, ahora deberías tener:
- ✅ Servidor funcionando en http://localhost:5173
- ✅ Base de datos configurada en Supabase
- ✅ Cuenta de admin funcionando
- ✅ Panel de administración accesible
- ✅ Capacidad de agregar/editar/eliminar productos
- ✅ Subida de imágenes funcionando
- ✅ Productos apareciendo en la web

**¡Ya puedes gestionar tu tienda de cascos como administrador!** 🏍️
