import { createClient } from "@/lib/supabase/server"
import type { UserRole } from "@/types/profile"
import type { Order, OrderStatus } from "@/types/order"

type AdminOrderRow = {
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

type AdminProfileRow = {
  id: string
  email: string
  role: UserRole
  first_name: string | null
  last_name: string | null
  dni: string | null
  created_at: string
}

export type AdminOrder = Order & {
  customerEmail: string | null
  customerName: string | null
}

export type AdminUser = {
  id: string
  email: string
  role: UserRole
  firstName: string | null
  lastName: string | null
  dni: string | null
  createdAt: string
}

export type AdminMetrics = {
  totalOrders: number
  pendingOrders: number
  shippedOrders: number
  deliveredOrders: number
  totalUsers: number
}

function toAdminUser(row: AdminProfileRow): AdminUser {
  return {
    id: row.id,
    email: row.email,
    role: row.role,
    firstName: row.first_name,
    lastName: row.last_name,
    dni: row.dni,
    createdAt: row.created_at,
  }
}

function toAdminOrder(row: AdminOrderRow, profileById: Map<string, AdminProfileRow>): AdminOrder {
  const profile = profileById.get(row.user_id)

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
    customerEmail: profile?.email ?? null,
    customerName: profile ? [profile.first_name, profile.last_name].filter(Boolean).join(" ") || null : null,
  }
}

export async function getAdminMetrics(): Promise<AdminMetrics> {
  const supabase = await createClient()
  const [{ data: ordersData, error: ordersError }, { count: totalUsers, error: usersError }] = await Promise.all([
    supabase.from("orders").select("status"),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
  ])

  if (ordersError || usersError) {
    throw new Error("No se pudieron obtener las métricas administrativas.")
  }

  const orders = (ordersData ?? []) as Array<{ status: OrderStatus }>

  return {
    totalOrders: orders.length,
    pendingOrders: orders.filter((order) => order.status === "pending").length,
    shippedOrders: orders.filter((order) => order.status === "shipped").length,
    deliveredOrders: orders.filter((order) => order.status === "delivered").length,
    totalUsers: totalUsers ?? 0,
  }
}

export async function getAdminOrders(status?: OrderStatus) {
  const supabase = await createClient()
  let ordersQuery = supabase.from("orders").select("*").order("created_at", { ascending: false })

  if (status) {
    ordersQuery = ordersQuery.eq("status", status)
  }

  const [{ data: ordersData, error: ordersError }, { data: profilesData, error: profilesError }] = await Promise.all([
    ordersQuery,
    supabase.from("profiles").select("id, email, first_name, last_name"),
  ])

  if (ordersError || profilesError) {
    throw new Error("No se pudieron obtener los pedidos administrativos.")
  }

  const profileById = new Map(((profilesData ?? []) as AdminProfileRow[]).map((profile) => [profile.id, profile]))
  return ((ordersData ?? []) as AdminOrderRow[]).map((order) => toAdminOrder(order, profileById))
}

export async function getAdminUsers() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, role, first_name, last_name, dni, created_at")
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error("No se pudieron obtener los usuarios administrativos.")
  }

  return ((data ?? []) as AdminProfileRow[]).map(toAdminUser)
}
