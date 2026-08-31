# Online Store

Aplicación académica de comercio electrónico construida con Next.js. Permite explorar el catálogo de Fake Store API, usar un carrito persistente, autenticar usuarios con Supabase, completar una compra simulada y administrar pedidos según el rol del usuario.

## Tecnologías

- Next.js 16, React 19 y TypeScript
- Tailwind CSS y shadcn/ui
- Axios y Fake Store API
- Zustand con `localStorage` para el carrito
- Supabase Auth, PostgreSQL y Row Level Security (RLS)
- Vitest

## Requisitos

- Node.js `20.9.0` o posterior
- pnpm `11` o posterior
- Un proyecto de Supabase configurado

## Ejecutar localmente

1. Instala las dependencias:

   ```bash
   pnpm install
   ```

2. Copia `.env.example` como `.env.local` y completa las variables con los valores reales del proyecto de Supabase:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
   ```

3. Aplica las migraciones de `supabase/migrations` en el SQL Editor de Supabase, respetando este orden:

   1. `20260830000000_create_ecommerce_schema.sql`
   2. `20260830010000_create_order_transaction.sql`
   3. `20260830020000_enforce_order_status_transitions.sql`

4. Inicia el entorno de desarrollo:

   ```bash
   pnpm dev
   ```

## Verificaciones

```bash
pnpm lint
pnpm test
pnpm build
pnpm start
```

`pnpm start` sirve la compilación de producción creada previamente con `pnpm build`.

## Despliegue en Vercel

No se necesita un archivo `vercel.json`: Vercel detecta Next.js y el archivo `pnpm-lock.yaml` automáticamente.

1. Sube el proyecto a un repositorio Git e impórtalo en Vercel.
2. Conserva el framework **Next.js** y los comandos detectados por defecto. El proceso instalará dependencias con pnpm y ejecutará `pnpm build`.
3. En **Settings → Environment Variables**, crea las siguientes variables tanto para **Production** como para **Preview**:

   ```text
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
   ```

   Usa los valores reales del mismo proyecto de Supabase. Son variables públicas necesarias para el cliente de Supabase; no agregues nunca una `service_role` key.

4. Después del primer despliegue, en Supabase ve a **Authentication → URL Configuration** y configura la URL del sitio de Vercel. Añade también la siguiente URL de redirección, sustituyendo el dominio por el real:

   ```text
   https://<tu-proyecto>.vercel.app/auth/callback
   ```

   Esto permite confirmar registros por correo y conservar la sesión correctamente en producción.

5. Realiza un nuevo despliegue si cambiaste variables de entorno. Las variables con prefijo `NEXT_PUBLIC_` se incorporan al bundle durante la compilación.

## Comprobación posterior al despliegue

- Navega por catálogo, detalle y carrito sin iniciar sesión.
- Registra una cuenta y confirma el correo si esa opción está habilitada en Supabase.
- Inicia sesión, guarda los datos de entrega y realiza un pago simulado.
- Revisa el pedido en **Mi cuenta**.
- Con una cuenta `admin`, comprueba el panel, los filtros y las transiciones `pending → shipped → delivered`.
- Con una cuenta `customer`, verifica que `/admin` esté bloqueado y que solo pueda ver sus propios pedidos.

## Seguridad

- `.env.local` está excluido de Git; no publiques credenciales reales.
- La clave publicable de Supabase no sustituye las políticas RLS: estas permanecen activas en las tablas.
- La aplicación nunca guarda datos de tarjeta; el pago es únicamente simulado.

## Integración continua

El workflow [ci.yml](.github/workflows/ci.yml) se ejecuta en cada `push` y `pull request`. Instala las dependencias con `pnpm install --frozen-lockfile` y valida, en este orden:

```text
pnpm lint
pnpm test
pnpm build
```

Una ejecución fallida debe corregirse antes de integrar el cambio. Vercel puede continuar desplegando desde Git; la protección obligatoria de la rama se configura en GitHub después de subir este workflow.
