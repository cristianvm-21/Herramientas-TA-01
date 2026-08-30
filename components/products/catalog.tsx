"use client"

import { Search } from "lucide-react"
import { useMemo, useState } from "react"

import { ProductGrid } from "@/components/products/product-grid"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import type { Product } from "@/types/product"

type CatalogProps = {
  products: Product[]
  categories: string[]
}

export function Catalog({ products, categories }: CatalogProps) {
  const [category, setCategory] = useState("all")
  const [query, setQuery] = useState("")
  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return products.filter(
      (product) =>
        (category === "all" || product.category === category) &&
        (!normalizedQuery || product.title.toLowerCase().includes(normalizedQuery))
    )
  }, [category, products, query])

  return (
    <div className="space-y-6">
      <div className="grid gap-3 rounded-xl border bg-surface p-4 md:grid-cols-[minmax(0,1fr)_16rem]">
        <label className="relative block">
          <span className="sr-only">Buscar producto</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nombre" className="pl-9" />
        </label>
        <label>
          <span className="sr-only">Filtrar por categoría</span>
          <Select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="all">Todas las categorías</option>
            {categories.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </Select>
        </label>
      </div>
      <p className="text-sm text-muted-foreground">{filteredProducts.length} productos encontrados</p>
      <ProductGrid products={filteredProducts} />
    </div>
  )
}
