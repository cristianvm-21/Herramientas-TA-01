<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN: context-proyect-->
# AGENTS.md

## 1. Proyecto

Desarrollar una aplicación web de e-commerce llamada **Online Store**.

La aplicación permitirá:

* Visualizar productos.
* Consultar el detalle de cada producto.
* Filtrar productos por categoría.
* Agregar productos al carrito.
* Modificar cantidades del carrito.
* Eliminar productos del carrito.
* Registrarse e iniciar sesión.
* Gestionar los datos personales del usuario.
* Realizar un checkout.
* Simular un pago mediante tarjeta.
* Registrar pedidos.
* Consultar el estado de los pedidos.
* Administrar pedidos desde un panel administrativo.
* Consultar usuarios desde el panel administrativo.

El proyecto será posteriormente utilizado para implementar y demostrar un flujo de **CI/CD mediante GitHub Actions y Vercel**.

El objetivo es mantener una arquitectura clara, sencilla y adecuada para un proyecto académico.

---

# 2. Stack tecnológico

Utilizar obligatoriamente:

* Next.js
* App Router
* TypeScript
* Tailwind CSS
* shadcn/ui
* Lucide React
* Axios
* Zustand
* Supabase
* pnpm
* Fake Store API
* Vercel

Para testing utilizar:

* Vitest

Para formularios y validación se puede utilizar:

* React Hook Form
* Zod

No utilizar inicialmente:

* Express
* Backend independiente
* Redux
* Docker
* Kubernetes
* Microservicios
* Stripe
* Culqi
* Mercado Pago
* PayPal
* Pasarelas de pago reales

---

# 3. Principios generales

Priorizar siempre:

1. Simplicidad.
2. Código fácil de entender.
3. TypeScript estricto.
4. Componentes reutilizables.
5. Separación entre interfaz y acceso a datos.
6. Seguridad.
7. Buen manejo de errores.
8. Facilidad para realizar pruebas automatizadas.
9. Compatibilidad con CI/CD.
10. Evitar sobrearquitectura.

No introducir tecnologías adicionales si no aportan una ventaja clara.

---

# 4. Gestor de paquetes

Utilizar exclusivamente:

```bash
pnpm
```

No utilizar:

```bash
npm
yarn
bun
```

Los comandos principales del proyecto deberán ser:

```bash
pnpm dev
pnpm lint
pnpm test
pnpm build
```

---

# 5. Configuración global del sitio

Crear en la raíz del proyecto:

```text
site.config.mjs
```

Centralizar allí los textos generales de la aplicación.

Utilizar una estructura similar a:

```javascript
const name = "Online Store";

const siteConfig = {
  name,
  title: name,
  description: "Tienda online de productos",
  footerText: `© 2026 ${name}. Todos los derechos reservados.`,
};

export default siteConfig;
```

Importar esta configuración donde sea necesaria.

Ejemplo:

```javascript
import siteConfig from "@/site.config.mjs";
```

Utilizar:

```javascript
siteConfig.name
siteConfig.title
siteConfig.description
siteConfig.footerText
```

No escribir directamente `"Online Store"` repetidamente dentro de los componentes.

Utilizar la configuración en elementos como:

* Navbar.
* Footer.
* Metadata.
* Página principal.
* Login.
* Registro.
* Panel de usuario.
* Panel administrativo.
* Confirmación de pedido.

El objetivo es permitir cambiar posteriormente la identidad textual del proyecto desde un único archivo.

---

# 6. Identidad visual

La aplicación debe tener una apariencia:

* Moderna.
* Minimalista.
* Profesional.
* Limpia.
* Adecuada para un e-commerce general.

Utilizar como base la siguiente paleta:

```text
Primary:        #4F46E5
Primary Hover:  #4338CA

Background:     #FFFFFF
Surface:        #F8FAFC

Text:           #0F172A
Muted Text:     #64748B

Border:         #E2E8F0

Success:        #16A34A
Warning:        #D97706
Danger:         #DC2626
```

Integrar estos colores mediante variables semánticas compatibles con Tailwind CSS y shadcn/ui.

