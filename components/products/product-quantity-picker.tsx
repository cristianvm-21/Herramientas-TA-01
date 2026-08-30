"use client"

import { Minus, Plus } from "lucide-react"
import { useState } from "react"

import { AddToCartButton } from "@/components/products/add-to-cart-button"
import { Button } from "@/components/ui/button"
import type { Product } from "@/types/product"

export function ProductQuantityPicker({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-fit self-center items-center rounded-lg border lg:self-start">
        <Button type="button" variant="ghost" size="icon" onClick={() => setQuantity((current) => Math.max(1, current - 1))} aria-label="Reducir cantidad">
          <Minus aria-hidden="true" />
        </Button>
        <span className="min-w-10 text-center text-sm font-medium" aria-live="polite">{quantity}</span>
        <Button type="button" variant="ghost" size="icon" onClick={() => setQuantity((current) => current + 1)} aria-label="Aumentar cantidad">
          <Plus aria-hidden="true" />
        </Button>
      </div>
      <AddToCartButton product={product} quantity={quantity} className="min-w-2/4 self-center lg:self-start" />
    </div>
  )
}
