import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  getNotifications,
  markNotificationAsRead,
  markAllAsRead,
  subscribeToNotifications
} from '../services/notificationsService'

export default function NotificationBell({ isAdmin = false, variant = 'light' }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef(null)
  const isDark = variant === 'dark'

  const unreadCount = notifications.filter((n) => !n.read).length

  const load = async () => {
    if (!user?.id) return
    setLoading(true)
    const { data } = await getNotifications(user.id)
    setNotifications(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    if (!user?.id) return
    load()
    const unsubscribe = subscribeToNotifications(user.id, () => load())
    return unsubscribe
  }, [user?.id])

  // Al abrir el dropdown, refrescar notificaciones para ver las más recientes
  useEffect(() => {
    if (open && user?.id) load()
  }, [open])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const handleClickNotification = async (n) => {
    await markNotificationAsRead(n.id)
    setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)))
    setOpen(false)
    if (n.type === 'payment_confirmed' && n.order_id) {
      navigate(`/boleta/${n.order_id}`, { replace: false })
    }
    if (n.type === 'new_order_pending' && isAdmin) {
      navigate('/admin/ordenes', { replace: false })
    }
  }

  const handleMarkAllRead = async () => {
    if (!user?.id) return
    await markAllAsRead(user.id)
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  if (!user) return null

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`relative p-2 rounded-lg transition-colors ${
          isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-gray-700'
        }`}
        aria-label="Notificaciones"
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-hidden bg-white rounded-xl shadow-xl border border-gray-200 z-50">
          <div className="p-3 border-b border-gray-100 flex items-center justify-between">
            <span className="font-semibold text-gray-800">Notificaciones</span>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-xs text-blue-600 hover:underline"
              >
                Marcar todas leídas
              </button>
            )}
          </div>
          <div className="max-h-72 overflow-y-auto">
            {loading ? (
              <p className="p-4 text-gray-500 text-sm">Cargando...</p>
            ) : notifications.length === 0 ? (
              <p className="p-4 text-gray-500 text-sm">No hay notificaciones</p>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => handleClickNotification(n)}
                  className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                    !n.read ? 'bg-blue-50/50' : ''
                  }`}
                >
                  <p className="font-medium text-gray-800 text-sm">{n.title}</p>
                  {n.message && (
                    <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{n.message}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(n.created_at).toLocaleDateString('es-PE', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