Evitar repetir colores hexadecimales directamente dentro de múltiples componentes.

---

# 7. Diseño

Aplicar:

* Responsive design.
* Navbar limpia.
* Navbar sticky cuando sea conveniente.
* Cards de productos consistentes.
* Bordes suaves.
* Sombras discretas.
* Espaciado uniforme.
* Jerarquía visual clara.
* Botones principales sólidos.
* Estados hover discretos.
* Interfaces fáciles de entender.

Evitar:

* Gradientes innecesarios.
* Animaciones excesivas.
* Sombras fuertes.
* Elementos excesivamente redondeados.
* Decoración innecesaria.
* Colores saturados sin función.

---

# 8. Iconografía

Utilizar exclusivamente:

```text
Lucide React
```

Utilizar iconos para elementos como:

* Inicio.
* Productos.
* Carrito.
* Usuario.
* Pedidos.
* Búsqueda.
* Categorías.
* Administración.
* Editar.
* Eliminar.
* Configuración.
* Cerrar sesión.

Evitar mezclar varias librerías de iconos.

---

# 9. Arquitectura general

La arquitectura será:

```text
                  Fake Store API
                        │
                      Axios
                        │
                        ▼
                ┌──────────────┐
                │   Next.js    │
                │              │
                │   Catálogo   │
                │   Carrito    │
                │   Checkout   │
                │   Account    │
                │   Admin      │
                └──────┬───────┘
                       │
             ┌─────────┴──────────┐
             │                    │
             ▼                    ▼
      Zustand + localStorage    Supabase
                               │
                               ├── Auth
                               ├── Profiles
                               ├── Orders
                               └── Order Items
```

---

# 10. Fake Store API

Los productos deberán provenir siempre de:

```text
Fake Store API
```

Fake Store API será la fuente del catálogo.

Obtener desde esta API:

* Productos.
* Producto individual.
* Categorías.
* Nombre.
* Descripción.
* Imagen.
* Precio.
* Rating.

No copiar inicialmente el catálogo completo a Supabase.

---

# 11. Axios

Utilizar Axios para consumir Fake Store API.

Centralizar la configuración.

Estructura sugerida:

```text
lib/
└── api/
    ├── axios.ts
    └── products.ts
```

Crear una instancia reutilizable:

```typescript
const api = axios.create({
  baseURL: "...",
});
```

Crear funciones como:

```typescript
getProducts()
getProductById()
getCategories()
getProductsByCategory()
```

No realizar peticiones Axios directamente dentro de componentes cuando puedan encapsularse en funciones reutilizables.

Los componentes visuales no deben contener lógica innecesaria relacionada con URLs o configuración HTTP.

---

# 12. Productos

Crear:

```text
/products
```

Mostrar los productos obtenidos desde Fake Store API.

Cada producto debe mostrar como mínimo:

* Imagen.
* Nombre.
* Precio.
* Categoría.
* Rating.
* Botón para ver detalle.
* Botón para agregar al carrito.

Implementar:

* Loading state.
* Error state.
* Empty state.
* Filtro por categoría.

La búsqueda por nombre puede implementarse si no aumenta demasiado la complejidad.

---

# 13. Detalle de producto

Crear:

```text
/products/[id]
```

Mostrar:

* Imagen.
* Nombre.
* Descripción.
* Categoría.
* Precio.
* Rating.
* Selector de cantidad.
* Botón para agregar al carrito.

Manejar correctamente:

* Producto inexistente.
* Error de API.
* Estado de carga cuando corresponda.

---

# 14. Carrito

El carrito NO se almacenará en Supabase.

Utilizar:

```text
Zustand
+
localStorage
```

Crear:

```text
stores/cart-store.ts
```

Cada elemento deberá incluir como mínimo:

```typescript
type CartItem = {
  productId: number;
  title: string;
  image: string;
  price: number;
  quantity: number;
};
```

El store deberá manejar:

```typescript
items
addItem()
removeItem()
increaseQuantity()
decreaseQuantity()
clearCart()
```

También debe ser posible obtener:

* Cantidad total de unidades.
* Subtotal por producto.
* Total del carrito.

---

# 15. Reglas del carrito

