"use client"

import Image from "next/image"
import Link from "next/link"
import { MapPin, PackageCheck, ShoppingBag } from "lucide-react"
import { useSyncExternalStore } from "react"

import { ShippingForm } from "@/components/checkout/shipping-form"
import { PaymentForm } from "@/components/checkout/payment-form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { validateShippingDetails, type ShippingDetails } from "@/lib/checkout/shipping"
import { formatCurrency } from "@/lib/formatters"
import { cn } from "@/lib/utils"
import { getCartItemSubtotal, getCartTotal, useCartStore } from "@/stores/cart-store"

type CheckoutPageContentProps = {
  shippingDetails: ShippingDetails
  profileLoadFailed: boolean
}

export function CheckoutPageContent({ shippingDetails, profileLoadFailed }: CheckoutPageContentProps) {
  const items = useCartStore((state) => state.items)
  const hasHydrated = useSyncExternalStore(
    (onStoreChange) => useCartStore.persist.onFinishHydration(onStoreChange),
    () => useCartStore.persist.hasHydrated(),
    () => false
  )

  if (!hasHydrated) {
    return <CheckoutSkeleton />
  }

  if (items.length === 0) {
    return (
      <div className="grid min-h-72 place-items-center rounded-xl border border-dashed bg-surface p-8 text-center">
        <div>
          <ShoppingBag className="mx-auto mb-3 size-9 text-muted-foreground" aria-hidden="true" />
          <h2 className="text-lg font-semibold">Tu carrito está vacío</h2>
          <p className="mt-2 text-sm text-muted-foreground">Agrega productos al carrito antes de iniciar el checkout.</p>
          <Link href="/products" className={cn(buttonVariants({ className: "mt-5" }))}>Explorar productos</Link>
        </div>
      </div>
    )
  }

  const total = getCartTotal(items)
  const isShippingComplete = validateShippingDetails(shippingDetails).isValid

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="space-y-8">
        {profileLoadFailed && (
          <Alert className="border-warning/30">
            <AlertTitle>No se pudo cargar tu perfil</AlertTitle>
            <AlertDescription>Completa los datos de entrega para continuar. Si el problema persiste, revisa la configuración de Supabase.</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><PackageCheck className="size-5 text-primary" aria-hidden="true" />Productos</CardTitle>
            <CardDescription>Confirma los productos y cantidades de tu carrito.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {items.map((item) => (
                <article key={item.productId} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="relative size-18 shrink-0 rounded-lg bg-white sm:size-20">
                    <Image src={item.image} alt={item.title} fill sizes="80px" className="object-contain p-2" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="line-clamp-2 font-medium">{item.title}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{formatCurrency(item.price)} × {item.quantity}</p>
                  </div>
                  <p className="shrink-0 font-semibold">{formatCurrency(getCartItemSubtotal(item))}</p>
                </article>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><MapPin className="size-5 text-primary" aria-hidden="true" />Información de entrega</CardTitle>
            <CardDescription>Estos datos se guardarán en tu perfil para futuras compras.</CardDescription>
          </CardHeader>
          <CardContent><ShippingForm shippingDetails={shippingDetails} /></CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tarjeta</CardTitle>
            <CardDescription>Ingresa los datos de tu tarjeta para completar la compra</CardDescription>
          </CardHeader>
          <CardContent><PaymentForm items={items} isShippingComplete={isShippingComplete} /></CardContent>
        </Card>
      </div>

      <aside className="h-fit rounded-xl border bg-surface p-5 lg:sticky lg:top-24">
        <h2 className="text-lg font-semibold">Resumen del pedido</h2>
        <div className="mt-5 flex items-center justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>{formatCurrency(total)}</span></div>
        <div className="mt-3 flex items-center justify-between border-t pt-3 text-lg font-semibold"><span>Total</span><span>{formatCurrency(total)}</span></div>
        <p className="mt-5 text-sm text-muted-foreground">El pago es una simulación y no genera un cobro real.</p>
      </aside>
    </div>
  )
}

function CheckoutSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="space-y-8">
        <Card><CardHeader><Skeleton className="h-6 w-36" /><Skeleton className="h-4 w-72" /></CardHeader><CardContent className="space-y-4"><Skeleton className="h-20 w-full" /><Skeleton className="h-20 w-full" /></CardContent></Card>
        <Card><CardHeader><Skeleton className="h-6 w-48" /><Skeleton className="h-4 w-80" /></CardHeader><CardContent className="grid gap-4 sm:grid-cols-2"><Skeleton className="h-9 w-full" /><Skeleton className="h-9 w-full" /><Skeleton className="h-9 w-full" /><Skeleton className="h-9 w-full" /></CardContent></Card>
      </div>
      <Skeleton className="h-44 w-full" />
    </div>
  )
}
