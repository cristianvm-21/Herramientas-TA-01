import { Catalog } from "@/components/products/catalog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getApiErrorMessage } from "@/lib/api/axios"
import { getCategories, getProducts } from "@/lib/api/products"

export default async function ProductsPage() {
  const result = await Promise.all([getProducts(), getCategories()])
    .then(([products, categories]) => ({ products, categories, errorMessage: null }))
    .catch((error: unknown) => ({ products: null, categories: null, errorMessage: getApiErrorMessage(error) }))

  return <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><div className="mb-8 max-w-2xl"><h1 className="text-3xl font-semibold tracking-tight">Productos</h1><p className="mt-2 text-muted-foreground">Encuentra artículos de distintas categorías para tu día a día.</p></div>{result.errorMessage || !result.products || !result.categories ? <Alert className="border-destructive/30"><AlertTitle>No se pudo cargar el catálogo</AlertTitle><AlertDescription>{result.errorMessage ?? "No se pudo cargar la información."}</AlertDescription></Alert> : <Catalog products={result.products} categories={result.categories} />}</section>
}