El carrito deberá:

* Persistir después de recargar la página.
* Funcionar sin iniciar sesión.
* Permitir agregar productos.
* Permitir eliminar productos.
* Incrementar cantidades.
* Disminuir cantidades.
* Vaciarse completamente.

Si el usuario agrega nuevamente un producto que ya existe:

```text
NO crear otra fila independiente.
```

Incrementar su cantidad.

No permitir cantidades menores a:

```text
1
```

---

# 16. Autenticación

Utilizar:

```text
Supabase Auth
```

Autenticación mediante:

* Email.
* Contraseña.

Implementar:

```text
/login
/register
```

Permitir:

* Registro.
* Inicio de sesión.
* Cierre de sesión.
* Persistencia de sesión.

No implementar OAuth inicialmente.

---

# 17. Restricción para comprar

Un usuario sin iniciar sesión podrá:

* Navegar por la tienda.
* Ver productos.
* Consultar detalles.
* Agregar productos al carrito.
* Modificar el carrito.

Sin embargo:

> El usuario deberá iniciar sesión obligatoriamente antes de realizar una compra.

Si intenta acceder a:

```text
/checkout
```

sin autenticación, deberá ser redirigido al login.

El carrito almacenado en `localStorage` deberá conservarse después del inicio de sesión.

---

# 18. Roles

El sistema tendrá dos roles:

```typescript
type UserRole = "customer" | "admin";
```

Todo usuario registrado deberá recibir automáticamente:

```text
customer
```

El rol:

```text
admin
```

deberá asignarse mediante un procedimiento seguro.

Nunca permitir que un usuario cambie su propio rol desde el navegador.

---

# 19. Supabase

Utilizar Supabase para:

* Autenticación.
* Perfiles.
* Roles.
* Información personal.
* Pedidos.
* Productos asociados a pedidos.
* Estados de pedido.
* Información de entrega.

No utilizar Supabase para almacenar:

* Catálogo principal de Fake Store API.
* Carrito.
* Datos completos de tarjetas.

---

# 20. Perfil de usuario

Crear una tabla:

```text
profiles
```

Campos sugeridos:

```text
id
email
role
full_name
dni
department
province
district
address
created_at
updated_at
```

El campo:

```text
id
```

debe corresponder al usuario de Supabase Auth.

---

# 21. Panel del usuario

Crear:

```text
/account
```

Debe ser una sección protegida.

Dentro del panel incluir como mínimo:

```text
/account/profile
/account/orders
```

---

# 22. Perfil del usuario

En:

```text
/account/profile
```

el usuario podrá consultar y modificar:

* Nombre completo.
* DNI.
* Departamento.
* Provincia.
* Distrito.
* Dirección.

No permitir modificar directamente:

* ID.
* Rol.

El email puede mostrarse como información de cuenta.

---

# 23. Pedidos del usuario

Crear:

```text
/account/orders
```

Mostrar únicamente los pedidos pertenecientes al usuario autenticado.

Cada pedido deberá mostrar como mínimo:

* Número o ID.
* Fecha.
* Total.
* Estado.
* Dirección de entrega.

---

# 24. Estados de pedido

Utilizar únicamente:

```typescript
type OrderStatus =
  | "pending"
  | "shipped"
  | "delivered";
```

Representación en español:

```text
pending   → Pendiente
shipped   → Enviado
delivered → Entregado
```

Colores:

```text
Pendiente  → ámbar
Enviado    → azul
Entregado  → verde
```

Utilizar preferentemente:

```text
Badge
```

de shadcn/ui.

---

# 25. Detalle del pedido

Crear:

```text
/account/orders/[id]
```

Mostrar:

* ID del pedido.
* Fecha.
* Estado.
* Productos.
* Imagen del producto.
* Cantidad.
* Precio unitario.
* Subtotal.
* Total.
* Información de entrega.

El usuario solamente podrá consultar sus propios pedidos.

---

# 26. Checkout

Crear:

```text
/checkout
```

La página debe requerir autenticación.

Mostrar:

## Productos

* Imagen.
* Nombre.
* Cantidad.
* Precio.
* Subtotal.

