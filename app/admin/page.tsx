import { ClipboardList, PackageCheck, Truck, UsersRound } from "lucide-react"

import { AdminNavigation } from "@/components/admin/admin-navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { getAdminMetrics, type AdminMetrics } from "@/lib/supabase/admin"

const metricCards = [
  { key: "totalOrders", label: "Pedidos totales", icon: ClipboardList },
  { key: "pendingOrders", label: "Pendientes", icon: ClipboardList },
  { key: "shippedOrders", label: "Enviados", icon: Truck },
  { key: "deliveredOrders", label: "Entregados", icon: PackageCheck },
  { key: "totalUsers", label: "Usuarios registrados", icon: UsersRound },
] as const

export default async function AdminDashboardPage() {
  let metrics: AdminMetrics | undefined
  let hasLoadError = false

  try {
    metrics = await getAdminMetrics()
  } catch {
    hasLoadError = true
  }

  return <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><div className="mb-6"><h1 className="text-3xl font-semibold tracking-tight">Administración</h1><p className="mt-1 text-muted-foreground">Resumen general de la tienda.</p></div><AdminNavigation active="dashboard" />{hasLoadError || !metrics ? <Alert className="border-destructive/30"><AlertTitle>No se pudieron cargar las métricas</AlertTitle><AlertDescription>Inténtalo nuevamente en unos momentos.</AlertDescription></Alert> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{metricCards.map((metric) => { const Icon = metric.icon; return <Card key={metric.key}><CardContent className="p-5"><Icon className="size-5 text-primary" aria-hidden="true" /><p className="mt-4 text-2xl font-semibold">{metrics[metric.key]}</p><p className="mt-1 text-sm text-muted-foreground">{metric.label}</p></CardContent></Card> })}</div>}</section>
}
