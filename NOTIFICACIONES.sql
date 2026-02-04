-- ============================================
-- NOTIFICACIONES: Admin (nueva orden Yape) y Cliente (pago confirmado)
-- Ejecuta en Supabase: SQL Editor > pegar > Run
-- ============================================

-- 1. TABLA notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('new_order_pending', 'payment_confirmed')),
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  message TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Usuarios solo ven sus propias notificaciones
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Inserts: trigger (al crear orden Yape) inserta para admins; admin inserta para cliente al confirmar pago
-- El trigger corre como SECURITY DEFINER; el admin inserta desde la app.
DROP POLICY IF EXISTS "Users can insert notifications" ON notifications;
CREATE POLICY "Users can insert notifications" ON notifications
  FOR INSERT WITH CHECK (true);

-- 2. TRIGGER: cuando se crea una orden con pago Yape pendiente, notificar a todos los admins
CREATE OR REPLACE FUNCTION notify_admins_new_order()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.payment_status = 'pending_verification' THEN
    INSERT INTO notifications (user_id, type, order_id, title, message)
    SELECT up.user_id, 'new_order_pending', NEW.id,
           'Nueva orden con comprobante Yape',
           'Orden ' || COALESCE(NEW.boleta_number, NEW.id::text) || ' - Revisar y confirmar pago.'
    FROM user_profiles up
    WHERE up.role = 'admin';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_order_pending_notify_admins ON orders;
CREATE TRIGGER on_order_pending_notify_admins
  AFTER INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION notify_admins_new_order();

-- 3. TRIGGER: cuando el admin confirma el pago (payment_status pasa a 'completed'), notificar al cliente
CREATE OR REPLACE FUNCTION notify_client_payment_confirmed()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.payment_status = 'completed' AND (OLD.payment_status IS NULL OR OLD.payment_status <> 'completed') THEN
    INSERT INTO notifications (user_id, type, order_id, title, message)
    VALUES (
      NEW.user_id,
      'payment_confirmed',
      NEW.id,
      'Pago confirmado',
      'Tu pago para la orden ' || COALESCE(NEW.boleta_number, NEW.id::text) || ' fue confirmado.'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_order_payment_confirmed_notify_client ON orders;
CREATE TRIGGER on_order_payment_confirmed_notify_client
  AFTER UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION notify_client_payment_confirmed();

-- ============================================
-- REALTIME (opcional): Para que las notificaciones lleguen al instante sin recargar:
-- En Supabase: Database > Publications > supabase_realtime > agregar la tabla "notifications".
-- ============================================
