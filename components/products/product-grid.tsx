import { PackageSearch } from "lucide-react"

import { ProductCard } from "@/components/products/product-card"
import type { Product } from "@/types/product"

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="grid min-h-60 place-items-center rounded-xl border border-dashed bg-surface p-8 text-center">
        <div>
          <PackageSearch className="mx-auto mb-3 size-8 text-muted-foreground" aria-hidden="true" />
          <h2 className="font-semibold">No hay productos disponibles</h2>
          <p className="mt-1 text-sm text-muted-foreground">Prueba con otra categoría.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
