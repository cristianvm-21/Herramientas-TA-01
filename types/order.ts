export type OrderStatus = "pending" | "shipped" | "delivered"

export type OrderItem = {
  id: string
  orderId: string
  productId: number
  productName: string
  productImage: string
  unitPrice: number
  quantity: number
  subtotal: number
}

export type Order = {
  id: string
  userId: string
  status: OrderStatus
  total: number
  shippingName: string
  shippingDepartment: string
  shippingProvince: string
  shippingDistrict: string
  shippingAddress: string
  createdAt: string
  updatedAt: string
}
