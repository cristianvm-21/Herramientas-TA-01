import Image from "next/image"
import Link from "next/link"

import { AddToCartButton } from "@/components/products/add-to-cart-button"
import { ProductRating } from "@/components/products/product-rating"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { formatCategory, formatCurrency } from "@/lib/formatters"
import type { Product } from "@/types/product"

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="group flex h-full flex-col overflow-hidden">
      <Link href={`/products/${product.id}`} className="relative block aspect-square bg-white p-6">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(min-width: 1280px) 20vw, (min-width: 768px) 33vw, 50vw"
          className="object-contain p-6 transition-transform duration-200 group-hover:scale-105"
        />
      </Link>
      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        <p className="text-xs font-medium tracking-wide text-primary uppercase">{formatCategory(product.category)}</p>
        <Link href={`/products/${product.id}`} className="line-clamp-2 font-medium hover:text-primary">
          {product.title}
        </Link>
        <ProductRating rate={product.rating.rate} count={product.rating.count} />
        <p className="mt-auto text-lg font-semibold">{formatCurrency(product.price)}</p>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 p-4 pt-0">
        <Link href={`/products/${product.id}`} className={buttonVariants({ variant: "outline", className: "w-full" })}>Ver detalle</Link>
        <AddToCartButton product={product} className="w-full bg-blue-500" />
      </CardFooter>
    </Card>
  )
}
