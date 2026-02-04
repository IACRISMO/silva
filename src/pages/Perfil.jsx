import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getUserOrders } from '../services/ordersService'

export default function Perfil() {
  const { user, userProfile, isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [recentOrders, setRecentOrders] = useState([])

  useEffect(() => {
    if (!isAuthenticated && !authLoading) navigate('/login')
  }, [isAuthenticated, authLoading, navigate])

  useEffect(() => {
    if (!isAuthenticated) return
    getUserOrders()
      .then(({ data, error }) => {
        if (!error && Array.isArray(data)) setRecentOrders(data.slice(0, 5))
      })
      .catch(() => {})
  }, [isAuthenticated])

  const name = userProfile?.name || user?.user_metadata?.name || user?.email?.split('@')[0] || '—'
  const email = userProfile?.email || user?.email || '—'

  const getPaymentStatusLabel = (status) => {
    if (status === 'completed') return 'Pago confirmado'
    if (status === 'pending_verification') return 'Pendiente de verificación'
    return 'Pendiente'
  }

  if (authLoading) return <div className="container mx-auto px-4 py-12 text-center"><p className="text-gray-500">Cargando...</p></div>
  if (!isAuthenticated) return null

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Mi Perfil</h1>

      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-3xl">
            👤
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{name}</h2>
            <p className="text-gray-500 text-sm">{email}</p>
          </div>
        </div>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Nombre</dt>
            <dd className="mt-1 text-gray-800">{name}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Correo electrónico</dt>
            <dd className="mt-1 text-gray-800">{email}</dd>
          </div>
        </dl>
        <p className="mt-6 text-sm text-gray-500">
          Estos son los datos con los que te registraste. Para cambiar tu nombre o correo, contacta al administrador.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Actividad reciente</h3>
        {recentOrders.length === 0 ? (
          <p className="text-gray-500 text-sm">Aún no tienes pedidos.</p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <div>
                  <p className="font-medium text-gray-800">{order.boleta_number}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString('es-PE')} · S/ {order.total?.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                    {getPaymentStatusLabel(order.payment_status)}
                  </span>
                  <Link
                    to={`/boleta/${order.id}`}
                    className="text-blue-600 text-sm font-medium hover:underline"
                  >
                    Ver boleta
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        {recentOrders.length > 0 && (
          <Link
            to="/pedidos"
            className="inline-block mt-4 text-blue-600 text-sm font-medium hover:underline"
          >
            Ver todos los pedidos →
          </Link>
        )}
      </div>
    </div>
  )
}
