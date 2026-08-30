# Pruebas de RLS

Después de instalar y enlazar Supabase CLI al proyecto, crear pruebas pgTAP para `profiles`, `orders` y `order_items`.

Cada tabla debe comprobar como mínimo que:

- `anon` no puede leer ni escribir.
- Un cliente solo puede leer sus propias filas.
- Un cliente no puede modificar columnas restringidas de su perfil.
- Un cliente no puede leer ni agregar ítems a un pedido ajeno.
- Un administrador puede leer todos los perfiles, pedidos e ítems y avanzar el estado de un pedido.
