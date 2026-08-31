import { ClipboardList } from "lucide-react"

import { AccountNavigation } from "@/components/account/account-navigation"
import { OrdersList } from "@/components/account/orders-list"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { requireUser } from "@/lib/auth"
import { getOrdersForUser } from "@/lib/supabase/orders"
import type { Order } from "@/types/order"

export default async function OrdersPage() {
  const user = await requireUser("/account/orders")
  let orders: Order[] = []
  let hasLoadError = false

  try {
    orders = await getOrdersForUser(user.id)
  } catch {
    hasLoadError = true
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-3"><span className="grid size-10 place-items-center rounded-lg bg-primary text-primary-foreground"><ClipboardList className="size-5" aria-hidden="true" /></span><div><h1 className="text-3xl font-semibold tracking-tight">Mis pedidos</h1><p className="mt-1 text-muted-foreground">Consulta el estado y detalle de tus compras.</p></div></div>
      <AccountNavigation active="orders" />
      {hasLoadError ? <Alert className="border-destructive/30"><AlertTitle>No se pudieron cargar tus pedidos</AlertTitle><AlertDescription>Inténtalo nuevamente en unos momentos.</AlertDescription></Alert> : <OrdersList orders={orders} />}
    </section>
  )
}
