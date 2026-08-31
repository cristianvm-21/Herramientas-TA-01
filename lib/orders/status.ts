import type { OrderStatus } from "@/types/order"

const statusLabels: Record<OrderStatus, string> = {
  pending: "Pendiente",
  shipped: "Enviado",
  delivered: "Entregado",
}

export function getOrderStatusLabel(status: OrderStatus) {
  return statusLabels[status]
}
