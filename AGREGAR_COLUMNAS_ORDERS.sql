-- ============================================
-- Agregar TODAS las columnas faltantes a la tabla orders
-- Ejecuta en Supabase: SQL Editor > pegar > Run
-- ============================================

ALTER TABLE orders ADD COLUMN IF NOT EXISTS boleta_number TEXT UNIQUE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_dni TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_ruc TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10, 2);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS total DECIMAL(10, 2);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_cost DECIMAL(10, 2) DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_address JSONB;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method JSONB;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_status TEXT DEFAULT 'processing';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_proof_url TEXT;

-- Permitir NULL en items: los ítems se guardan en order_items
ALTER TABLE orders ALTER COLUMN items DROP NOT NULL;
-- Si falla (columna "items" no existe), prueba con: ALTER TABLE orders ALTER COLUMN "ítems" DROP NOT NULL;
