import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import { supabase } from '../lib/supabase'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Error cargando órdenes:', error)
    }
    setLoading(false)
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ order_status: newStatus })
        .eq('id', orderId)

      if (error) throw error
      loadOrders()
    } catch (error) {
      console.error('Error actualizando estado:', error)
    }
  }

  const confirmPayment = async (orderId) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          payment_status: 'completed',
          order_status: 'confirmed',
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)

      if (error) throw error
      loadOrders()
    } catch (error) {
      console.error('Error confirmando pago:', error)
    }
  }

  const getStatusBadge = (status) => {
    const styles = {
      processing: 'bg-yellow-100 text-yellow-700',
      shipped: 'bg-blue-100 text-blue-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700'
    }
    
    const labels = {
      processing: 'Procesando',
      shipped: 'Enviado',
      delivered: 'Entregado',
      cancelled: 'Cancelado'
    }

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
        {labels[status] || status}
      </span>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Órdenes</h1>
          <p className="text-gray-600 mt-2">Administra los pedidos de los clientes</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Lista de Órdenes ({orders.length})</h2>
          
          {loading ? (
            <p className="text-gray-500">Cargando órdenes...</p>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No hay órdenes registradas</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        Orden #{order.boleta_number}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString('es-CL', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      {order.payment_status === 'pending_verification' && (
                        <span className="inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                          Pago pendiente de verificación
                        </span>
                      )}
                      {order.payment_status === 'completed' && (
                        <span className="inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                          Pagado
                        </span>
                      )}
                    </div>
                    {getStatusBadge(order.order_status)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Cliente</p>
                      <p className="font-medium">{order.customer_name}</p>
                      <p className="text-sm text-gray-600">{order.customer_email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Dirección de Envío</p>
                      <p className="font-medium">
                        {order.shipping_address?.address || order.shipping_address?.street || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.shipping_address?.city || ''} {order.shipping_address?.zipCode || order.shipping_address?.region || ''}
                      </p>
                    </div>
                  </div>

                  {order.payment_proof_url && (
                    <div className="border-t pt-4 mb-4">
                      <p className="text-sm text-gray-600 mb-2">Comprobante Yape (captura):</p>
                      <a
                        href={order.payment_proof_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block"
                      >
                        <img
                          src={order.payment_proof_url}
                          alt="Comprobante Yape"
                          className="max-h-48 rounded-lg border border-gray-200 object-contain hover:opacity-90"
                        />
                      </a>
                      <p className="text-xs text-gray-500 mt-1">Haz clic en la imagen para ver en tamaño completo</p>
                      {order.payment_status === 'pending_verification' && (
                        <button
                          type="button"
                          onClick={() => confirmPayment(order.id)}
                          className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                        >
                          Confirmar pago (marcar como pagado)
                        </button>
                      )}
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600 mb-2">Productos:</p>
                    <div className="space-y-2">
                      {order.order_items?.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>{item.product_name} x{item.quantity}</span>
                          <span className="font-medium">${item.subtotal?.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-lg font-bold text-blue-600">
                          Total: ${order.total?.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <select
                          value={order.order_status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="px-4 py-2 border rounded-lg text-sm"
                        >
                          <option value="processing">Procesando</option>
                          <option value="shipped">Enviado</option>
                          <option value="delivered">Entregado</option>
                          <option value="cancelled">Cancelado</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
