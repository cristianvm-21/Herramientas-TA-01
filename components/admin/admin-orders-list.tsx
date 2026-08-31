import { PackageSearch } from "lucide-react"

import { AdminOrderStatusForm } from "@/components/admin/admin-order-status-form"
import { OrderStatusBadge } from "@/components/account/order-status-badge"
import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/lib/formatters"
import type { AdminOrder } from "@/lib/supabase/admin"

export function AdminOrdersList({ orders }: { orders: AdminOrder[] }) {
  if (orders.length === 0) {
    return <div className="grid min-h-64 place-items-center rounded-xl border border-dashed bg-surface p-8 text-center"><div><PackageSearch className="mx-auto mb-3 size-9 text-muted-foreground" aria-hidden="true" /><h2 className="text-lg font-semibold">No se encontraron pedidos</h2><p className="mt-2 text-sm text-muted-foreground">Prueba con otro filtro de estado.</p></div></div>
  }

  return <div className="space-y-4">{orders.map((order) => <Card key={order.id}><CardContent className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"><div className="min-w-0 space-y-2"><div className="flex flex-wrap items-center gap-3"><h2 className="font-semibold">Pedido #{order.id.slice(0, 8).toUpperCase()}</h2><OrderStatusBadge status={order.status} /></div><p className="text-sm text-muted-foreground">{order.customerName ?? "Cliente sin nombre"} · {order.customerEmail ?? "Sin correo"}</p><p className="text-sm text-muted-foreground">{order.shippingAddress}, {order.shippingDistrict}, {order.shippingProvince}</p></div><div className="flex flex-wrap items-center justify-between gap-4 lg:flex-col lg:items-end"><p className="text-lg font-semibold">{formatCurrency(order.total)}</p><AdminOrderStatusForm orderId={order.id} status={order.status} /></div></CardContent></Card>)}</div>
}