## Información de entrega

Utilizar como valores iniciales los datos del perfil:

* Nombre.
* Departamento.
* Provincia.
* Distrito.
* Dirección.

Permitir revisar los datos antes de completar el pedido.

## Resumen

Mostrar:

```text
Subtotal
Total
```

No implementar inicialmente:

* Cupones.
* Sistemas de puntos.
* Impuestos complejos.
* Costos dinámicos de envío.

---

# 27. Pago

Implementar únicamente:

```text
Pago simulado con tarjeta
```

No utilizar ninguna pasarela de pago real.

Solicitar visualmente:

* Nombre del titular.
* Número de tarjeta.
* Fecha de vencimiento.
* CVV.

Los datos serán utilizados únicamente para simular la interfaz.

---

# 28. Seguridad del pago simulado

Nunca almacenar en Supabase:

* Número completo de tarjeta.
* CVV.
* Fecha de vencimiento.

No registrar estos datos en logs.

No guardar estos datos en:

* localStorage.
* sessionStorage.
* Base de datos.

Al confirmar:

1. Validar los campos.
2. Mostrar un pequeño estado de procesamiento.
3. Simular un pago exitoso.
4. Crear el pedido.
5. Registrar `order_items`.
6. Vaciar el carrito.
7. Mostrar confirmación.

---

# 29. Creación del pedido

Cuando se confirme la compra:

1. Verificar que exista sesión.
2. Verificar que exista al menos un producto.
3. Obtener los datos de envío.
4. Calcular el total.
5. Crear el pedido.
6. Crear los `order_items`.
7. Asignar estado inicial:

```text
pending
```

8. Vaciar el carrito solamente si el pedido fue creado correctamente.
9. Redirigir a una pantalla de confirmación.

---

# 30. Tabla orders

Crear una tabla con una estructura similar a:

```text
orders
```

Campos:

```text
id
user_id
status
total
shipping_name
shipping_department
shipping_province
shipping_district
shipping_address
created_at
updated_at
```

Estado inicial:

```text
pending
```

---

# 31. Tabla order_items

Crear:

```text
order_items
```

Campos sugeridos:

```text
id
order_id
product_id
product_name
product_image
unit_price
quantity
subtotal
created_at
```

Aunque los productos provengan de Fake Store API, almacenar en el pedido:

* Nombre.
* Imagen.
* Precio unitario.

Esto permitirá conservar el historial aunque Fake Store API cambie posteriormente.

---

# 32. Panel administrativo

Crear:

```text
/admin
```

Solo debe ser accesible para usuarios:

```text
role === "admin"
```

El panel administrativo debe mantener la misma identidad visual que la tienda.

Puede utilizar:

```text
Sidebar + contenido principal
```

---

# 33. Dashboard administrativo

En:

```text
/admin
```

mostrar información sencilla como:

* Total de pedidos.
* Pedidos pendientes.
* Pedidos enviados.
* Pedidos entregados.
* Total de usuarios registrados.

No implementar inicialmente gráficos complejos.

---

# 34. Administración de pedidos

Crear:

```text
/admin/orders
```

Mostrar todos los pedidos.

Permitir filtrar por:

* Pendiente.
* Enviado.
* Entregado.

Permitir cambiar estados siguiendo:

```text
Pendiente
   ↓
Enviado
   ↓
Entregado
```

Evitar cambios arbitrarios hacia atrás inicialmente.

Por ejemplo, no permitir:

```text
Entregado → Pendiente
```

---

# 35. Administración de usuarios

Crear:

```text
/admin/users
```

Mostrar:

* Nombre.
* Email.
* DNI.
* Fecha de registro.
* Rol.

En la primera versión, permitir principalmente:

* Visualizar usuarios.
* Consultar información.

No implementar inicialmente:

* Eliminación de cuentas.
* Cambio arbitrario de contraseñas.
* Edición directa de autenticación.

Las operaciones administrativas sobre Supabase Auth que requieran privilegios elevados deberán realizarse exclusivamente desde código seguro ejecutado en servidor.

Nunca exponer:

```text
service_role_key
```

al navegador.

---

