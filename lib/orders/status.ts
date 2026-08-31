import type { OrderStatus } from "@/types/order"

const statusLabels: Record<OrderStatus, string> = {
  pending: "Pendiente",
  shipped: "Enviado",
  delivered: "Entregado",
}

const nextStatuses: Record<OrderStatus, OrderStatus | null> = {
  pending: "shipped",
  shipped: "delivered",
  delivered: null,
}

export function getOrderStatusLabel(status: OrderStatus) {
  return statusLabels[status]
}

export function getNextOrderStatus(status: OrderStatus) {
  return nextStatuses[status]
}

export function canTransitionOrderStatus(current: OrderStatus, next: OrderStatus) {
  return nextStatuses[current] === next
}

export function isOrderStatus(value: string | undefined): value is OrderStatus {
  return value === "pending" || value === "shipped" || value === "delivered"
}
