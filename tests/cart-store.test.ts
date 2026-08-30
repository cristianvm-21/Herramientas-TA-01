import { beforeEach, describe, expect, it } from "vitest"

import { getCartTotal, isCartEmpty, useCartStore } from "@/stores/cart-store"

const product = { productId: 1, title: "Producto", image: "https://example.com/product.png", price: 15 }

describe("cart store", () => {
  beforeEach(() => useCartStore.setState({ items: [] }))

  it("calcula el total", () => {
    useCartStore.getState().addItem(product, 2)
    expect(getCartTotal(useCartStore.getState().items)).toBe(30)
  })

  it("combina el mismo producto", () => {
    useCartStore.getState().addItem(product)
    useCartStore.getState().addItem(product, 2)
    expect(useCartStore.getState().items).toEqual([{ ...product, quantity: 3 }])
  })

  it("incrementa y no reduce debajo de una unidad", () => {
    useCartStore.getState().addItem(product)
    useCartStore.getState().increaseQuantity(product.productId)
    useCartStore.getState().decreaseQuantity(product.productId)
    useCartStore.getState().decreaseQuantity(product.productId)
    expect(useCartStore.getState().items[0]?.quantity).toBe(1)
  })

  it("elimina productos y permite vaciar el carrito", () => {
    useCartStore.getState().addItem(product)
    useCartStore.getState().removeItem(product.productId)
    expect(useCartStore.getState().items).toEqual([])
    useCartStore.getState().addItem(product)
    useCartStore.getState().clearCart()
    expect(useCartStore.getState().items).toEqual([])
  })

  it("identifica un carrito vacío", () => {
    expect(isCartEmpty(useCartStore.getState().items)).toBe(true)
    useCartStore.getState().addItem(product)
    expect(isCartEmpty(useCartStore.getState().items)).toBe(false)
  })
})