# 36. Seguridad y autorización

No considerar una página protegida únicamente porque el botón no aparece en la interfaz.

La autorización debe validarse realmente.

Un usuario normal no debe poder acceder a:

```text
/admin
/admin/orders
/admin/users
```

aunque escriba manualmente la URL.

---

# 37. Row Level Security

Activar RLS en las tablas correspondientes.

Un usuario normal podrá:

* Leer su propio perfil.
* Actualizar su propio perfil.
* Crear pedidos asociados a su cuenta.
* Leer sus propios pedidos.
* Leer los `order_items` asociados a sus pedidos.

Un administrador podrá:

* Consultar perfiles.
* Consultar todos los pedidos.
* Consultar `order_items`.
* Actualizar estados de pedidos.

No confiar exclusivamente en validaciones de frontend.

---

# 38. Supabase Client y Server

Separar correctamente las operaciones de Supabase destinadas al cliente y al servidor.

Estructura sugerida:

```text
lib/
└── supabase/
    ├── client.ts
    └── server.ts
```

No exponer secretos de servidor en componentes cliente.

---

# 39. Variables de entorno

Utilizar variables de entorno para configuración sensible.

Por ejemplo:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Utilizar los nombres actuales recomendados por la versión instalada de Supabase si estos hubieran cambiado.

No subir:

```text
.env
.env.local
```

al repositorio.

Crear:

```text
.env.example
```

sin credenciales reales.

---

# 40. TypeScript

Utilizar TypeScript estricto.

Evitar:

```typescript
any
```

salvo que sea estrictamente necesario y esté justificado.

Definir como mínimo:

```typescript
Product
CartItem
Profile
Order
OrderItem
OrderStatus
UserRole
```

Mantener los tipos compartidos en:

```text
types/
```

---

# 41. Estructura sugerida

Utilizar como referencia:

```text
app/
├── page.tsx
│
├── products/
│   ├── page.tsx
│   └── [id]/
│       └── page.tsx
│
├── cart/
│   └── page.tsx
│
├── checkout/
│   └── page.tsx
│
├── login/
│   └── page.tsx
│
├── register/
│   └── page.tsx
│
├── account/
│   ├── page.tsx
│   ├── profile/
│   │   └── page.tsx
│   └── orders/
│       ├── page.tsx
│       └── [id]/
│           └── page.tsx
│
└── admin/
    ├── page.tsx
    ├── orders/
    │   └── page.tsx
    └── users/
        └── page.tsx

components/
├── ui/
├── layout/
├── products/
├── cart/
├── checkout/
├── account/
└── admin/

lib/
├── api/
│   ├── axios.ts
│   └── products.ts
│
├── supabase/
│   ├── client.ts
│   └── server.ts
│
└── utils/

stores/
└── cart-store.ts

types/
├── product.ts
├── cart.ts
├── profile.ts
└── order.ts

site.config.mjs
```

Esta estructura puede cambiar si existe una razón técnica clara.

No reorganizar carpetas innecesariamente.

---

# 42. Componentes shadcn/ui

Utilizar componentes de shadcn/ui cuando aporten utilidad.

Componentes recomendados:

```text
Button
Card
Input
Label
Select
Table
Badge
Sheet
Dialog
DropdownMenu
Avatar
Separator
Skeleton
Alert
Form
```

No instalar componentes que no se vayan a utilizar.

---

# 43. Formularios

Utilizar una estrategia consistente.

Preferentemente:

```text
React Hook Form
+
Zod
```

para formularios con validaciones relevantes.

Aplicar especialmente en:

* Registro.
* Inicio de sesión.
* Perfil.
* Checkout.
* Pago simulado.

Mostrar errores de validación cerca del campo correspondiente.

---

# 44. Manejo de estados

Todas las funcionalidades que consulten información externa deberán manejar cuando corresponda:

```text
Loading
Success
Empty
Error
```

Ejemplos:

```text
Cargando productos...
No hay productos disponibles.
No se pudo cargar el catálogo.
No se encontraron pedidos.
No se pudo guardar el perfil.
```

No dejar errores sin tratamiento cuando puedan mostrarse al usuario de manera clara.

