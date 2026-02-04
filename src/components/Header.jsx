import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Header() {
  const { user, userProfile, logout, isAuthenticated, isAdmin } = useAuth()
  const { getItemCount, clearCart } = useCart()
  const navigate = useNavigate()
  const itemCount = getItemCount()

  const handleLogout = async (e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    console.log('Click en Salir - Iniciando logout...')
    
    // Limpiar el carrito primero
    clearCart()
    
    // Cerrar sesión (no esperar, hacerlo de forma síncrona)
    logout().then(() => {
      console.log('Logout completado, recargando página...')
      // Recargar la página directamente
      window.location.href = '/'
    }).catch((error) => {
      console.error('Error al cerrar sesión:', error)
      // Forzar recarga incluso si hay error
      window.location.href = '/'
    })
    
    // También forzar recarga después de un pequeño delay por si acaso
    setTimeout(() => {
      window.location.href = '/'
    }, 500)
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            🏍️ JASICA
          </Link>
          {/* Tienda JASICA - Cascos de motos */}
          
          <div className="flex items-center gap-4">
            <Link
              to="/productos"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Productos
            </Link>
            
            <Link
              to="/carrito"
              className="relative text-gray-700 hover:text-blue-600 transition-colors"
            >
              🛒 Carrito
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  Hola, {user.user_metadata?.name || user.email?.split('@')[0] || 'Usuario'}
                </span>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-semibold flex items-center gap-2"
                  >
                    ⚙️ Panel Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
                >
                  Salir
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}

