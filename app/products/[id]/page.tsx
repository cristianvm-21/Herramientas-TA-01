import { notFound } from "next/navigation"

import { ProductDetailContent } from "@/components/products/product-detail-content"
import { getProductById } from "@/lib/api/products"

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const productId = Number(id)
  if (!Number.isInteger(productId) || productId < 1) notFound()

  const result = await getProductById(productId)
    .then((product) => ({ product, isNotFound: false }))
    .catch((error: unknown) => ({ product: null, isNotFound: (error as { response?: { status?: number } }).response?.status === 404 }))

  if (result.isNotFound) notFound()
  return <ProductDetailContent productId={productId} initialProduct={result.product} />
}
