import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, MapPin, PackageCheck } from "lucide-react"
import { notFound } from "next/navigation"

import { AccountNavigation } from "@/components/account/account-navigation"
import { OrderStatusBadge } from "@/components/account/order-status-badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { requireUser } from "@/lib/auth"
import { formatCurrency } from "@/lib/formatters"
import { getOrderDetailsForUser } from "@/lib/supabase/orders"
import { cn } from "@/lib/utils"

type OrderDetailsPageProps = {
  params: Promise<{ id: string }>
}

export default async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const user = await requireUser("/account/orders")
  const { id } = await params
  const details = await getOrderDetailsForUser(user.id, id).catch(() => undefined)

  if (details === null) {
    notFound()
  }

  if (!details) {
    return <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8"><Alert className="border-destructive/30"><AlertTitle>No se pudo cargar el pedido</AlertTitle><AlertDescription>Inténtalo nuevamente en unos momentos.</AlertDescription></Alert></section>
  }

  const { order, items } = details
  const createdAt = new Intl.DateTimeFormat("es-PE", { dateStyle: "long", timeStyle: "short" }).format(new Date(order.createdAt))

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/account/orders" className={cn(buttonVariants({ variant: "ghost", className: "mb-6" }))}><ArrowLeft aria-hidden="true" />Volver a mis pedidos</Link>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4"><div><h1 className="text-3xl font-semibold tracking-tight">Pedido #{order.id.slice(0, 8).toUpperCase()}</h1><p className="mt-1 text-sm text-muted-foreground">Realizado el {createdAt}</p></div><OrderStatusBadge status={order.status} /></div>
      <AccountNavigation active="orders" />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_19rem]">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><PackageCheck className="size-5 text-primary" aria-hidden="true" />Productos</CardTitle></CardHeader>
          <CardContent>
            {items.length === 0 ? <p className="text-sm text-muted-foreground">No se encontraron productos para este pedido.</p> : <div className="divide-y">{items.map((item) => <article key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0"><div className="relative size-20 shrink-0 rounded-lg bg-white"><Image src={item.productImage} alt={item.productName} fill sizes="80px" className="object-contain p-2" /></div><div className="min-w-0 flex-1"><h2 className="line-clamp-2 font-medium">{item.productName}</h2><p className="mt-1 text-sm text-muted-foreground">{formatCurrency(item.unitPrice)} × {item.quantity}</p></div><p className="shrink-0 font-semibold">{formatCurrency(item.subtotal)}</p></article>)}</div>}
          </CardContent>
        </Card>
        <aside className="space-y-6 lg:sticky lg:top-24">
          <Card><CardHeader><CardTitle>Resumen</CardTitle></CardHeader><CardContent><div className="flex items-center justify-between text-lg font-semibold"><span>Total</span><span>{formatCurrency(order.total)}</span></div></CardContent></Card>
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><MapPin className="size-5 text-primary" aria-hidden="true" />Entrega</CardTitle></CardHeader><CardContent className="space-y-2 text-sm"><p className="font-medium">{order.shippingName}</p><p className="text-muted-foreground">{order.shippingAddress}</p><p className="text-muted-foreground">{order.shippingDistrict}, {order.shippingProvince}</p><p className="text-muted-foreground">{order.shippingDepartment}</p></CardContent></Card>
        </aside>
      </div>
    </section>
  )
}
