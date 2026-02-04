-- ============================================
-- PAGO CON YAPE: COMPROBANTE (CAPTURA) Y VERIFICACIÓN POR ADMIN
-- Ejecuta este script en el SQL Editor de Supabase
-- ============================================

-- 1. Agregar columna para la URL de la captura del comprobante Yape
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS payment_proof_url TEXT;

-- 2. BUCKET "payment-proofs"
--    Crear en Supabase: Storage > New bucket > nombre: payment-proofs > Public: ON
--    Luego ejecutar las políticas siguientes.

-- Permitir a usuarios autenticados subir comprobantes
DROP POLICY IF EXISTS "Users can upload payment proof" ON storage.objects;
CREATE POLICY "Users can upload payment proof" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'payment-proofs' AND
    auth.role() = 'authenticated'
  );

-- Permitir a todos leer (ver imagen en boleta y en admin)
DROP POLICY IF EXISTS "Payment proofs are viewable by everyone" ON storage.objects;
CREATE POLICY "Payment proofs are viewable by everyone" ON storage.objects
  FOR SELECT USING (bucket_id = 'payment-proofs');
