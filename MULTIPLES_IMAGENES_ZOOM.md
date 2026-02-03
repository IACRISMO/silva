# 📸 Múltiples Imágenes con Zoom - Guía Completa

## ✨ Nuevas Funcionalidades

### 1. **Múltiples Imágenes por Producto**
- Cada producto puede tener hasta **5 imágenes**
- La primera imagen es la **imagen principal**
- Galería con miniaturas para cambiar entre imágenes

### 2. **Zoom con Lupa**
- Al pasar el mouse sobre la imagen, se activa el zoom automático
- Zoom x2 que sigue el movimiento del mouse
- Icono de lupa para indicar la función de zoom

---

## 🚀 Pasos para Configurar

### Paso 1: Ejecutar Script SQL

1. **Abre Supabase → SQL Editor**
2. **Ejecuta este script:**

```sql
-- Primero ejecuta LIMPIAR_Y_CORREGIR.sql
-- Luego ejecuta AGREGAR_MULTIPLES_IMAGENES.sql
```

**Scripts en orden:**
1. `LIMPIAR_Y_CORREGIR.sql` → Corrige las políticas
2. `AGREGAR_MULTIPLES_IMAGENES.sql` → Agrega columna images[]

---

### Paso 2: Reiniciar el Servidor

```bash
# Detener el servidor (Ctrl + C en la terminal)
# O cierra la terminal

# Luego reinicia:
cd C:\Users\elcra\Desktop\26K\silva
npm run dev
```

---

## 🎨 Cómo Funciona

### En la Tienda (Vista Cliente):

#### Antes:
```
┌─────────────┐
│  1 Imagen   │
│  Sin Zoom   │
└─────────────┘
```

#### Ahora:
```
┌─────────────────┐
│  Imagen 1/3     │  ← Contador
│  🔍 Zoom x2     │  ← Icono de lupa
└─────────────────┘
┌───┬───┬───┬───┬───┐
│ 1 │ 2 │ 3 │ 4 │ 5 │  ← Miniaturas
└───┴───┴───┴───┴───┘
```

**Funciones:**
- ✅ Pasa el mouse sobre la imagen → **Zoom automático x2**
- ✅ Mueve el mouse → El zoom **sigue tu cursor**
- ✅ Haz clic en las miniaturas → **Cambia de imagen**
- ✅ Indicador **1/3** → Muestra cuántas imágenes tiene

---

### En el Panel de Admin:

#### Agregar/Editar Producto:

1. **Haz clic en "➕ Nuevo Producto"**
2. **Completa el formulario**
3. **En "📸 Imágenes del Producto":**
   - Haz clic en "Elegir archivos"
   - Selecciona **hasta 5 imágenes** (mantén Ctrl/Cmd para seleccionar múltiples)
   - Verás las previews de todas las imágenes
   - La primera será la imagen principal
   - Puedes eliminar imágenes con el botón **✕**
4. **Haz clic en "✅ Crear Producto"**

#### Vista en la Tabla:

```
┌────────┬──────────────┬──────────┐
│  📷5   │ Casco Pro    │ $85.000  │  ← El número indica cuántas imágenes
└────────┴──────────────┴──────────┘
```

---

## 📊 Estructura de Datos

### Antes:
```javascript
{
  id: 1,
  name: "Casco Pro",
  image: "url-imagen.jpg",  // Solo 1 imagen
  ...
}
```

### Ahora:
```javascript
{
  id: 1,
  name: "Casco Pro",
  image: "url-imagen.jpg",     // Primera imagen (compatibilidad)
  images: [                    // Array de imágenes
    "url-imagen-1.jpg",
    "url-imagen-2.jpg",
    "url-imagen-3.jpg"
  ],
  ...
}
```

---

## 🔧 Archivos Creados/Modificados

### Nuevos Componentes:
- ✅ `src/components/ImageZoom.jsx` → Componente de zoom con lupa
- ✅ `src/components/ProductImageGallery.jsx` → Galería con miniaturas

### Modificados:
- ✅ `src/components/ProductCard.jsx` → Usa ProductImageGallery
- ✅ `src/pages/AdminProducts.jsx` → Múltiples imágenes en formulario

### Scripts SQL:
- ✅ `LIMPIAR_Y_CORREGIR.sql` → Corrige políticas
- ✅ `AGREGAR_MULTIPLES_IMAGENES.sql` → Agrega columna images[]

---

## 💡 Cómo Usar

### Como Cliente:

