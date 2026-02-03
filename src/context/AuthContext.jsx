import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Función para cargar el perfil del usuario
  const loadUserProfile = async (userId) => {
    if (!userId) {
      setUserProfile(null)
      return
    }

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error al cargar perfil:', error)
      }

      setUserProfile(data || { role: 'user' })
    } catch (error) {
      console.error('Error al cargar perfil:', error)
      setUserProfile({ role: 'user' })
    }
  }

  useEffect(() => {
    // Verificar sesión actual
    supabase.auth.getSession()
      .then(async ({ data: { session } }) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          await loadUserProfile(session.user.id)
        }
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error al obtener sesión:', error)
        setLoading(false)
      })

    // Escuchar cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        await loadUserProfile(session.user.id)
      } else {
        setUserProfile(null)
      }
      setLoading(false)
    })

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [])

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        let errorMessage = error.message
        
        // Mejorar mensaje de error para email no confirmado
        if (error.message.includes('not confirmed') || error.message.includes('Email not confirmed')) {
          errorMessage = 'Tu email no ha sido confirmado. Por favor verifica tu correo o solicita un nuevo enlace de confirmación.'
        } else if (error.message.includes('Invalid login')) {
          errorMessage = 'Email o contraseña incorrectos'
        }
        
        return { success: false, error: errorMessage, needsConfirmation: error.message.includes('not confirmed') }
      }

      return { success: true, user: data.user }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const resendConfirmationEmail = async (email) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const signup = async (email, password, name) => {
    try {
      // Limpiar el email de espacios
      const cleanEmail = email.trim().toLowerCase()
      
      // Validaciones adicionales antes de enviar
      if (!cleanEmail || cleanEmail.length < 3) {
        return { success: false, error: 'El email debe tener al menos 3 caracteres' }
      }
      
      if (!password || password.length < 6) {
        return { success: false, error: 'La contraseña debe tener al menos 6 caracteres' }
      }
      
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            name: name || cleanEmail.split('@')[0],
          },
          emailRedirectTo: window.location.origin
        },
      })

      if (error) {
        console.error('Error completo de Supabase:', error)
        
        // Mejorar mensajes de error basados en el código y mensaje
        let errorMessage = error.message || 'Error al crear la cuenta'
        
        // Errores comunes de Supabase
        if (error.status === 400) {
          if (error.message.includes('already registered') || 
              error.message.includes('already exists') || 
              error.message.includes('User already registered')) {
            errorMessage = 'Este email ya está registrado. Intenta iniciar sesión en su lugar.'
          } else if (error.message.includes('invalid') || 
                     error.message.includes('Email') ||
                     error.message.includes('email')) {
            errorMessage = 'El formato del email no es válido. Por favor usa un email válido como: usuario@gmail.com'
          } else if (error.message.includes('password') || 
                     error.message.includes('Password')) {
            errorMessage = 'La contraseña debe tener al menos 6 caracteres y cumplir con los requisitos de seguridad.'
          } else if (error.message.includes('rate limit') || 
                     error.message.includes('too many')) {
            errorMessage = 'Demasiados intentos. Por favor espera unos minutos e intenta de nuevo.'
          } else {
            errorMessage = `Error al crear la cuenta: ${error.message}. Por favor verifica tus datos e intenta de nuevo.`
          }
        } else if (error.status === 422) {
          errorMessage = 'Los datos proporcionados no son válidos. Por favor verifica tu email y contraseña.'
        } else if (error.status === 429) {
          errorMessage = 'Demasiados intentos. Por favor espera unos minutos e intenta de nuevo.'
        }
        
        return { success: false, error: errorMessage }
      }

      // Crear perfil de usuario con rol 'user' por defecto
      if (data.user) {
        try {
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert([
              {
                user_id: data.user.id,
                name: name || cleanEmail.split('@')[0],
                email: cleanEmail,
                role: 'user' // Rol por defecto: usuario normal
              }
            ])

          if (profileError) {
            console.error('Error al crear perfil:', profileError)
            // No fallar el registro si hay error al crear el perfil
            // El trigger debería crearlo automáticamente
          }
        } catch (profileError) {
          console.error('Error al crear perfil:', profileError)
        }
      }

      return { success: true, user: data.user }
    } catch (error) {
      console.error('Error en signup:', error)
      return { success: false, error: error.message || 'Error al crear la cuenta. Por favor intenta de nuevo.' }
    }
  }

  const logout = async () => {
    try {
      console.log('Iniciando logout...')
      
      // Limpiar estado INMEDIATAMENTE (antes de signOut)
      setUser(null)
      setUserProfile(null)
      
      // Limpiar localStorage primero
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('sb-') || key.includes('supabase') || key.includes('auth')) {
          localStorage.removeItem(key)
        }
      })
      
      // Cerrar sesión en Supabase
      try {
        const { error } = await supabase.auth.signOut({ scope: 'global' })
        if (error) {
          console.error('Error al cerrar sesión en Supabase:', error)
        } else {
          console.log('Sesión cerrada exitosamente en Supabase')
        }
      } catch (signOutError) {
        console.error('Error en signOut:', signOutError)
      }
      
      // Forzar limpieza adicional
      setUser(null)
      setUserProfile(null)
      
      // Limpiar localStorage de nuevo por si acaso
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('sb-') || key.includes('supabase') || key.includes('auth')) {
          localStorage.removeItem(key)
        }
      })
      
      console.log('Logout completado - Estado limpiado')
      return { success: true }
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      // Forzar limpieza incluso si hay error
      setUser(null)
      setUserProfile(null)
      
      // Limpiar localStorage de todas formas
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('sb-') || key.includes('supabase') || key.includes('auth')) {
          localStorage.removeItem(key)
        }
      })
      
      return { success: true } // Retornar success para forzar navegación
    }
  }

  const value = {
    user,
    userProfile,
    login,
    signup,
    logout,
    resendConfirmationEmail,
    loading,
    isAuthenticated: !!user,
    isAdmin: userProfile?.role === 'admin'
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

