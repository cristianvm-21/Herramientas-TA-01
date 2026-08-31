"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { formatCurrency } from "@/lib/formatters"
import { cn } from "@/lib/utils"
import { getCartItemSubtotal, getCartTotal, useCartStore } from "@/stores/cart-store"

export function CartPageContent() {
  const items = useCartStore((state) => state.items)
  const increaseQuantity = useCartStore((state) => state.increaseQuantity)
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity)
  const removeItem = useCartStore((state) => state.removeItem)
  const clearCart = useCartStore((state) => state.clearCart)

  if (items.length === 0) {
    return <div className="grid min-h-72 place-items-center rounded-xl border border-dashed bg-surface p-8 text-center"><div><ShoppingBag className="mx-auto mb-3 size-9 text-muted-foreground" aria-hidden="true" /><h2 className="text-lg font-semibold">Tu carrito está vacío</h2><p className="mt-2 text-sm text-muted-foreground">Agrega productos para verlos aquí.</p><Link href="/products" className={cn(buttonVariants({ className: "mt-5" }))}>Explorar productos</Link></div></div>
  }

  const total = getCartTotal(items)
  return <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]"><div className="overflow-hidden rounded-xl border bg-card"><div className="divide-y">{items.map((item) => <article key={item.productId} className="flex gap-4 p-4 sm:p-5"><div className="relative size-20 shrink-0 rounded-lg bg-white"><Image src={item.image} alt={item.title} fill sizes="80px" className="object-contain p-2" /></div><div className="min-w-0 flex-1"><Link href={`/products/${item.productId}`} className="line-clamp-2 font-medium hover:text-primary">{item.title}</Link><p className="mt-1 text-sm text-muted-foreground">{formatCurrency(item.price)} por unidad</p><div className="mt-4 flex flex-wrap items-center justify-between gap-3"><div className="flex items-center rounded-lg border"><Button type="button" variant="ghost" size="icon" onClick={() => decreaseQuantity(item.productId)} aria-label={`Reducir cantidad de ${item.title}`}><Minus aria-hidden="true" /></Button><span className="min-w-9 text-center text-sm font-medium">{item.quantity}</span><Button type="button" variant="ghost" size="icon" onClick={() => increaseQuantity(item.productId)} aria-label={`Aumentar cantidad de ${item.title}`}><Plus aria-hidden="true" /></Button></div><div className="flex items-center gap-3"><p className="font-semibold">{formatCurrency(getCartItemSubtotal(item))}</p><Button type="button" variant="ghost" size="icon" onClick={() => removeItem(item.productId)} aria-label={`Eliminar ${item.title}`}><Trash2 className="text-destructive" aria-hidden="true" /></Button></div></div></div></article>)}</div></div><aside className="h-fit rounded-xl border bg-surface p-5"><h2 className="text-lg font-semibold">Resumen del pedido</h2><div className="mt-5 flex items-center justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>{formatCurrency(total)}</span></div><div className="mt-3 flex items-center justify-between border-t pt-3 text-lg font-semibold"><span>Total</span><span>{formatCurrency(total)}</span></div><Link href="/checkout" className={cn(buttonVariants({ className: "mt-6 w-full" }))}>Pagar</Link><p className="mt-3 text-center text-xs text-muted-foreground">Inicia sesión para completar tus datos de entrega.</p><Button type="button" variant="ghost" className="mt-2 w-full" onClick={clearCart}>Vaciar carrito</Button></aside></div>
}
