import type { Product } from "@/types/product"

export type OrderRequestItem = {
  productId: number
  quantity: number
}

export type OrderSnapshotItem = {
  productId: number
  productName: string
  productImage: string
  unitPrice: number
  quantity: number
  subtotal: number
}

export type PreparedOrder = {
  items: OrderSnapshotItem[]
  total: number
}

export function normalizeOrderRequestItems(input: unknown): OrderRequestItem[] | null {
  if (!Array.isArray(input) || input.length === 0) {
    return null
  }

  const quantities = new Map<number, number>()

  for (const item of input) {
    if (
      typeof item !== "object" ||
      item === null ||
      !Number.isSafeInteger((item as OrderRequestItem).productId) ||
      !Number.isSafeInteger((item as OrderRequestItem).quantity) ||
      (item as OrderRequestItem).productId <= 0 ||
      (item as OrderRequestItem).quantity <= 0
    ) {
      return null
    }

    const { productId, quantity } = item as OrderRequestItem
    const accumulatedQuantity = (quantities.get(productId) ?? 0) + quantity

    if (!Number.isSafeInteger(accumulatedQuantity)) {
      return null
    }

    quantities.set(productId, accumulatedQuantity)
  }

  return Array.from(quantities, ([productId, quantity]) => ({ productId, quantity }))
}

export function prepareOrder(items: OrderRequestItem[], products: Product[]): PreparedOrder | null {
  const productsById = new Map(products.map((product) => [product.id, product]))

  if (productsById.size !== items.length) {
    return null
  }

  let totalCents = 0
  const snapshots: OrderSnapshotItem[] = []

  for (const item of items) {
    const product = productsById.get(item.productId)

    if (!product || !Number.isFinite(product.price) || product.price < 0) {
      return null
    }

    const unitPriceCents = Math.round(product.price * 100)
    const subtotalCents = unitPriceCents * item.quantity

    if (!Number.isSafeInteger(unitPriceCents) || !Number.isSafeInteger(subtotalCents)) {
      return null
    }

    totalCents += subtotalCents

    if (!Number.isSafeInteger(totalCents)) {
      return null
    }

    snapshots.push({
      productId: product.id,
      productName: product.title,
      productImage: product.image,
      unitPrice: unitPriceCents / 100,
      quantity: item.quantity,
      subtotal: subtotalCents / 100,
    })
  }

  return { items: snapshots, total: totalCents / 100 }
}
