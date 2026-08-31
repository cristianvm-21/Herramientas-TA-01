import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { notFound } from "next/navigation"

import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { requireUser } from "@/lib/auth"
import { formatCurrency } from "@/lib/formatters"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/server"

type ConfirmationOrder = {
  id: string
  total: number
  status: "pending"
  created_at: string
}

type ConfirmationPageProps = {
  params: Promise<{ id: string }>
}

export default async function ConfirmationPage({ params }: ConfirmationPageProps) {
  await requireUser("/checkout")
  const { id } = await params
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("orders")
    .select("id, total, status, created_at")
    .eq("id", id)
    .single()

  if (error || !data) {
    notFound()
  }

  const order = data as ConfirmationOrder
  const createdAt = new Intl.DateTimeFormat("es-PE", { dateStyle: "long", timeStyle: "short" }).format(new Date(order.created_at))

  return (
    <section className="mx-auto grid min-h-[calc(100svh-8rem)] max-w-2xl place-items-center px-4 py-10 sm:px-6">
      <Card className="w-full text-center">
        <CardHeader className="items-center">
          <span className="grid size-12 place-items-center rounded-full bg-success/10 text-success"><CheckCircle2 className="size-6" aria-hidden="true" /></span>
          <CardTitle className="mt-3 text-2xl">¡Pedido confirmado!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Tu pago simulado fue aprobado y registramos tu pedido.</p>
          <dl className="mt-6 space-y-3 rounded-lg bg-surface p-4 text-left text-sm">
            <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Pedido</dt><dd className="break-all font-medium">{order.id}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Fecha</dt><dd className="font-medium">{createdAt}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Estado</dt><dd className="font-medium text-warning">Pendiente</dd></div>
            <div className="flex justify-between gap-4 border-t pt-3 text-base"><dt className="font-semibold">Total</dt><dd className="font-semibold">{formatCurrency(order.total)}</dd></div>
          </dl>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/products" className={cn(buttonVariants())}>Seguir comprando</Link>
            <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>Ir al inicio</Link>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
