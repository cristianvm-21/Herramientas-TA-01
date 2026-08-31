"use client"

import { RefreshCw } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

import { Catalog } from "@/components/products/catalog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getCategories, getProducts } from "@/lib/api/products"
import type { Product } from "@/types/product"

type CatalogLoaderProps = {
  initialProducts: Product[] | null
  initialCategories: string[] | null
}

export function CatalogLoader({ initialProducts, initialCategories }: CatalogLoaderProps) {
  const hasInitialCatalog = initialProducts !== null && initialCategories !== null
  const [products, setProducts] = useState(initialProducts)
  const [categories, setCategories] = useState(initialCategories)
  const [isLoading, setIsLoading] = useState(!hasInitialCatalog)
  const [hasError, setHasError] = useState(false)

  const getCatalog = useCallback(() => Promise.all([getProducts(), getCategories()]), [])

  const loadCatalog = useCallback(async () => {
    setIsLoading(true)
    setHasError(false)

    try {
      const [nextProducts, nextCategories] = await getCatalog()
      setProducts(nextProducts)
      setCategories(nextCategories)
    } catch {
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }, [getCatalog])

  useEffect(() => {
    if (!hasInitialCatalog) {
      let isActive = true

      void getCatalog()
        .then(([nextProducts, nextCategories]) => {
          if (!isActive) return
          setProducts(nextProducts)
          setCategories(nextCategories)
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
  }, [getCatalog, hasInitialCatalog])

  if (isLoading) {
    return <CatalogSkeleton />
  }

  if (hasError || !products || !categories) {
    return (
      <Alert className="border-destructive/30">
        <AlertTitle>No se pudo cargar el catálogo</AlertTitle>
        <AlertDescription className="space-y-3">
          <p>No se pudo cargar la información. Inténtalo nuevamente más tarde.</p>
          <Button type="button" variant="outline" size="sm" onClick={() => void loadCatalog()}>
            <RefreshCw aria-hidden="true" /> Reintentar
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return <Catalog products={products} categories={categories} />
}

function CatalogSkeleton() {
  return (
    <div className="space-y-6" aria-label="Cargando catálogo">
      <div className="grid gap-3 rounded-xl border bg-surface p-4 md:grid-cols-[minmax(0,1fr)_16rem]">
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
      </div>
      <Skeleton className="h-5 w-40" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <Skeleton key={index} className="h-96" />
        ))}
      </div>
    </div>
  )
}
