import { createClient } from '@supabase/supabase-js'

// Configuración de Supabase - Valores por defecto de tu proyecto
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gmjtfznnwpckqiylrmio.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtanRmem5ud3Bja3FpeWxybWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4MDEyNDUsImV4cCI6MjA4MzM3NzI0NX0.vPBtIC7OR_Y-ILGJ94b8a-nL-VLZHxRfWwUQxVY-Who'

// Validar que la URL sea válida
if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
  console.error('❌ Error: La URL de Supabase no es válida:', supabaseUrl)
  throw new Error('Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL')
}

if (!supabaseAnonKey) {
  console.error('❌ Error: La clave de Supabase no está configurada')
  throw new Error('Invalid supabaseAnonKey: Must be provided')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

console.log('✅ Supabase inicializado correctamente')

