import Link from "next/link"
import { ArrowRight, ShieldCheck, ShoppingBag, Truck } from "lucide-react"

import { FeaturedProducts } from "@/components/products/featured-products"
import { buttonVariants } from "@/components/ui/button"
import { getProducts } from "@/lib/api/products"
import { cn } from "@/lib/utils"
import siteConfig from "@/site.config.mjs"

export default async function Page() {
  const initialProducts = await getProducts()
    .then((items) => items.slice(0, 4))
    .catch(() => null)
  return (
    <>
      <section className="bg-surface">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-semibold tracking-wide text-primary uppercase">
              Compra simple y segura
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              Encuentra productos para cada momento.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
              Explora el catálogo de {siteConfig.name}, añade lo que necesitas y
              gestiona tu carrito con facilidad.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/products"
                className={cn(buttonVariants({ size: "lg" }))}
              >
                Ver productos <ArrowRight aria-hidden="true" />
              </Link>
              <Link
                href="/cart"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" })
                )}
              >
                Ver carrito
              </Link>
            </div>
          </div>
          <div className="hidden rounded-2xl border bg-background p-8 shadow-sm lg:block">
            <ShoppingBag className="size-20 text-primary" aria-hidden="true" />
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Productos destacados
            </h2>
            <p className="mt-2 text-muted-foreground">
              Una selección del catálogo disponible.
            </p>
          </div>
          <Link
            href="/products"
            className="text-sm font-medium text-primary hover:underline"
          >
            Ver todo
          </Link>
        </div>
        <FeaturedProducts initialProducts={initialProducts} />
      </section>
      <section className="border-y bg-surface">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:grid-cols-3 sm:px-6 lg:px-8">
          <Feature
            icon={Truck}
            title="Entregas a Nivel Nacional"
            text="Llevamos tus productos hasta tu casa"
          />
          <Feature
            icon={ShieldCheck}
            title="Compra con confianza"
            text="Almacenamos tus datos de forma segura"
          />
          <Feature
            icon={ShoppingBag}
            title="Proceso sencillo"
            text="Añade y modifica productos en pocos pasos."
          />
        </div>
      </section>
    </>
  )
}

function Feature({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Truck
  title: string
  text: string
}) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-0.5 size-5 text-primary" aria-hidden="true" />
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  )
}
