# Pago con Yape (captura del comprobante)

## Flujo

1. **Cliente**: En el checkout sube la **captura del comprobante Yape** (la imagen que muestra Yape después de pagar). El pedido se crea con estado **Pago pendiente de verificación**.
2. **Cliente**: En la boleta ve "Pago pendiente de verificación" y el mensaje de que el admin verificará el pago.
3. **Admin**: En **Admin > Órdenes** ve la lista de pedidos; los que pagan con Yape muestran la **imagen del comprobante** y un botón **Confirmar pago**.
4. **Admin**: Al hacer clic en "Confirmar pago (marcar como pagado)", el pago pasa a **Pagado** y el pedido a **Confirmado**.
5. **Cliente**: Si vuelve a ver la boleta, verá **Pagado**.

## Configuración en Supabase

1. **Ejecutar el SQL**  
   En el **SQL Editor** de Supabase, ejecuta el contenido del archivo `PAGO_YAPE_COMPROBANTE.sql`.

2. **Crear el bucket de comprobantes**  
   - Ve a **Storage** en el panel de Supabase.  
   - Clic en **New bucket**.  
   - Nombre: `payment-proofs`.  
   - Activa **Public bucket** (para que se pueda ver la imagen con la URL pública).  
   - Crea el bucket.

3. **Políticas**  
   Las políticas del script permiten:  
   - Que usuarios autenticados suban archivos al bucket `payment-proofs`.  
   - Que cualquiera pueda leer (ver) las imágenes (para boleta y admin).

## Resumen de cambios en el código

- **Checkout**: Formulario de tarjeta reemplazado por sección "Pago con Yape" + subida de imagen del comprobante.
- **Órdenes**: Nueva columna `payment_proof_url`; órdenes con Yape quedan con `payment_status: pending_verification` hasta que el admin confirme.
- **Admin Órdenes**: Se muestra la captura del comprobante y el botón "Confirmar pago".
- **Boleta**: Muestra "Pago pendiente de verificación" o "Pagado" según el estado.
