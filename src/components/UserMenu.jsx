import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function UserMenu() {
  const { user, userProfile, logout, isAdmin } = useAuth()
  const { clearCart } = useCart()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    setOpen(false)
    clearCart()
    await logout()
    window.location.href = '/'
  }

  const displayName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Usuario'

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
        aria-label="Menú de cuenta"
      >
        <span className="text-2xl" aria-hidden>👤</span>
        <span className="text-sm font-medium hidden sm:inline">Hola, {displayName}</span>
        <span className="text-gray-400 text-xs">▼</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-800 truncate">{displayName}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
          <Link
            to="/perfil"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            <span>📋</span>
            Perfil
          </Link>
          <Link
            to="/pedidos"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            <span>📦</span>
            Pedidos
          </Link>
          <Link
            to="/pedidos"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            <span>🧾</span>
            Boletas de pago
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-purple-600 hover:bg-purple-50 border-t border-gray-100"
            >
              <span>⚙️</span>
              Panel Admin
            </Link>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100"
          >
            <span>🚪</span>
            Salir
          </button>
        </div>
      )}
    </div>
  )
}
