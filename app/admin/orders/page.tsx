import { ClipboardList } from "lucide-react"

import { AdminNavigation } from "@/components/admin/admin-navigation"
import { AdminOrdersList } from "@/components/admin/admin-orders-list"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { isOrderStatus } from "@/lib/orders/status"
import { getAdminOrders, type AdminOrder } from "@/lib/supabase/admin"

type AdminOrdersPageProps = {
  searchParams: Promise<{ status?: string }>
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const { status: statusParam } = await searchParams
  const status = isOrderStatus(statusParam) ? statusParam : undefined
  let orders: AdminOrder[] = []
  let hasLoadError = false

  try {
    orders = await getAdminOrders(status)
  } catch {
    hasLoadError = true
  }

  return <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><div className="mb-6 flex items-center gap-3"><span className="grid size-10 place-items-center rounded-lg bg-primary text-primary-foreground"><ClipboardList className="size-5" aria-hidden="true" /></span><div><h1 className="text-3xl font-semibold tracking-tight">Pedidos</h1><p className="mt-1 text-muted-foreground">Gestiona el avance de los pedidos.</p></div></div><AdminNavigation active="orders" /><form className="mb-6 flex max-w-sm items-end gap-3"><div className="flex-1 space-y-2"><label htmlFor="status" className="text-sm font-medium">Filtrar por estado</label><Select id="status" name="status" defaultValue={status ?? ""}><option value="">Todos</option><option value="pending">Pendiente</option><option value="shipped">Enviado</option><option value="delivered">Entregado</option></Select></div><Button type="submit">Filtrar</Button></form>{hasLoadError ? <Alert className="border-destructive/30"><AlertTitle>No se pudieron cargar los pedidos</AlertTitle><AlertDescription>Inténtalo nuevamente en unos momentos.</AlertDescription></Alert> : <AdminOrdersList orders={orders} />}</section>
}
