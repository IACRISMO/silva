-- ============================================
-- AGREGAR SOPORTE PARA MÚLTIPLES IMÁGENES
-- ============================================

-- Agregar columna para múltiples imágenes (array de URLs)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- Migrar imagen existente al array de imágenes
UPDATE products 
SET images = ARRAY[image]::TEXT[]
WHERE image IS NOT NULL AND (images IS NULL OR array_length(images, 1) IS NULL);

-- Hacer que al menos haya una imagen en el array
UPDATE products 
SET images = ARRAY['https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=400&h=400&fit=crop']::TEXT[]
WHERE images IS NULL OR array_length(images, 1) IS NULL;

-- Verificar los cambios
SELECT id, name, image, images FROM products LIMIT 5;
