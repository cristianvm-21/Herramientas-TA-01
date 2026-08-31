"use client"

import { RefreshCw } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

import { ProductGrid } from "@/components/products/product-grid"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getProducts } from "@/lib/api/products"
import type { Product } from "@/types/product"

export function FeaturedProducts({ initialProducts }: { initialProducts: Product[] | null }) {
  const [products, setProducts] = useState(initialProducts)
  const [isLoading, setIsLoading] = useState(initialProducts === null)
  const [hasError, setHasError] = useState(false)

  const getFeaturedProducts = useCallback(async () => (await getProducts()).slice(0, 4), [])

  const loadProducts = useCallback(async () => {
    setIsLoading(true)
    setHasError(false)

    try {
      setProducts(await getFeaturedProducts())
    } catch {
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }, [getFeaturedProducts])

  useEffect(() => {
    if (initialProducts === null) {
      let isActive = true

      void getFeaturedProducts()
        .then((nextProducts) => {
          if (isActive) setProducts(nextProducts)
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
  }, [getFeaturedProducts, initialProducts])

  if (isLoading) {
    return <FeaturedProductsSkeleton />
  }

  if (hasError || !products) {
    return (
      <Alert className="border-destructive/30">
        <AlertTitle>No se pudo cargar el catálogo</AlertTitle>
        <AlertDescription className="space-y-3">
          <p>No se pudo cargar la información. Inténtalo nuevamente más tarde.</p>
          <Button type="button" variant="outline" size="sm" onClick={() => void loadProducts()}>
            <RefreshCw aria-hidden="true" /> Reintentar
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return <ProductGrid products={products} />
}

function FeaturedProductsSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" aria-label="Cargando productos destacados">
      {Array.from({ length: 4 }, (_, index) => (
        <Skeleton key={index} className="h-96" />
      ))}
    </div>
  )
}
