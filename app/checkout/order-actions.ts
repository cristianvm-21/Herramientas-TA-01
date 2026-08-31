"use server"

import { revalidatePath } from "next/cache"

import { getProductById } from "@/lib/api/products"
import { requireUser } from "@/lib/auth"
import { prepareOrder, normalizeOrderRequestItems, type OrderRequestItem } from "@/lib/orders/order-creation"
import { validateShippingDetails } from "@/lib/checkout/shipping"
import { createClient } from "@/lib/supabase/server"

type ShippingProfileRow = {
  first_name: string | null
  last_name: string | null
  department: string | null
  province: string | null
  district: string | null
  address: string | null
}

export type CreateOrderResult = {
  orderId?: string
  message?: string
}

export async function createOrder(input: OrderRequestItem[]): Promise<CreateOrderResult> {
  const user = await requireUser("/checkout")
  const items = normalizeOrderRequestItems(input)

  if (!items) {
    return { message: "Tu carrito está vacío o contiene cantidades no válidas." }
  }

  const supabase = await createClient()
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("first_name, last_name, department, province, district, address")
    .eq("id", user.id)
    .single()

  if (profileError || !profileData) {
    return { message: "No se pudieron obtener tus datos de entrega." }
  }

  const profile = profileData as ShippingProfileRow
  const shipping = validateShippingDetails({
    firstName: profile.first_name,
    lastName: profile.last_name,
    department: profile.department,
    province: profile.province,
    district: profile.district,
    address: profile.address,
  })

  if (!shipping.isValid) {
    return { message: "Completa y guarda tus datos de entrega antes de confirmar el pago." }
  }

  try {
    const products = await Promise.all(items.map((item) => getProductById(item.productId)))
    const order = prepareOrder(items, products)

    if (!order) {
      return { message: "No se pudieron validar los productos del carrito." }
    }

    const { data, error } = await supabase.rpc("create_order", {
      p_total: order.total,
      p_shipping_name: `${shipping.values.firstName} ${shipping.values.lastName}`,
      p_shipping_department: shipping.values.department,
      p_shipping_province: shipping.values.province,
      p_shipping_district: shipping.values.district,
      p_shipping_address: shipping.values.address,
      p_items: order.items.map((item) => ({
        product_id: item.productId,
        product_name: item.productName,
        product_image: item.productImage,
        unit_price: item.unitPrice,
        quantity: item.quantity,
        subtotal: item.subtotal,
      })),
    })

    if (error || typeof data !== "string") {
      return { message: "No se pudo registrar tu pedido. Inténtalo nuevamente." }
    }

    revalidatePath("/checkout")
    return { orderId: data }
  } catch {
    return { message: "No se pudieron validar los productos. Inténtalo nuevamente." }
  }
}
