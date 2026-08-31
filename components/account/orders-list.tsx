import Link from "next/link"
import { ClipboardList, MapPin } from "lucide-react"

import { OrderStatusBadge } from "@/components/account/order-status-badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/lib/formatters"
import { cn } from "@/lib/utils"
import type { Order } from "@/types/order"

export function OrdersList({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return (
      <div className="grid min-h-72 place-items-center rounded-xl border border-dashed bg-surface p-8 text-center">
        <div>
          <ClipboardList className="mx-auto mb-3 size-9 text-muted-foreground" aria-hidden="true" />
          <h2 className="text-lg font-semibold">Aún no tienes pedidos</h2>
          <p className="mt-2 text-sm text-muted-foreground">Cuando completes una compra, aparecerá en este historial.</p>
          <Link href="/products" className={cn(buttonVariants({ className: "mt-5" }))}>Explorar productos</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const createdAt = new Intl.DateTimeFormat("es-PE", { dateStyle: "medium", timeStyle: "short" }).format(new Date(order.createdAt))

        return (
          <Card key={order.id}>
            <CardContent className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-3"><h2 className="font-semibold">Pedido #{order.id.slice(0, 8).toUpperCase()}</h2><OrderStatusBadge status={order.status} /></div>
                <p className="text-sm text-muted-foreground">{createdAt}</p>
                <p className="flex items-start gap-1.5 text-sm text-muted-foreground"><MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />{order.shippingAddress}, {order.shippingDistrict}, {order.shippingProvince}</p>
              </div>
              <div className="flex shrink-0 items-center justify-between gap-4 sm:flex-col sm:items-end">
                <p className="text-lg font-semibold">{formatCurrency(order.total)}</p>
                <Link href={`/account/orders/${order.id}`} className={cn(buttonVariants({ variant: "outline" }))}>Ver detalle</Link>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
