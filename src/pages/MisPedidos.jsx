import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getUserOrders } from '../services/ordersService'

export default function MisPedidos() {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    getUserOrders()
      .then(({ data, error: err }) => {
        if (cancelled) return
        if (!err && data) setOrders(Array.isArray(data) ? data : [])
        else setError(err?.message || 'Error al cargar pedidos')
        setLoading(false)
      })
      .catch(() => {
        if (!cancelled) {
          setError('Error al cargar pedidos')
          setLoading(false)
        }
      })
    return () => { cancelled = true }
  }, [isAuthenticated, authLoading, navigate])

  const getPaymentStatusLabel = (status) => {
    if (status === 'completed') return 'Pago confirmado'
    if (status === 'pending_verification') return 'Pago pendiente de verificación'
    return 'Pendiente'
  }

  const getPaymentStatusClass = (status) => {
    if (status === 'completed') return 'bg-green-100 text-green-700'
    if (status === 'pending_verification') return 'bg-amber-100 text-amber-700'
    return 'bg-gray-100 text-gray-700'
  }

  if (authLoading) return <div className="container mx-auto px-4 py-12 text-center"><p className="text-gray-500">Cargando...</p></div>
  if (!isAuthenticated) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Mis Pedidos</h1>
      <p className="text-gray-600 mb-6">Historial de pedidos y boletas de pago</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      {loading ? (
        <p className="text-gray-500">Cargando pedidos...</p>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg mb-4">Aún no tienes pedidos</p>
          <Link
            to="/productos"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Ver productos
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow-md p-6 flex flex-wrap items-center justify-between gap-4"
            >
              <div>
                <p className="font-bold text-gray-800">Orden {order.boleta_number}</p>
                <p className="text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleDateString('es-PE', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusClass(order.payment_status)}`}>
                  {getPaymentStatusLabel(order.payment_status)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-blue-600">
                  ${order.total?.toLocaleString()}
                </span>
                <Link
                  to={`/boleta/${order.id}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                >
                  Ver boleta
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
