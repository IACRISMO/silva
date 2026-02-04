-- ============================================
-- TODO COMPLETO: ÓRDENES + PAGO YAPE
-- Ejecuta este script completo en Supabase: SQL Editor > pegar > Run
-- ============================================

-- 1. COLUMNAS FALTANTES EN orders
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

-- 2. PERMITIR NULL EN items / ítems (los ítems van en order_items)
-- ============================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'items') THEN
    ALTER TABLE orders ALTER COLUMN items DROP NOT NULL;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'ítems') THEN
    ALTER TABLE orders ALTER COLUMN "ítems" DROP NOT NULL;
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- 3. POLÍTICAS STORAGE PARA COMPROBANTES YAPE (bucket payment-proofs)
-- ============================================
-- Crear antes el bucket en Supabase: Storage > New bucket > nombre: payment-proofs > Public: ON

DROP POLICY IF EXISTS "Users can upload payment proof" ON storage.objects;
CREATE POLICY "Users can upload payment proof" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'payment-proofs' AND
    auth.role() = 'authenticated'
  );

DROP POLICY IF EXISTS "Payment proofs are viewable by everyone" ON storage.objects;
CREATE POLICY "Payment proofs are viewable by everyone" ON storage.objects
  FOR SELECT USING (bucket_id = 'payment-proofs');

-- ============================================
-- FIN
-- ============================================
-- Después: crear bucket "payment-proofs" en Storage (Public: ON) si no existe.
