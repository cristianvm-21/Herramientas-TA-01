import { createClient } from "@/lib/supabase/server"
import type { Order, OrderItem, OrderStatus } from "@/types/order"

type OrderRow = {
  id: string
  user_id: string
  status: OrderStatus
  total: number | string
  shipping_name: string
  shipping_department: string
  shipping_province: string
  shipping_district: string
  shipping_address: string
  created_at: string
  updated_at: string
}

type OrderItemRow = {
  id: string
  order_id: string
  product_id: number
  product_name: string
  product_image: string
  unit_price: number | string
  quantity: number
  subtotal: number | string
}

function toOrder(row: OrderRow): Order {
  return {
    id: row.id,
    userId: row.user_id,
    status: row.status,
    total: Number(row.total),
    shippingName: row.shipping_name,
    shippingDepartment: row.shipping_department,
    shippingProvince: row.shipping_province,
    shippingDistrict: row.shipping_district,
    shippingAddress: row.shipping_address,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function toOrderItem(row: OrderItemRow): OrderItem {
  return {
    id: row.id,
    orderId: row.order_id,
    productId: row.product_id,
    productName: row.product_name,
    productImage: row.product_image,
    unitPrice: Number(row.unit_price),
    quantity: row.quantity,
    subtotal: Number(row.subtotal),
  }
}

export async function getOrdersForUser(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error("No se pudieron obtener los pedidos.")
  }

  return ((data ?? []) as OrderRow[]).map(toOrder)
}

export async function getOrderDetailsForUser(userId: string, orderId: string) {
  const supabase = await createClient()
  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .eq("user_id", userId)
    .maybeSingle()

  if (orderError) {
    throw new Error("No se pudo obtener el pedido.")
  }

  if (!orderData) {
    return null
  }

  const { data: itemsData, error: itemsError } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderId)
    .order("created_at", { ascending: true })

  if (itemsError) {
    throw new Error("No se pudieron obtener los productos del pedido.")
  }

  return {
    order: toOrder(orderData as OrderRow),
    items: (itemsData as OrderItemRow[]).map(toOrderItem),
  }
}