---

# 45. Manejo de errores de API

Manejar correctamente:

* Fake Store API no disponible.
* Producto inexistente.
* Timeout.
* Respuesta inesperada.
* Error de autenticación.
* Error al crear pedido.
* Error al actualizar perfil.
* Error al cambiar estado de pedido.
* Acceso no autorizado.

No mostrar errores internos sensibles directamente al usuario.

---

# 46. Testing

Utilizar:

```text
Vitest
```

Crear pruebas automatizadas principalmente para lógica de negocio.

Como mínimo probar:

* Cálculo del total del carrito.
* Incremento de cantidad.
* Disminución de cantidad.
* Eliminación de productos.
* Comportamiento al agregar un producto ya existente.
* Validación de carrito vacío.
* Validaciones principales del checkout.
* Transiciones válidas de estados de pedido.

Evitar pruebas excesivamente complejas para esta primera versión.

---

# 47. CI/CD

El proyecto debe quedar preparado para implementar posteriormente un workflow de:

```text
GitHub Actions
```

Flujo conceptual:

```text
Developer
    ↓
git push / pull request
    ↓
GitHub
    ↓
GitHub Actions
    ↓
pnpm install
    ↓
pnpm lint
    ↓
pnpm test
    ↓
pnpm build
    ↓
Vercel
    ↓
Deployment
```

Una falla en:

```text
Lint
Tests
Build
```

debe impedir que el flujo de validación se considere exitoso.

No implementar Docker por ahora.

---

# 48. Vercel

El destino de despliegue será:

```text
Vercel
```

El proyecto deberá poder compilar correctamente con:

```bash
pnpm build
```

No depender de configuraciones locales que no puedan reproducirse en Vercel.

Las variables de entorno necesarias deberán configurarse posteriormente también en Vercel.

---

# 49. Git

No subir al repositorio:

```text
node_modules
.next
.env
.env.local
```

Mantener un `.gitignore` adecuado para Next.js.

No guardar secretos dentro del código.

---

# 50. Orden de implementación

No desarrollar toda la aplicación simultáneamente.

Trabajar por fases.

## Fase 1

Inicialización del proyecto.

Configurar:

* Next.js.
* TypeScript.
* Tailwind CSS.
* shadcn/ui.
* Lucide React.
* pnpm.
* `site.config.mjs`.

## Fase 2

Crear:

* Estructura principal.
* Layout.
* Navbar.
* Footer.
* Identidad visual.

## Fase 3

Configurar:

* Axios.
* Tipos de producto.
* Fake Store API.

## Fase 4

Desarrollar:

* Catálogo.
* Cards.
* Categorías.
* Detalle de producto.

## Fase 5

Configurar:

* Zustand.
* localStorage.
* Carrito.

## Fase 6

Configurar:

* Supabase.
* Variables de entorno.
* Clientes de Supabase.

## Fase 7

Implementar:

* Registro.
* Login.
* Logout.
* Sesión.

## Fase 8

Crear:

* Tabla `profiles`.
* Perfil del usuario.
* Edición de datos.

## Fase 9

Implementar:

* Checkout.
* Datos de entrega.
* Validaciones.

## Fase 10

Implementar:

* Interfaz de tarjeta.
* Pago simulado.

## Fase 11

Crear:

* `orders`.
* `order_items`.
* Registro de compra.

## Fase 12

Implementar:

* Historial de pedidos.
* Detalle de pedido.
* Estados.

## Fase 13

Configurar:

* Roles.
* RLS.
* Protección de rutas.

## Fase 14

Crear:

* Dashboard administrativo.
* Administración de pedidos.
* Visualización de usuarios.

## Fase 15

Implementar:

* Pruebas con Vitest.

## Fase 16

Preparar:

* Vercel.
* Variables de entorno.
* Build de producción.

## Fase 17

Implementar posteriormente:

* GitHub Actions.
* Flujo CI/CD.

---

# 51. Forma de trabajo del agente

No implementar todo el proyecto de una sola vez.

Antes de trabajar en una fase:

