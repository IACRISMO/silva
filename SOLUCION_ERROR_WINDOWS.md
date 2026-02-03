# Solución al Error EPERM en Windows

## El Problema

Windows Defender o tu antivirus está bloqueando los archivos ejecutables de `esbuild.exe` y `rollup`, que son necesarios para ejecutar Vite.

Error típico:
```
Error: spawn EPERM
```

## Soluciones

### Solución 1: Ejecutar PowerShell como Administrador (RECOMENDADO)

1. **Cierra Cursor/Terminal actual**
2. **Abre PowerShell como Administrador:**
   - Presiona `Windows + X`
   - Selecciona "Windows PowerShell (Administrador)" o "Terminal (Administrador)"
3. **Navega a la carpeta del proyecto:**
   ```powershell
   cd C:\Users\elcra\Desktop\26K\silva
   ```
4. **Ejecuta el servidor:**
   ```powershell
   npm run dev
   ```

### Solución 2: Agregar Exclusión en Windows Defender

1. **Abre Windows Security (Seguridad de Windows)**
   - Presiona `Windows + I` para abrir Configuración
   - Ve a "Privacidad y seguridad" → "Seguridad de Windows"
   - Haz clic en "Protección contra virus y amenazas"

2. **Agregar exclusiones:**
   - Desplázate hasta "Configuración de protección contra virus y amenazas"
   - Haz clic en "Administrar configuración"
   - Desplázate hasta "Exclusiones"
   - Haz clic en "Agregar o quitar exclusiones"
   - Haz clic en "+ Agregar una exclusión" → "Carpeta"
   - Selecciona las siguientes carpetas:
     - `C:\Users\elcra\Desktop\26K\silva\node_modules`
     - `C:\Users\elcra\Desktop\26K\silva`

3. **Reinicia el servidor:**
   ```powershell
   npm run dev
   ```

### Solución 3: Limpiar e Instalar de Nuevo

Si ya agregaste las exclusiones:

1. **Cierra TODOS los terminales y editores abiertos**
2. **Abre PowerShell como Administrador**
3. **Navega al proyecto:**
   ```powershell
   cd C:\Users\elcra\Desktop\26K\silva
   ```
4. **Limpia completamente:**
   ```powershell
   Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
   Remove-Item package-lock.json -ErrorAction SilentlyContinue
   ```
5. **Reinstala:**
   ```powershell
   npm install
   ```
6. **Ejecuta el servidor:**
   ```powershell
   npm run dev
   ```

### Solución 4: Usar CMD en lugar de PowerShell

A veces CMD funciona mejor:

1. **Abre CMD como Administrador:**
   - Presiona `Windows + X`
   - Selecciona "Símbolo del sistema (Administrador)"
2. **Navega y ejecuta:**
   ```cmd
   cd C:\Users\elcra\Desktop\26K\silva
   npm run dev
   ```

### Solución 5: Deshabilitar Antivirus Temporalmente (Última opción)

⚠️ **Solo si las soluciones anteriores no funcionan:**

1. Deshabilita temporalmente Windows Defender o tu antivirus
2. Ejecuta:
   ```powershell
   cd C:\Users\elcra\Desktop\26K\silva
   npm run dev
   ```
3. Una vez que funcione, vuelve a habilitar el antivirus
4. Luego usa la Solución 2 para agregar exclusiones permanentes

## Una vez que el servidor funcione

Deberías ver algo como:

```
VITE v5.x.x  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: http://192.168.x.x:5173/
```

Entonces podrás:
1. Abrir http://localhost:5173 en tu navegador
2. Registrarte como usuario
3. Convertirte en admin siguiendo el archivo `COMO_SER_ADMIN.md`
4. Acceder al panel de admin y agregar productos

## Verificar que todo funciona

Después de iniciar el servidor, verifica:

```powershell
# En otra terminal (también como administrador si es necesario)
curl http://localhost:5173
```

Si ves código HTML, el servidor está funcionando correctamente.

---

**Nota**: Este problema es común en Windows debido a las políticas de seguridad. Una vez que agregues las exclusiones, no debería volver a ocurrir.
