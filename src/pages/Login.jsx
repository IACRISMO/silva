import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [needsConfirmation, setNeedsConfirmation] = useState(false)
  const [resendingEmail, setResendingEmail] = useState(false)
  const { login, signup, resendConfirmationEmail } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setNeedsConfirmation(false)
    setLoading(true)

    const result = await login(email, password)
    setLoading(false)

    if (result.success) {
      navigate('/')
    } else {
      setError(result.error || 'Error al iniciar sesión')
      setNeedsConfirmation(result.needsConfirmation || false)
    }
  }

  const handleResendConfirmation = async () => {
    if (!email) {
      setError('Por favor ingresa tu email')
      return
    }

    setResendingEmail(true)
    setError('')
    const result = await resendConfirmationEmail(email.trim().toLowerCase())
    setResendingEmail(false)

    if (result.success) {
      setError('')
      alert('¡Email de confirmación enviado! Por favor revisa tu bandeja de entrada.')
      setNeedsConfirmation(false)
    } else {
      setError(result.error || 'Error al reenviar el email de confirmación')
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')

    // Validar nombre
    if (!name || name.trim().length < 2) {
      setError('El nombre debe tener al menos 2 caracteres')
      return
    }

    // Validar email - formato básico (validación simple, Supabase hará la validación final)
    const trimmedEmail = email.trim().toLowerCase()
    if (!trimmedEmail || trimmedEmail.length === 0) {
      setError('Por favor ingresa un email')
      return
    }

    // Validación básica de formato
    if (!trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setError('Por favor ingresa un email válido (ejemplo: usuario@gmail.com)')
      return
    }

    const emailParts = trimmedEmail.split('@')
    if (emailParts.length !== 2 || emailParts[0].length < 1 || emailParts[1].length < 3) {
      setError('Por favor ingresa un email válido (ejemplo: usuario@gmail.com)')
      return
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setLoading(true)
    // Normalizar el email antes de enviarlo
    const normalizedEmail = email.trim().toLowerCase()
    
    console.log('Intentando crear cuenta con:', { email: normalizedEmail, name })
    
    const result = await signup(normalizedEmail, password, name)
    setLoading(false)

    if (result.success) {
      alert('¡Cuenta creada exitosamente! Ya puedes iniciar sesión.')
      setIsLogin(true)
      setPassword('')
      setConfirmPassword('')
      setEmail('')
      setName('')
      setError('')
    } else {
      // El mensaje de error ya viene mejorado del contexto
      const errorMessage = result.error || 'Error al crear la cuenta. Por favor intenta de nuevo.'
      console.error('Error al crear cuenta:', errorMessage)
      setError(errorMessage)
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Tabs */}
          <div className="flex mb-6 border-b">
            <button
              onClick={() => {
                setIsLogin(true)
                setError('')
                setPassword('')
                setConfirmPassword('')
              }}
              className={`flex-1 py-2 text-center font-semibold transition-colors ${
                isLogin
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => {
                setIsLogin(false)
                setError('')
                setPassword('')
                setConfirmPassword('')
              }}
              className={`flex-1 py-2 text-center font-semibold transition-colors ${
                !isLogin
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Crear Cuenta
            </button>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p>{error}</p>
              {needsConfirmation && (
                <button
                  onClick={handleResendConfirmation}
                  disabled={resendingEmail}
                  className="mt-2 text-sm underline hover:no-underline disabled:opacity-50"
                >
                  {resendingEmail ? 'Enviando...' : 'Reenviar email de confirmación'}
                </button>
              )}
            </div>
          )}

          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <label htmlFor="email-signup" className="block text-gray-700 font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email-signup"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label htmlFor="password-signup" className="block text-gray-700 font-medium mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password-signup"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
                  Confirmar Contraseña
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Confirma tu contraseña"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

