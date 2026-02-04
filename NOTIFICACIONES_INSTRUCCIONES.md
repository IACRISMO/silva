# Notificaciones (Admin y Cliente)

## Qué hace

- **Admin**: Cuando un cliente envía la captura de Yape (crea una orden con pago pendiente), al admin le llega una notificación: "Nueva orden con comprobante Yape". Al hacer clic va a Órdenes.
- **Cliente**: Cuando el admin confirma el pago ("Confirmar pago"), al cliente le llega una notificación: "Pago confirmado". Al hacer clic va a su boleta.

Las notificaciones se ven arriba en la barra: icono de campana con número de no leídas. Al hacer clic se abre el listado.

## Configuración en Supabase

1. **Ejecutar el SQL**  
   En **SQL Editor**, ejecuta todo el contenido del archivo **`NOTIFICACIONES.sql`**.

2. **Realtime (opcional)**  
   Para que las notificaciones aparezcan al instante sin recargar:
   - Ve a **Database** → **Publications** (no Replication).
   - Abre la publicación **`supabase_realtime`**.
   - Agrega la tabla **`x`** a la publicación.

Si no activas Realtime, las notificaciones igual se verán al recargar la página, al volver a entrar o al **abrir de nuevo la campana** (se refrescan al abrir el dropdown).

**Si al cliente no le llega "Pago confirmado":**
- La notificación la crea un **trigger en la base de datos** cuando el admin marca el pago como confirmado (no depende del navegador del admin).
- Asegúrate de haber ejecutado **todo** el archivo **NOTIFICACIONES.sql** (incluye el trigger `on_order_payment_confirmed_notify_client`).
- Si ya habías ejecutado NOTIFICACIONES.sql antes, vuelve a ejecutarlo completo para crear el trigger de "pago confirmado" al cliente.
- El cliente debe **abrir la campana** (o recargar) para ver la notificación.
