"use server"

import { revalidatePath } from "next/cache"

import { requireAdmin } from "@/lib/auth"
import { canTransitionOrderStatus, getNextOrderStatus, isOrderStatus } from "@/lib/orders/status"
import { createClient } from "@/lib/supabase/server"

export type AdminOrderActionState = {
  success?: boolean
  message?: string
}

export async function advanceOrderStatus(_: AdminOrderActionState, formData: FormData): Promise<AdminOrderActionState> {
  await requireAdmin("/admin/orders")
  const orderId = String(formData.get("orderId") ?? "")
  const requestedStatus = String(formData.get("nextStatus") ?? "")

  if (!orderId || !isOrderStatus(requestedStatus)) {
    return { message: "No se pudo actualizar el pedido." }
  }

  const supabase = await createClient()
  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .select("status")
    .eq("id", orderId)
    .maybeSingle()

  if (orderError || !orderData) {
    return { message: "No se encontró el pedido solicitado." }
  }

  const currentStatus = (orderData as { status: string }).status

  if (!isOrderStatus(currentStatus) || getNextOrderStatus(currentStatus) !== requestedStatus || !canTransitionOrderStatus(currentStatus, requestedStatus)) {
    return { message: "La transición de estado no es válida." }
  }

  const { error } = await supabase.from("orders").update({ status: requestedStatus }).eq("id", orderId)

  if (error) {
    return { message: "No se pudo actualizar el estado del pedido." }
  }

  revalidatePath("/admin")
  revalidatePath("/admin/orders")
  revalidatePath("/account/orders", "layout")
  return { success: true, message: `Pedido marcado como ${requestedStatus === "shipped" ? "enviado" : "entregado"}.` }
}