1. Revisar el estado actual del proyecto.
2. Identificar los archivos relevantes.
3. Explicar brevemente qué se implementará.
4. Indicar qué archivos se crearán o modificarán.
5. Implementar únicamente lo necesario para esa fase.
6. Ejecutar las verificaciones disponibles.
7. Corregir errores antes de continuar.

Después de cada fase:

1. Resumir brevemente lo implementado.
2. Indicar los archivos principales modificados.
3. Informar cualquier decisión técnica relevante.
4. Indicar cuál sería la siguiente fase.

No avanzar automáticamente a varias fases si no es necesario.

---

# 52. Verificaciones

Después de cambios relevantes ejecutar cuando corresponda:

```bash
pnpm lint
```

y:

```bash
pnpm test
```

Antes de considerar una fase importante terminada ejecutar:

```bash
pnpm build
```

No ignorar errores de:

* TypeScript.
* ESLint.
* Testing.
* Build.

Corregirlos antes de considerar el trabajo terminado.

---

# 53. Dependencias

Antes de instalar una dependencia nueva:

1. Verificar si el proyecto ya dispone de una solución equivalente.
2. Determinar si realmente es necesaria.
3. Preferir dependencias conocidas y mantenidas.
4. Evitar instalar librerías para funcionalidades triviales.

No agregar paquetes simplemente por conveniencia si pueden resolverse claramente con las herramientas existentes.

---

# 54. Código

Mantener:

* Funciones pequeñas.
* Nombres descriptivos.
* Componentes enfocados.
* Tipos claros.
* Imports ordenados.
* Separación entre lógica y presentación.

Evitar:

* Componentes gigantes.
* Código duplicado.
* Valores mágicos repetidos.
* URLs repetidas.
* Colores repetidos directamente.
* Nombres ambiguos.
* Comentarios que simplemente describan lo obvio.

---

# 55. Server Components y Client Components

Utilizar Server Components de Next.js cuando sean adecuados.

Agregar:

```typescript
"use client";
```

únicamente cuando el componente realmente necesite funcionalidades del cliente, como:

* Hooks.
* Eventos.
* Zustand.
* localStorage.
* Interacciones del usuario.
* APIs exclusivas del navegador.

No convertir indiscriminadamente toda la aplicación en Client Components.

---

# 56. Acceso a datos

Separar claramente:

```text
UI
↓
Funciones / servicios
↓
Fuente de datos
```

Para productos:

```text
UI
↓
lib/api/products.ts
↓
Axios
↓
Fake Store API
```

Para información persistente:

```text
UI / servidor
↓
Supabase
```

No mezclar URLs, lógica SQL y presentación dentro del mismo componente salvo casos triviales.

---

# 57. Seguridad

Priorizar especialmente:

* RLS.
* Protección de rutas.
* Separación cliente/servidor.
* Variables de entorno.
* Roles.
* No exponer service role.
* No guardar datos de tarjetas.
* No confiar únicamente en validaciones de frontend.

Nunca utilizar una clave administrativa de Supabase dentro de un Client Component.

---

# 58. Alcance

Este proyecto es principalmente académico.

No implementar inicialmente funcionalidades propias de un e-commerce comercial complejo, como:

* Inventario real.
* Facturación electrónica.
* Integración bancaria.
* Tracking de empresas de transporte.
* Notificaciones SMS.
* Chat.
* Marketplace multi-vendedor.
* Cupones.
* Programa de puntos.
* Recomendaciones con IA.
* Integraciones ERP.
* Multi-moneda.
* Multi-idioma.
* Procesamiento real de tarjetas.

Estas funcionalidades solamente deben agregarse posteriormente si se solicitan explícitamente.

---

# 59. Prioridad del proyecto

El objetivo no es construir un e-commerce de producción completo.

El objetivo es contar con una aplicación suficientemente funcional para demostrar:

* Desarrollo web moderno.
* Integración con una API.
* Autenticación.
* Persistencia de datos.
* Gestión de estados.
* Roles.
* Testing.
* Automatización.
* Despliegue.
* CI/CD.

Por ello, cuando existan varias alternativas válidas, seleccionar la más sencilla que cumpla correctamente con los requisitos.


