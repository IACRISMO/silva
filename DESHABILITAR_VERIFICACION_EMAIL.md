# 🔧 Deshabilitar Verificación de Email en Supabase

Si estás teniendo problemas al crear cuentas porque Supabase rechaza emails válidos, puedes deshabilitar la verificación de email.

## Pasos para Deshabilitar Verificación de Email

1. **Ve a tu proyecto en Supabase**
   - Abre https://supabase.com/dashboard
   - Selecciona tu proyecto

2. **Ve a Authentication Settings**
   - En el menú lateral, haz clic en **"Authentication"**
   - Luego haz clic en **"Settings"** (o "Configuración")

3. **Deshabilita la verificación de email**
   - Busca la sección **"Email Auth"** o **"Email Authentication"**
   - Desmarca la opción **"Enable email confirmations"** o **"Confirm email"**
   - O busca **"Email confirmation"** y desactívala

4. **Guarda los cambios**
   - Haz clic en **"Save"** o **"Guardar"**

## Alternativa: Usar Dominios Permitidos

Si prefieres mantener la verificación pero permitir ciertos dominios:

1. Ve a **Authentication** → **Settings**
2. Busca **"Email Domains"** o **"Allowed Email Domains"**
3. Agrega los dominios que quieres permitir (ejemplo: `gmail.com`, `hotmail.com`, `email.com`)

## Nota Importante

Deshabilitar la verificación de email hace que las cuentas se activen automáticamente sin necesidad de verificar el email. Esto es útil para desarrollo, pero en producción deberías mantenerla activada por seguridad.

## Después de Deshabilitar

1. **Recarga la página** de tu aplicación
2. **Intenta crear la cuenta de nuevo**
3. Debería funcionar sin problemas

## Si el Problema Persiste

Si después de deshabilitar la verificación sigue fallando, el problema podría ser:

1. **Configuración de Supabase Auth**: Revisa que no haya restricciones adicionales
2. **Dominio del email**: Algunos dominios como `email.com` podrían estar bloqueados
3. **Prueba con un email de Gmail o Hotmail** para verificar


