import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminLayout({ children }) {
  const { user, logout, isAdmin, loading: authLoading } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  // Redirigir a tienda cuando ya cargó la sesión y no es admin
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/', { replace: true })
    }
  }, [authLoading, isAdmin, navigate])

  // Mientras carga la sesión, mostrar loading (evita página en blanco al volver)
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-600 font-medium">Cargando panel...</p>
        </div>
      </div>
    )
  }

  // Si no es admin, mostrar mensaje mientras se redirige
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Redirigiendo...</p>
      </div>
    )
  }

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/productos', label: 'Productos', icon: '📦' },
    { path: '/admin/ordenes', label: 'Órdenes', icon: '📋' },
    { path: '/admin/clientes', label: 'Clientes', icon: '👥' },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header del Admin */}
      <header className="bg-gray-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">🏍️ JASICA - Admin</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="text-gray-300 hover:text-white transition-colors text-sm"
              >
                👁️ Ver Tienda
              </Link>
              <span className="text-gray-400 text-sm">
                {user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors text-sm"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar de Navegación */}
        <aside className="w-64 bg-white shadow-lg min-h-screen">
          <nav className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      location.pathname === item.path
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 mt-8 border-t">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-xs text-blue-600 font-semibold mb-1">Panel de Admin</p>
              <p className="text-xs text-gray-600">
                Gestiona tu tienda desde aquí
              </p>
            </div>
          </div>
        </aside>

        {/* Contenido Principal */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
