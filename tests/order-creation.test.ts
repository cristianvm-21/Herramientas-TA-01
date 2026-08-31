import { describe, expect, it } from "vitest"

import { normalizeOrderRequestItems, prepareOrder } from "@/lib/orders/order-creation"
import type { Product } from "@/types/product"

const products: Product[] = [
  { id: 1, title: "Producto 1", price: 10.5, description: "", category: "", image: "https://example.com/1.png", rating: { rate: 4, count: 1 } },
  { id: 2, title: "Producto 2", price: 2.49, description: "", category: "", image: "https://example.com/2.png", rating: { rate: 4, count: 1 } },
]

describe("preparación de pedidos", () => {
  it("rechaza un carrito vacío o cantidades no válidas", () => {
    expect(normalizeOrderRequestItems([])).toBeNull()
    expect(normalizeOrderRequestItems([{ productId: 1, quantity: 0 }])).toBeNull()
  })

  it("combina productos repetidos antes de consultar el catálogo", () => {
    expect(normalizeOrderRequestItems([
      { productId: 1, quantity: 1 },
      { productId: 1, quantity: 2 },
    ])).toEqual([{ productId: 1, quantity: 3 }])
  })

  it("calcula las líneas y el total desde los productos validados", () => {
    const order = prepareOrder([
      { productId: 1, quantity: 2 },
      { productId: 2, quantity: 3 },
    ], products)

    expect(order).toMatchObject({ total: 28.47 })
    expect(order?.items).toMatchObject([
      { productId: 1, unitPrice: 10.5, subtotal: 21 },
      { productId: 2, unitPrice: 2.49, subtotal: 7.47 },
    ])
  })
})
