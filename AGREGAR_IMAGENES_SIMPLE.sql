-- ============================================
-- AGREGAR SOPORTE PARA MÚLTIPLES IMÁGENES
-- Versión Simple (sin fallback/placeholder)
-- ============================================

-- 1. Agregar columna para múltiples imágenes (array de URLs)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- 2. Migrar imagen existente al array de imágenes
-- Esto toma tu imagen actual del campo 'image' y la pone en el array 'images'
UPDATE products 
SET images = ARRAY[image]::TEXT[]
WHERE image IS NOT NULL 
  AND (images IS NULL OR array_length(images, 1) IS NULL);

-- 3. Verificar los cambios (ver las primeras 5 filas)
SELECT 
  id, 
  name, 
  image as imagen_antigua,
  images as imagenes_nuevas,
  array_length(images, 1) as cantidad_imagenes
FROM products 
LIMIT 10;

-- ============================================
-- RESULTADO ESPERADO:
-- ============================================
-- Los productos que tenían una imagen en 'image'
-- ahora tendrán esa misma imagen en 'images[0]'
-- 
-- Ejemplo:
-- image: 'https://ejemplo.com/casco.jpg'
-- images: ['https://ejemplo.com/casco.jpg']
-- ============================================
