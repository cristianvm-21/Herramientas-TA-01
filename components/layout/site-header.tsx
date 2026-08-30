"use client"

import Link from "next/link"
import { Menu, ShoppingBag, Store, X } from "lucide-react"
import { useState } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getCartQuantity, useCartStore } from "@/stores/cart-store"
import siteConfig from "@/site.config.mjs"

const links = [
  { href: "/", label: "Inicio" },
  { href: "/products", label: "Productos" },
]

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const itemCount = useCartStore((state) => getCartQuantity(state.items))

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold" onClick={() => setIsOpen(false)}>
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Store className="size-4" aria-hidden="true" />
          </span>
          {siteConfig.name}
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navegación principal">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/cart" aria-label={`Carrito, ${itemCount} productos`} className={cn(buttonVariants({ variant: "outline" }), "relative")}>
              <ShoppingBag aria-hidden="true" />
              <span className="hidden sm:inline">Carrito</span>
              {itemCount > 0 && (
                <span className="absolute -right-2 -top-2 grid size-5 place-items-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
          </Link>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen((open) => !open)}
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </Button>
        </div>
      </div>
      <nav
        className={cn("border-t px-4 py-3 md:hidden", isOpen ? "block" : "hidden")}
        aria-label="Navegación móvil"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-1">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className="rounded-lg px-3 py-2 text-sm hover:bg-muted">
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}
