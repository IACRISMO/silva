import { supabase } from '../lib/supabase'

// Crear una nueva orden/boleta
export async function createOrder(orderData) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('Usuario no autenticado')
    }

    // Pago con Yape: pendiente de verificación hasta que el admin confirme
    const isYapePayment = orderData.paymentMethod?.type === 'yape'
    const paymentStatus = isYapePayment ? 'pending_verification' : 'pending'

    const order = {
      user_id: user.id,
      customer_name: orderData.customerName,
      customer_email: orderData.customerEmail,
      customer_dni: orderData.customerDNI || null,
      customer_ruc: orderData.customerRUC || null,
      subtotal: orderData.total,
      total: orderData.total,
      shipping_cost: 0,
      shipping_address: orderData.shippingAddress,
      payment_method: orderData.paymentMethod,
      payment_proof_url: orderData.paymentProofUrl || null,
      payment_status: paymentStatus,
      order_status: 'processing',
      created_at: new Date().toISOString()
    }

    const { data: orderResult, error: orderError } = await supabase
      .from('orders')
      .insert([order])
      .select()
      .single()

    if (orderError) throw orderError

    // Crear los items de la orden (relacionados con productos)
    const orderItems = orderData.items.map(item => ({
      order_id: orderResult.id,
      product_id: item.product_id,
      product_name: item.name,
      product_price: item.price,
      quantity: item.quantity,
      subtotal: item.price * item.quantity
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) throw itemsError

    // Solo marcar pago completado si NO es Yape (Yape lo confirma el admin después)
    if (!isYapePayment) {
      const { error: updateError } = await supabase
        .from('orders')
        .update({ 
          payment_status: 'completed',
          order_status: 'confirmed',
          updated_at: new Date().toISOString()
        })
        .eq('id', orderResult.id)

      if (updateError) throw updateError
    }

    // Obtener la orden completa con el número de boleta generado
    const { data: finalOrder, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderResult.id)
      .single()

    if (fetchError) throw fetchError

    return { data: finalOrder, error: null }
  } catch (error) {
    console.error('Error creating order:', error)
    return { data: null, error }
  }
}

// Obtener órdenes del usuario actual con sus items
export async function getUserOrders() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('Usuario no autenticado')
    }

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          product_id,
          product_name,
          product_price,
          quantity,
          subtotal
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching orders:', error)
    return { data: null, error }
  }
}

// Obtener una orden por ID con sus items y productos relacionados
export async function getOrderById(orderId) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('Usuario no autenticado')
    }

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          product_id,
          product_name,
          product_price,
          quantity,
          subtotal,
          products (
            id,
            name,
            image,
            image_path
          )
        )
      `)
      .eq('id', orderId)
      .eq('user_id', user.id)
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching order:', error)
    return { data: null, error }
  }
}

// Actualizar estado de pago
export async function updatePaymentStatus(orderId, status) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ 
        payment_status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error updating payment status:', error)
    return { data: null, error }
  }
}