1. **Ve a la tienda** (http://localhost:5173/productos)
2. **Pasa el mouse sobre cualquier imagen** → Verás el zoom
3. **Si el producto tiene múltiples imágenes:**
   - Verás miniaturas debajo de la imagen principal
   - Haz clic en las miniaturas para cambiar de imagen
   - El contador muestra: "2/5" (imagen 2 de 5)

### Como Admin:

1. **Ve al Panel Admin** → Productos
2. **Haz clic en "➕ Nuevo Producto"**
3. **En "📸 Imágenes del Producto":**
   - Haz clic en el input
   - Selecciona **múltiples archivos** (Ctrl + clic)
   - Máximo 5 imágenes
4. **Verás las previews:**
   - Primera imagen marcada como "Principal"
   - Puedes eliminar cualquier imagen con **✕**
5. **Completa el resto del formulario**
6. **Haz clic en "✅ Crear Producto"**

---

## 🎯 Características del Zoom

### Funcionalidad:
- **Zoom 2x** al pasar el mouse
- **Sigue el cursor** en tiempo real
- **Icono de lupa** visible cuando está activo
- **Transición suave** (200ms)
- **Sin clic necesario** → Automático

### Ejemplo Visual:

```
Sin hover:
┌─────────────┐
│   Imagen    │
│   Normal    │
└─────────────┘

Con hover:
┌─────────────┐
│   🔍 Zoom   │  ← Icono de lupa
│   x2        │  ← Zoom 2x
└─────────────┘
```

---

## 📋 Checklist de Verificación

### Antes de usar:
- [ ] Ejecutaste `LIMPIAR_Y_CORREGIR.sql`
- [ ] Ejecutaste `AGREGAR_MULTIPLES_IMAGENES.sql`
- [ ] Reiniciaste el servidor (`npm run dev`)
- [ ] Recargaste la página (`Ctrl + Shift + R`)
- [ ] Cerraste sesión y volviste a entrar

### Para probar:
- [ ] Crea un producto con 3-5 imágenes
- [ ] Ve a la tienda y busca ese producto
- [ ] Pasa el mouse sobre la imagen → ¿Ves el zoom?
- [ ] Haz clic en las miniaturas → ¿Cambia la imagen?
- [ ] En la tabla de admin → ¿Ves el contador de imágenes?

---

## 🐛 Solución de Problemas

### Problema 1: No veo las miniaturas
**Solución:**
- Verifica que ejecutaste `AGREGAR_MULTIPLES_IMAGENES.sql`
- Reinicia el servidor
- Recarga la página con `Ctrl + Shift + R`

### Problema 2: El zoom no funciona
**Solución:**
- Verifica que el servidor esté corriendo
- Abre la consola del navegador (F12) y busca errores
- Asegúrate de pasar el mouse sobre la imagen (no hacer clic)

### Problema 3: No puedo seleccionar múltiples imágenes
**Solución:**
- Mantén presionado `Ctrl` (Windows) o `Cmd` (Mac) mientras haces clic
- O arrastra múltiples archivos al input
- Máximo 5 imágenes

### Problema 4: Las imágenes antiguas no tienen miniaturas
**Solución:**
- Las imágenes antiguas solo tienen 1 imagen
- Edita el producto y agrega más imágenes
- O ejecuta:
  ```sql
  UPDATE products 
  SET images = ARRAY[image]::TEXT[]
  WHERE images IS NULL OR array_length(images, 1) IS NULL;
  ```

---

## 🎨 Personalización

### Cambiar el nivel de zoom:

Edita `src/components/ImageZoom.jsx`:

```javascript
// Cambiar de 2x a 3x:
transform: isZoomed ? 'scale(3)' : 'scale(1)',
```

### Cambiar el número máximo de imágenes:

Edita `src/pages/AdminProducts.jsx`:

```javascript
// Cambiar de 5 a 10:
const files = Array.from(e.target.files).slice(0, 10)
```

---

## 📈 Beneficios

### Para el Cliente:
✅ **Ve más detalles** → Zoom sin hacer clic  
✅ **Ve todas las fotos** → Múltiples ángulos del producto  
✅ **Mejor experiencia** → Interfaz más profesional  
✅ **Toma mejores decisiones** → Más información visual  

### Para el Admin:
✅ **Muestra más** → Hasta 5 fotos por producto  
✅ **Fácil de usar** → Selección múltiple de archivos  
✅ **Control total** → Elimina, reordena, edita  
✅ **Vista rápida** → Contador de imágenes en la tabla  

---

## 🎉 ¡Listo!

Ahora tus productos tienen:
- 📸 **Hasta 5 imágenes**
- 🔍 **Zoom automático con lupa**
- 🎨 **Galería con miniaturas**
- ⚡ **Transiciones suaves**
- 💼 **Interfaz profesional**

**Tu tienda ahora se ve más profesional y atractiva!** 🏍️
