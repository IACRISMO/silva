-- ============================================
-- SCRIPT DE LIMPIEZA Y CORRECCIÓN TOTAL
-- Ejecuta este script para corregir TODOS los errores
-- ============================================

-- ============================================
-- PASO 1: ELIMINAR TODO LO ANTIGUO
-- ============================================

-- 1.1 Eliminar políticas de user_profiles
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON user_profiles;

-- 1.2 Eliminar políticas de products
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
DROP POLICY IF EXISTS "Admins can insert products" ON products;
DROP POLICY IF EXISTS "Admins can update products" ON products;
DROP POLICY IF EXISTS "Admins can delete products" ON products;

-- 1.3 Eliminar políticas de orders
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can create own orders" ON orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Admins can update orders" ON orders;

-- 1.4 Eliminar políticas de order_items
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
DROP POLICY IF EXISTS "Users can create own order items" ON order_items;
DROP POLICY IF EXISTS "Admins can view all order items" ON order_items;

-- 1.5 Eliminar políticas de Storage
DROP POLICY IF EXISTS "Product images are viewable by everyone" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete images" ON storage.objects;

-- 1.6 Eliminar función antigua is_admin si existe
DROP FUNCTION IF EXISTS public.is_admin();

-- ============================================
-- PASO 2: CREAR FUNCIÓN AUXILIAR is_admin
-- ============================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM user_profiles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================
-- PASO 3: CREAR POLÍTICAS DE user_profiles
-- ============================================

CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT 
  USING (is_admin());

CREATE POLICY "Admins can update all profiles" ON user_profiles
  FOR UPDATE 
  USING (is_admin());

-- ============================================
-- PASO 4: CREAR POLÍTICAS DE products
-- ============================================

CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert products" ON products
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update products" ON products
  FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete products" ON products
  FOR DELETE USING (is_admin());

-- ============================================
-- PASO 5: CREAR POLÍTICAS DE orders
-- ============================================

CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders" ON orders
  FOR SELECT USING (is_admin());

CREATE POLICY "Admins can update orders" ON orders
  FOR UPDATE USING (is_admin());

-- ============================================
-- PASO 6: CREAR POLÍTICAS DE order_items
-- ============================================

CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own order items" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all order items" ON order_items
  FOR SELECT USING (is_admin());

-- ============================================
-- PASO 7: CREAR POLÍTICAS DE STORAGE
-- ============================================

CREATE POLICY "Product images are viewable by everyone" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'product-images' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Admins can update images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'product-images' AND
    is_admin()
  );

CREATE POLICY "Admins can delete images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'product-images' AND
    is_admin()
  );

-- ============================================
-- FIN DEL SCRIPT
-- ============================================

-- Verificar que todo funcionó
SELECT 'Script ejecutado correctamente - Todas las políticas creadas' AS status;
