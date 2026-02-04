import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getOrderById } from '../services/ordersService'
import { getImageUrl } from '../services/productsService'
import { useAuth } from '../context/AuthContext'

export default function Boleta() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    loadOrder()
  }, [orderId, isAuthenticated])

  // Refrescar estado del pago al volver a la pestaña (para ver "Pago confirmado" sin recargar a mano)
  useEffect(() => {
    const onFocus = () => {
      if (orderId && isAuthenticated) loadOrder()
    }
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [orderId, isAuthenticated])

  const loadOrder = async () => {
    setLoading(true)
    const { data, error } = await getOrderById(orderId)
    if (!error && data) {
      setOrder(data)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-gray-600">Cargando boleta...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Boleta no encontrada
        </h2>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Volver al inicio
        </button>
      </div>
    )
  }

  const paymentStatusLabel =
    order.payment_status === 'completed'
      ? 'Pago confirmado'
      : order.payment_status === 'pending_verification'
        ? 'Pago pendiente de verificación'
        : 'Pendiente'

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Volver e imprimir (no se imprimen) */}
      <div className="flex justify-between items-center mb-4 print:hidden">
        <button
          onClick={() => navigate('/')}
          className="text-gray-600 hover:text-gray-800 text-sm font-medium"
        >
          ← Volver al inicio
        </button>
        <button
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Imprimir Boleta
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto print:shadow-none">
        {/* Encabezado de la boleta */}
        <div className="border-b-2 border-gray-300 pb-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                🏍️ JASICA
              </h1>
              <p className="text-gray-600">Tienda de Cascos de Motos</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Boleta de Venta</p>
              <p className="text-xl font-bold text-blue-600">
                {order.boleta_number}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Fecha: {new Date(order.created_at).toLocaleDateString('es-PE')}
              </p>
            </div>
          </div>
        </div>

        {/* Información del cliente */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Cliente:</h3>
            <p className="text-gray-700">{order.customer_name}</p>
            <p className="text-gray-600 text-sm">{order.customer_email}</p>
            {order.customer_dni && (
              <p className="text-gray-600 text-sm">DNI: {order.customer_dni}</p>
            )}
            {order.customer_ruc && (
              <p className="text-gray-600 text-sm">RUC: {order.customer_ruc}</p>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Dirección de Envío:</h3>
            <p className="text-gray-700">{order.shipping_address?.address}</p>
            <p className="text-gray-600 text-sm">
              {order.shipping_address?.city}, {order.shipping_address?.zipCode}
            </p>
          </div>
        </div>

        {/* Items de la orden */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">Productos:</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-2 px-4 text-gray-700">Producto</th>
                  <th className="text-center py-2 px-4 text-gray-700">Cantidad</th>
                  <th className="text-right py-2 px-4 text-gray-700">Precio Unit.</th>
                  <th className="text-right py-2 px-4 text-gray-700">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.order_items?.map((item) => (
                  <tr key={item.id} className="border-b border-gray-200">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {item.products?.image && (
                          <img
                            src={item.products.image_path ? getImageUrl(item.products.image_path) : item.products.image}
                            alt={item.product_name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <span className="text-gray-800">{item.product_name}</span>
                      </div>
                    </td>
                    <td className="text-center py-3 px-4 text-gray-700">
                      {item.quantity}
                    </td>
                    <td className="text-right py-3 px-4 text-gray-700">
                      ${item.product_price.toLocaleString()}
                    </td>
                    <td className="text-right py-3 px-4 font-semibold text-gray-800">
                      ${item.subtotal.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totales y estado del pago (una sola vez) */}
        <div className="border-t-2 border-gray-300 pt-4 mt-6">
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span>${order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Envío:</span>
                <span>${order.shipping_cost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-800 pt-2 border-t border-gray-300">
                <span>Total:</span>
                <span className="text-blue-600">${order.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm text-gray-600">Estado del pago:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  order.payment_status === 'completed'
                    ? 'bg-green-100 text-green-700'
                    : order.payment_status === 'pending_verification'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {paymentStatusLabel}
                </span>
              </div>
              {(order.payment_status === 'completed' || order.payment_status === 'pending_verification') && (
                <p className="text-xs text-gray-500 pt-0.5 text-right">
                  {order.payment_status === 'completed'
                    ? 'Tu pago fue verificado por el administrador.'
                    : 'Enviaste el comprobante Yape. El administrador verificará el pago.'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


