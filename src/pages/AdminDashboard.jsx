import { useState, useEffect, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import { getProducts } from '../services/productsService'
import { supabase } from '../lib/supabase'

export default function AdminDashboard() {
  const location = useLocation()
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    lowStock: 0
  })
  const [loading, setLoading] = useState(true)
  const [recentProducts, setRecentProducts] = useState([])

  const loadDashboardData = useCallback(async () => {
    setLoading(true)
    try {
      // Cargar productos
      const { data: products } = await getProducts()
      const totalProducts = products?.length || 0
      const lowStock = products?.filter(p => p.stock < 5).length || 0
      setRecentProducts(products?.slice(0, 5) || [])

      // Cargar órdenes
      const { data: orders } = await supabase
        .from('orders')
        .select('id')
      const totalOrders = orders?.length || 0

      // Cargar usuarios
      const { data: users } = await supabase
        .from('user_profiles')
        .select('id')
      const totalUsers = users?.length || 0

      setStats({
        totalProducts,
        totalOrders,
        totalUsers,
        lowStock
      })
    } catch (error) {
      console.error('Error cargando dashboard:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Recargar datos al entrar a /admin (incluye volver desde la tienda)
  useEffect(() => {
    loadDashboardData()
  }, [location.pathname, loadDashboardData])

  // Recargar datos cuando vuelves a la pestaña del admin
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && location.pathname === '/admin') {
        loadDashboardData()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [location.pathname, loadDashboardData])

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Título */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-2">Resumen general de tu tienda</p>
        </div>

        {/* Tarjetas de Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Productos</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {loading ? '...' : stats.totalProducts}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <span className="text-3xl">📦</span>
              </div>
            </div>
            <Link
              to="/admin/productos"
              className="text-blue-600 text-sm hover:underline mt-4 inline-block"
            >
              Ver todos →
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Órdenes</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {loading ? '...' : stats.totalOrders}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <span className="text-3xl">📋</span>
              </div>
            </div>
            <Link
              to="/admin/ordenes"
              className="text-green-600 text-sm hover:underline mt-4 inline-block"
            >
              Ver todas →
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Clientes</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {loading ? '...' : stats.totalUsers}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <span className="text-3xl">👥</span>
              </div>
            </div>
            <Link
              to="/admin/clientes"
              className="text-purple-600 text-sm hover:underline mt-4 inline-block"
            >
              Ver todos →
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Stock Bajo</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {loading ? '...' : stats.lowStock}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <span className="text-3xl">⚠️</span>
              </div>
            </div>
            <Link
              to="/admin/productos"
              className="text-red-600 text-sm hover:underline mt-4 inline-block"
            >
              Revisar →
            </Link>
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/admin/productos"
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <span className="text-2xl">➕</span>
              <div>
                <p className="font-semibold text-gray-800">Agregar Producto</p>
                <p className="text-sm text-gray-600">Nuevo producto a la tienda</p>
              </div>
            </Link>

            <Link
              to="/admin/ordenes"
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all"
            >
              <span className="text-2xl">📋</span>
              <div>
                <p className="font-semibold text-gray-800">Ver Órdenes</p>
                <p className="text-sm text-gray-600">Gestionar pedidos</p>
              </div>
            </Link>

            <Link
              to="/admin/clientes"
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all"
            >
              <span className="text-2xl">👥</span>
              <div>
                <p className="font-semibold text-gray-800">Ver Clientes</p>
                <p className="text-sm text-gray-600">Lista de usuarios</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Productos Recientes */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Productos Recientes</h2>
            <Link
              to="/admin/productos"
              className="text-blue-600 hover:underline text-sm"
            >
              Ver todos
            </Link>
          </div>
          
          {loading ? (
            <p className="text-gray-500">Cargando...</p>
          ) : recentProducts.length === 0 ? (
            <p className="text-gray-500">No hay productos</p>
          ) : (
            <div className="space-y-3">
              {recentProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50"
                >
                  <img
                    src={product.images?.[0] || product.image}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">${product.price?.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Stock: {product.stock || 0}</p>
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
