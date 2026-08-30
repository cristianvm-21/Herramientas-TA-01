"use client"

import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import type { CartItem, CartProduct } from "@/types/cart"

export type CartState = {
  items: CartItem[]
  addItem: (product: CartProduct, quantity?: number) => void
  removeItem: (productId: number) => void
  increaseQuantity: (productId: number) => void
  decreaseQuantity: (productId: number) => void
  clearCart: () => void
}

export function getCartItemSubtotal(item: CartItem) {
  return item.price * item.quantity
}

export function getCartTotal(items: CartItem[]) {
  return items.reduce((total, item) => total + getCartItemSubtotal(item), 0)
}

export function getCartQuantity(items: CartItem[]) {
  return items.reduce((quantity, item) => quantity + item.quantity, 0)
}

export function isCartEmpty(items: CartItem[]) {
  return items.length === 0
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product, quantity = 1) =>
        set((state) => {
          const safeQuantity = Math.max(1, quantity)
          const existingItem = state.items.find((item) => item.productId === product.productId)

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.productId === product.productId
                  ? { ...item, quantity: item.quantity + safeQuantity }
                  : item
              ),
            }
          }

          return { items: [...state.items, { ...product, quantity: safeQuantity }] }
        }),
      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((item) => item.productId !== productId) })),
      increaseQuantity: (productId) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
          ),
        })),
      decreaseQuantity: (productId) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId
              ? { ...item, quantity: Math.max(1, item.quantity - 1) }
              : item
          ),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "online-store-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
)
