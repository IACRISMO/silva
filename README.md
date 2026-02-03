# Silva - Tienda de Cascos de Motos

Aplicación web responsive para la venta de cascos de motos, desarrollada con React, Vite y Tailwind CSS.

## Características

- 🖼️ **Carrusel de imágenes** en la página de inicio
- 🛍️ **Catálogo de productos** con filtros y búsqueda
- 🔐 **Sistema de login** para usuarios
- 🛒 **Carrito de compras** con gestión de productos
- 💳 **Pasarela de pago** completa
- 📱 **Diseño responsive** adaptado para móviles y tablets

## Tecnologías Utilizadas

- React 18
- Vite
- React Router DOM
- Tailwind CSS
- Supabase (Base de datos, Autenticación, Storage)
- Context API para estado global

## Instalación

1. Instala las dependencias:
```bash
npm install
```

2. Configura Supabase:
   - Crea un proyecto en [Supabase](https://supabase.com)
   - Crea un archivo `.env` con tus credenciales:
   ```
   VITE_SUPABASE_URL=tu_url_de_supabase
   VITE_SUPABASE_ANON_KEY=tu_anon_key
   ```
   - Sigue las instrucciones en `SUPABASE_SETUP.md` para configurar las tablas

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

4. Abre tu navegador en `http://localhost:5173`

## Estructura del Proyecto

```
src/
├── components/       # Componentes reutilizables
│   ├── Header.jsx
│   ├── ImageCarousel.jsx
│   └── ProductCard.jsx
├── context/          # Contextos de React
│   ├── AuthContext.jsx
│   └── CartContext.jsx
├── pages/            # Páginas de la aplicación
│   ├── Home.jsx
│   ├── Products.jsx
│   ├── Login.jsx
│   ├── Cart.jsx
│   └── Checkout.jsx
├── data/             # Datos estáticos
│   └── products.js
├── App.jsx           # Componente principal
├── main.jsx          # Punto de entrada
└── index.css         # Estilos globales
```

## Uso

### Login/Registro
- Crea una cuenta nueva o inicia sesión con Supabase Auth
- El sistema maneja la autenticación de forma segura

### Productos
- Navega por el catálogo de cascos
- Filtra por categoría
- Busca productos por nombre
- Agrega productos al carrito (requiere login)

### Carrito
- Revisa los productos agregados
- Modifica las cantidades
- Elimina productos
- Procede al checkout

### Checkout
- Completa la información de envío
- Ingresa los datos de pago
- Confirma la compra

## Build para Producción

```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `dist/`.

## Configuración de Supabase

Consulta el archivo `SUPABASE_SETUP.md` para instrucciones detalladas sobre cómo configurar:
- Base de datos (tablas de productos y órdenes)
- Autenticación de usuarios
- Storage para imágenes
- Políticas de seguridad (RLS)

## Notas

- Las imágenes pueden almacenarse en Supabase Storage o usar URLs externas
- Las órdenes se guardan automáticamente en Supabase con número de boleta único
- El sistema de autenticación está completamente integrado con Supabase Auth

