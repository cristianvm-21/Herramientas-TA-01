"use client"

import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, RefreshCw } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

import { ProductQuantityPicker } from "@/components/products/product-quantity-picker"
import { ProductRating } from "@/components/products/product-rating"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button, buttonVariants } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getProductById } from "@/lib/api/products"
import { formatCategory, formatCurrency } from "@/lib/formatters"
import { cn } from "@/lib/utils"
import type { Product } from "@/types/product"

type ProductDetailContentProps = {
  productId: number
  initialProduct: Product | null
}

export function ProductDetailContent({ productId, initialProduct }: ProductDetailContentProps) {
  const [product, setProduct] = useState(initialProduct)
  const [isLoading, setIsLoading] = useState(initialProduct === null)
  const [hasError, setHasError] = useState(false)

  const getProduct = useCallback(() => getProductById(productId), [productId])

  const loadProduct = useCallback(async () => {
    setIsLoading(true)
    setHasError(false)

    try {
      setProduct(await getProduct())
    } catch {
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }, [getProduct])

  useEffect(() => {
    if (initialProduct === null) {
      let isActive = true

      void getProduct()
        .then((nextProduct) => {
          if (isActive) setProduct(nextProduct)
        })
        .catch(() => {
          if (isActive) setHasError(true)
        })
        .finally(() => {
          if (isActive) setIsLoading(false)
        })

      return () => {
        isActive = false
      }
    }
  }, [getProduct, initialProduct])

  if (isLoading) {
    return <ProductDetailSkeleton />
  }

  if (hasError || !product) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Alert className="border-destructive/30">
          <AlertTitle>No se pudo cargar el producto</AlertTitle>
          <AlertDescription className="space-y-3">
            <p>No se pudo cargar la información. Inténtalo nuevamente más tarde.</p>
            <Button type="button" variant="outline" size="sm" onClick={() => void loadProduct()}>
              <RefreshCw aria-hidden="true" /> Reintentar
            </Button>
          </AlertDescription>
        </Alert>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/products" className={cn(buttonVariants({ variant: "ghost" }), "mb-8 -ml-2")}>
        <ChevronLeft aria-hidden="true" />Volver a productos
      </Link>
      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <div className="relative aspect-square rounded-xl border bg-white">
          <Image src={product.image} alt={product.title} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-contain p-10" priority />
        </div>
        <div>
          <p className="text-sm font-semibold tracking-wide text-primary uppercase">{formatCategory(product.category)}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance">{product.title}</h1>
          <div className="mt-5"><ProductRating rate={product.rating.rate} count={product.rating.count} /></div>
          <p className="mt-6 text-3xl font-semibold">{formatCurrency(product.price)}</p>
          <p className="mt-6 leading-7 text-muted-foreground">{product.description}</p>
          <div className="mt-8 border-t pt-6">
            <p className="mb-3 text-center text-sm font-medium lg:text-left">Cantidad</p>
            <ProductQuantityPicker product={product} />
          </div>
        </div>
      </div>
    </section>
  )
}

function ProductDetailSkeleton() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8" aria-label="Cargando producto">
      <Skeleton className="mb-8 h-9 w-40" />
      <div className="grid gap-10 lg:grid-cols-2">
        <Skeleton className="aspect-square" />
        <div className="space-y-5"><Skeleton className="h-5 w-32" /><Skeleton className="h-20 w-full" /><Skeleton className="h-7 w-24" /><Skeleton className="h-28 w-full" /></div>
      </div>
    </section>
  )
}
