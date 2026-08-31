import { cn } from "@/lib/utils"
import { getOrderStatusLabel } from "@/lib/orders/status"
import type { OrderStatus } from "@/types/order"

const statusClasses: Record<OrderStatus, string> = {
  pending: "border-warning/30 bg-warning/10 text-warning",
  shipped: "border-info/30 bg-info/10 text-info",
  delivered: "border-success/30 bg-success/10 text-success",
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-xs font-medium", statusClasses[status])}>{getOrderStatusLabel(status)}</span>
}
