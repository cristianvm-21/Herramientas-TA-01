# Verificación manual de administración y RLS

Usa una cuenta `customer` y una cuenta `admin` en navegadores o perfiles distintos.

1. Con el cliente, visita `/admin`, `/admin/orders` y `/admin/users`. Debe redirigirse al inicio y no ver datos administrativos.
2. Con el cliente, intenta abrir el detalle de un pedido que pertenezca a otra cuenta. Debe recibir `404` o no obtener datos.
3. Con el administrador, abre `/admin` y verifica métricas, pedidos y usuarios.
4. Cambia un pedido de `pending` a `shipped` y luego a `delivered` desde `/admin/orders`.
5. En el SQL Editor, intenta actualizar un pedido `delivered` hacia `pending` o saltar `pending` a `delivered`. El trigger de la migración debe rechazarlo.

Ejecuta primero `supabase/migrations/20260830020000_enforce_order_status_transitions.sql` en Supabase antes de realizar los pasos 4 y 5.
