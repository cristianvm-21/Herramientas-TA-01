"use client"

import { ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useCartStore } from "@/stores/cart-store"
import type { Product } from "@/types/product"

type AddToCartButtonProps = {
  product: Product
  quantity?: number
  className?: string
}

export function AddToCartButton({ product, quantity = 1, className }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem)

  return (
    <Button
      type="button"
      className={className}
      onClick={() =>
        addItem(
          {
            productId: product.id,
            title: product.title,
            image: product.image,
            price: product.price,
          },
          quantity
        )
      }
    >
      <ShoppingCart aria-hidden="true" />
      Agregar al carrito
    </Button>
  )
}
