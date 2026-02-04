import { supabase } from '../lib/supabase'

/** Obtener notificaciones del usuario actual */
export async function getNotifications(userId, limit = 20) {
  if (!userId) return { data: [], error: null }
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
  return { data: data ?? [], error }
}

/** Marcar una notificación como leída */
export async function markNotificationAsRead(notificationId) {
  const { data, error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId)
    .select()
    .single()
  return { data, error }
}

/** Marcar todas como leídas */
export async function markAllAsRead(userId) {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId)
    .eq('read', false)
  return { error }
}

/** Crear notificación "pago confirmado" para el cliente (lo llama el admin al confirmar pago) */
export async function createPaymentConfirmedNotification(orderId, clientUserId, boletaNumber) {
  if (!clientUserId || !orderId) return { error: new Error('Faltan datos') }
  const { data, error } = await supabase
    .from('notifications')
    .insert({
      user_id: clientUserId,
      type: 'payment_confirmed',
      order_id: orderId,
      title: 'Pago confirmado',
      message: `Tu pago para la orden ${boletaNumber || orderId} fue confirmado.`,
      read: false
    })
    .select()
    .single()
  return { data, error }
}

/** Suscribirse a nuevas notificaciones en tiempo real */
export function subscribeToNotifications(userId, onInsert) {
  if (!userId) return () => {}
  const channel = supabase
    .channel('notifications-' + userId)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      },
      (payload) => onInsert(payload.new)
    )
    .subscribe()
  return () => {
    supabase.removeChannel(channel)
  }
}
