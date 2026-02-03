# Configuración de Supabase

Esta guía te ayudará a configurar Supabase para tu aplicación de venta de cascos de motos.

## 1. Crear un proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Anota tu **URL del proyecto** y tu **Anon Key** (las encontrarás en Settings > API)

## 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto con:

```
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key
```

## 3. Crear tablas en Supabase

Ejecuta estos SQL en el SQL Editor de Supabase:

### Tabla de Productos

```sql
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT,
  image_path TEXT,
  image TEXT,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Habilitar Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Política: Todos pueden leer productos
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);
```

### Tabla de Órdenes/Boletas

```sql
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  boleta_number TEXT UNIQUE,
  items JSONB NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  shipping_address JSONB NOT NULL,
  payment_method JSONB,
  payment_status TEXT DEFAULT 'pending',
  order_status TEXT DEFAULT 'processing',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Habilitar Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Política: Usuarios solo pueden ver sus propias órdenes
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

-- Política: Usuarios pueden crear sus propias órdenes
CREATE POLICY "Users can create own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

## 4. Configurar Storage para imágenes

1. Ve a **Storage** en el panel de Supabase
2. Crea un nuevo bucket llamado `product-images`
3. Configura las políticas:

```sql
-- Política: Todos pueden leer imágenes
CREATE POLICY "Product images are viewable by everyone" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

-- Política: Solo usuarios autenticados pueden subir imágenes
CREATE POLICY "Authenticated users can upload images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'product-images' AND
    auth.role() = 'authenticated'
  );
```

## 5. Insertar productos de ejemplo

```sql
INSERT INTO products (name, description, price, category, image) VALUES
('Casco Integral Pro', 'Casco integral de alta calidad con visera anti-vaho y sistema de ventilación avanzado. Certificado DOT y ECE.', 85000, 'Integral', 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=400&h=400&fit=crop'),
('Casco Modular Elite', 'Casco modular con mentonera abatible. Perfecto para ciudad y carretera. Incluye sistema de comunicación Bluetooth.', 120000, 'Modular', 'https://images.unsplash.com/photo-1558980664-1db506751c4e?w=400&h=400&fit=crop'),
('Casco Abierto Classic', 'Casco abierto estilo clásico con diseño retro. Ligero y cómodo para paseos urbanos. Disponible en varios colores.', 45000, 'Abierto', 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=400&h=400&fit=crop'),
('Casco Deportivo Racer', 'Casco deportivo aerodinámico para alta velocidad. Diseñado para competición con máxima protección.', 150000, 'Deportivo', 'https://images.unsplash.com/photo-1558980664-1db506751c4e?w=400&h=400&fit=crop'),
('Casco Cross Adventure', 'Casco tipo cross para aventura y off-road. Visera amplia y diseño robusto para terrenos difíciles.', 95000, 'Cross', 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=400&h=400&fit=crop'),
('Casco Scooter Urban', 'Casco ligero y moderno perfecto para scooters y motos urbanas. Diseño compacto y elegante.', 55000, 'Urbano', 'https://images.unsplash.com/photo-1558980664-1db506751c4e?w=400&h=400&fit=crop');
```

## 6. Instalar dependencias

```bash
npm install
```

## 7. Iniciar la aplicación

```bash
npm run dev
```

## Notas importantes

- **Autenticación**: Supabase maneja automáticamente el registro e inicio de sesión de usuarios
- **Imágenes**: Puedes subir imágenes a Supabase Storage o usar URLs externas
- **Seguridad**: Las políticas RLS (Row Level Security) protegen los datos de los usuarios
- **Boletas**: Cada orden genera automáticamente un número de boleta único

## Funcionalidades implementadas

✅ Autenticación de usuarios con Supabase Auth
✅ Sistema de roles (Admin y Usuario Normal)
✅ Crear cuenta e iniciar sesión en la misma página
✅ Productos almacenados en Supabase
✅ Imágenes desde Supabase Storage
✅ Sistema de órdenes/boletas
✅ Historial de compras por usuario

## Sistema de Roles

- **Usuarios normales**: Pueden comprar productos y ver sus propias órdenes
- **Administradores**: Tienen acceso completo (puedes agregar funcionalidades de admin según necesites)

Para más información sobre roles, consulta `SUPABASE_ROLES_SETUP.md`

