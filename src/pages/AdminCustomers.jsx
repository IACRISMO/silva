import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import { supabase } from '../lib/supabase'

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setCustomers(data || [])
    } catch (error) {
      console.error('Error cargando clientes:', error)
    }
    setLoading(false)
  }

  const updateCustomerRole = async (userId, newRole) => {
    if (!confirm(`¿Seguro que quieres cambiar el rol a ${newRole}?`)) return

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ role: newRole })
        .eq('user_id', userId)

      if (error) throw error
      loadCustomers()
    } catch (error) {
      console.error('Error actualizando rol:', error)
      alert('Error al actualizar el rol')
    }
  }

  const getRoleBadge = (role) => {
    return role === 'admin' ? (
      <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
        👑 Admin
      </span>
    ) : (
      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
        👤 Usuario
      </span>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Clientes</h1>
          <p className="text-gray-600 mt-2">Lista de usuarios registrados</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Lista de Clientes ({customers.length})</h2>
          
          {loading ? (
            <p className="text-gray-500">Cargando clientes...</p>
          ) : customers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No hay clientes registrados</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold">Nombre</th>
                    <th className="text-left py-4 px-4 font-semibold">Email</th>
                    <th className="text-left py-4 px-4 font-semibold">Rol</th>
                    <th className="text-left py-4 px-4 font-semibold">Fecha de Registro</th>
                    <th className="text-left py-4 px-4 font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 font-medium">{customer.name}</td>
                      <td className="py-4 px-4 text-gray-600">{customer.email}</td>
                      <td className="py-4 px-4">{getRoleBadge(customer.role)}</td>
                      <td className="py-4 px-4 text-gray-600">
                        {new Date(customer.created_at).toLocaleDateString('es-CL', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="py-4 px-4">
                        <select
                          value={customer.role}
                          onChange={(e) => updateCustomerRole(customer.user_id, e.target.value)}
                          className="px-4 py-2 border rounded-lg text-sm bg-white hover:bg-gray-50"
                        >
                          <option value="user">Usuario</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-2">💡 Información</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Los usuarios pueden navegar y comprar en la tienda</li>
            <li>• Los admins tienen acceso al panel de administración</li>
            <li>• Puedes cambiar el rol de cualquier usuario desde aquí</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  )
}
