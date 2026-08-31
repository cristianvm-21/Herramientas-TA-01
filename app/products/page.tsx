import { CatalogLoader } from "@/components/products/catalog-loader"
import { getCategories, getProducts } from "@/lib/api/products"

export default async function ProductsPage() {
  const result = await Promise.all([getProducts(), getCategories()])
    .then(([products, categories]) => ({ products, categories }))
    .catch(() => ({ products: null, categories: null }))

  return <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><div className="mb-8 max-w-2xl"><h1 className="text-3xl font-semibold tracking-tight">Productos</h1><p className="mt-2 text-muted-foreground">Encuentra artículos de distintas categorías para tu día a día.</p></div><CatalogLoader initialProducts={result.products} initialCategories={result.categories} /></section>
}
