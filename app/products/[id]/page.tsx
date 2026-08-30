import Image from "next/image"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { notFound } from "next/navigation"

import { ProductQuantityPicker } from "@/components/products/product-quantity-picker"
import { ProductRating } from "@/components/products/product-rating"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { buttonVariants } from "@/components/ui/button"
import { getApiErrorMessage } from "@/lib/api/axios"
import { getProductById } from "@/lib/api/products"
import { formatCategory, formatCurrency } from "@/lib/formatters"
import { cn } from "@/lib/utils"

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const productId = Number(id)
  if (!Number.isInteger(productId) || productId < 1) notFound()

  const result = await getProductById(productId)
    .then((product) => ({ product, errorMessage: null, isNotFound: false }))
    .catch((error: unknown) => ({ product: null, errorMessage: getApiErrorMessage(error), isNotFound: (error as { response?: { status?: number } }).response?.status === 404 }))

  if (result.isNotFound) notFound()
  if (!result.product) {
    return <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8"><Alert className="border-destructive/30"><AlertTitle>No se pudo cargar el producto</AlertTitle><AlertDescription>{result.errorMessage}</AlertDescription></Alert></section>
  }

  const product = result.product
  return <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8"><Link href="/products" className={cn(buttonVariants({ variant: "ghost" }), "mb-8 -ml-2")}><ChevronLeft aria-hidden="true" />Volver a productos</Link><div className="grid gap-10 lg:grid-cols-2 lg:items-start"><div className="relative aspect-square rounded-xl border bg-white"><Image src={product.image} alt={product.title} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-contain p-10" priority /></div><div><p className="text-sm font-semibold tracking-wide text-primary uppercase">{formatCategory(product.category)}</p><h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance">{product.title}</h1><div className="mt-5"><ProductRating rate={product.rating.rate} count={product.rating.count} /></div><p className="mt-6 text-3xl font-semibold">{formatCurrency(product.price)}</p><p className="mt-6 leading-7 text-muted-foreground">{product.description}</p><div className="mt-8 border-t pt-6"><p className="mb-3 text-center text-sm font-medium lg:text-left">Cantidad</p><ProductQuantityPicker product={product} /></div></div></div></section>
}
