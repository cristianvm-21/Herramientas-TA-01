import { cn } from "@/lib/utils"
import { getOrderStatusLabel } from "@/lib/orders/status"
import type { OrderStatus } from "@/types/order"

const statusClasses: Record<OrderStatus, string> = {
  pending: "border-warning/40 bg-warning/20 text-warning",
  shipped: "border-info/40 bg-info/20 text-info",
  delivered: "border-success/40 bg-success/20 text-success",
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-xs font-medium", statusClasses[status])}>{getOrderStatusLabel(status)}</span>
}
