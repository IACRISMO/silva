import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import NotificationBell from './NotificationBell'
import UserMenu from './UserMenu'

export default function Header() {
  const { isAuthenticated, isAdmin } = useAuth()
  const { getItemCount } = useCart()
  const itemCount = getItemCount()

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            🏍️ JASICA
          </Link>

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
              <div className="flex items-center gap-2">
                <NotificationBell isAdmin={isAdmin} variant="light" />
                <UserMenu />
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
