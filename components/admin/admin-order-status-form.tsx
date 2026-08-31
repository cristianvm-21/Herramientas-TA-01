"use client"

import { useActionState } from "react"

import { advanceOrderStatus, type AdminOrderActionState } from "@/app/admin/orders/actions"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { getNextOrderStatus, getOrderStatusLabel } from "@/lib/orders/status"
import type { OrderStatus } from "@/types/order"

const initialState: AdminOrderActionState = {}

export function AdminOrderStatusForm({ orderId, status }: { orderId: string; status: OrderStatus }) {
  const [state, formAction, isPending] = useActionState(advanceOrderStatus, initialState)
  const nextStatus = getNextOrderStatus(status)

  if (!nextStatus) {
    return <p className="text-sm font-medium text-success">Pedido completado</p>
  }

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="orderId" value={orderId} />
      <input type="hidden" name="nextStatus" value={nextStatus} />
      {state.message && <Alert className={state.success ? "border-success/30" : "border-destructive/30"}><AlertDescription>{state.message}</AlertDescription></Alert>}
      <Button type="submit" size="sm" disabled={isPending}>{isPending ? "Actualizando..." : `Marcar como ${getOrderStatusLabel(nextStatus)}`}</Button>
    </form>
  )
}
