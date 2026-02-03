-- ============================================
-- SCRIPT COMPLETO DE CONFIGURACIÓN SUPABASE
-- Ejecuta este script completo en el SQL Editor de Supabase
-- ============================================

-- 1. TABLA DE PERFILES DE USUARIO (con roles)
-- ============================================
CREATE TABLE IF NOT EXISTS user_profiles (
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
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Política: Los usuarios pueden actualizar su propio perfil (excepto el rol)
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id AND role = (SELECT role FROM user_profiles WHERE user_id = auth.uid()));

-- Política: Los admins pueden ver todos los perfiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Política: Los admins pueden actualizar cualquier perfil
DROP POLICY IF EXISTS "Admins can update all profiles" ON user_profiles;
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
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Eliminar trigger si existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Trigger para crear perfil automáticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. TABLA DE PRODUCTOS
-- ============================================
CREATE TABLE IF NOT EXISTS products (
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
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

-- Política: Solo admins pueden insertar productos
DROP POLICY IF EXISTS "Admins can insert products" ON products;
CREATE POLICY "Admins can insert products" ON products
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Política: Solo admins pueden actualizar productos
DROP POLICY IF EXISTS "Admins can update products" ON products;
CREATE POLICY "Admins can update products" ON products
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Política: Solo admins pueden eliminar productos
DROP POLICY IF EXISTS "Admins can delete products" ON products;
CREATE POLICY "Admins can delete products" ON products
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- 3. TABLA DE ÓRDENES/BOLETAS
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  boleta_number TEXT UNIQUE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_dni TEXT,
  customer_ruc TEXT,
  total DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  shipping_cost DECIMAL(10, 2) DEFAULT 0,
  shipping_address JSONB NOT NULL,
  payment_method JSONB,
  payment_status TEXT DEFAULT 'pending',
  order_status TEXT DEFAULT 'processing',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. TABLA DE ITEMS DE ORDEN (Relaciona productos con órdenes)
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) NOT NULL,
  product_name TEXT NOT NULL,
  product_price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Habilitar Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Política: Usuarios solo pueden ver sus propias órdenes
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

-- Política: Usuarios pueden crear sus propias órdenes
DROP POLICY IF EXISTS "Users can create own orders" ON orders;
CREATE POLICY "Users can create own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política: Admins pueden ver todas las órdenes
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
CREATE POLICY "Admins can view all orders" ON orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Política: Admins pueden actualizar órdenes
DROP POLICY IF EXISTS "Admins can update orders" ON orders;
CREATE POLICY "Admins can update orders" ON orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Habilitar Row Level Security para order_items
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Política: Usuarios pueden ver items de sus propias órdenes
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

-- Política: Usuarios pueden crear items para sus propias órdenes
DROP POLICY IF EXISTS "Users can create own order items" ON order_items;
CREATE POLICY "Users can create own order items" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

-- Política: Admins pueden ver todos los items
DROP POLICY IF EXISTS "Admins can view all order items" ON order_items;
CREATE POLICY "Admins can view all order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- 5. FUNCIÓN PARA GENERAR NÚMERO DE BOLETA
-- ============================================
-- Crear secuencia para números de boleta
CREATE SEQUENCE IF NOT EXISTS boleta_sequence START 1;

CREATE OR REPLACE FUNCTION generate_boleta_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.boleta_number IS NULL THEN
    NEW.boleta_number := 'BOL-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('boleta_sequence')::TEXT, 6, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para generar número de boleta automáticamente
DROP TRIGGER IF EXISTS generate_boleta_trigger ON orders;
CREATE TRIGGER generate_boleta_trigger
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION generate_boleta_number();

-- 6. CONFIGURAR STORAGE PARA IMÁGENES
-- ============================================
-- Nota: Esto debe hacerse manualmente en el panel de Supabase
-- Ve a Storage > Create bucket > nombre: "product-images"
-- Luego ejecuta estas políticas:

-- Política: Todos pueden leer imágenes
DROP POLICY IF EXISTS "Product images are viewable by everyone" ON storage.objects;
CREATE POLICY "Product images are viewable by everyone" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

-- Política: Solo usuarios autenticados pueden subir imágenes
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
CREATE POLICY "Authenticated users can upload images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'product-images' AND
    auth.role() = 'authenticated'
  );

-- Política: Solo admins pueden eliminar imágenes
DROP POLICY IF EXISTS "Admins can delete images" ON storage.objects;
CREATE POLICY "Admins can delete images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'product-images' AND
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- 7. INSERTAR PRODUCTOS DE EJEMPLO
-- ============================================
INSERT INTO products (name, description, price, category, image) VALUES
('Casco Integral Pro', 'Casco integral de alta calidad con visera anti-vaho y sistema de ventilación avanzado. Certificado DOT y ECE.', 85000, 'Integral', 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=400&h=400&fit=crop'),
('Casco Modular Elite', 'Casco modular con mentonera abatible. Perfecto para ciudad y carretera. Incluye sistema de comunicación Bluetooth.', 120000, 'Modular', 'https://images.unsplash.com/photo-1558980664-1db506751c4e?w=400&h=400&fit=crop'),
('Casco Abierto Classic', 'Casco abierto estilo clásico con diseño retro. Ligero y cómodo para paseos urbanos. Disponible en varios colores.', 45000, 'Abierto', 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=400&h=400&fit=crop'),
('Casco Deportivo Racer', 'Casco deportivo aerodinámico para alta velocidad. Diseñado para competición con máxima protección.', 150000, 'Deportivo', 'https://images.unsplash.com/photo-1558980664-1db506751c4e?w=400&h=400&fit=crop'),
('Casco Cross Adventure', 'Casco tipo cross para aventura y off-road. Visera amplia y diseño robusto para terrenos difíciles.', 95000, 'Cross', 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=400&h=400&fit=crop'),
('Casco Scooter Urban', 'Casco ligero y moderno perfecto para scooters y motos urbanas. Diseño compacto y elegante.', 55000, 'Urbano', 'https://images.unsplash.com/photo-1558980664-1db506751c4e?w=400&h=400&fit=crop'),
('Casco Integral Premium', 'Casco integral de gama alta con materiales de carbono. Ultra ligero y con máxima protección.', 200000, 'Integral', 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=400&h=400&fit=crop'),
('Casco Retro Vintage', 'Casco estilo vintage con diseño clásico. Perfecto para motos clásicas y custom. Varios colores disponibles.', 65000, 'Retro', 'https://images.unsplash.com/photo-1558980664-1db506751c4e?w=400&h=400&fit=crop')
ON CONFLICT DO NOTHING;

-- 8. CREAR ÍNDICES PARA MEJOR RENDIMIENTO
-- ============================================
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_boleta_number ON orders(boleta_number);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
-- 
-- IMPORTANTE: Después de ejecutar este script:
-- 1. Ve a Storage en Supabase y crea un bucket llamado "product-images"
-- 2. Configura las políticas de Storage (ya están en el script)
-- 3. Crea tu primera cuenta desde la aplicación
-- 4. Para convertirte en admin, ejecuta:
--    UPDATE user_profiles SET role = 'admin' WHERE email = 'tu-email@ejemplo.com';
-- ============================================

