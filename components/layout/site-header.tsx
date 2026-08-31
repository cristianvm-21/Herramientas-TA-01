"use client"

import Link from "next/link"
import { LogIn, LogOut, Menu, ShoppingBag, Store, UserRound, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"

import { Button, buttonVariants } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { getCartQuantity, useCartStore } from "@/stores/cart-store"
import siteConfig from "@/site.config.mjs"

const links = [
  { href: "/", label: "Inicio" },
  { href: "/products", label: "Productos" },
]

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const itemCount = useCartStore((state) => getCartQuantity(state.items))
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    void supabase.auth.getUser().then(({ data }) => setUser(data.user))

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      router.refresh()
    })

    return () => authListener.subscription.unsubscribe()
  }, [router])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setIsOpen(false)
    router.push("/")
    router.refresh()
  }

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
          {user ? (
            <>
              <Link href="/account/profile" className={cn(buttonVariants({ variant: "ghost" }), "hidden sm:inline-flex")}>
                <UserRound aria-hidden="true" />
                Mi cuenta
              </Link>
              <Button type="button" variant="ghost" className="hidden sm:inline-flex" onClick={handleSignOut}>
                <LogOut aria-hidden="true" />
                Cerrar sesión
              </Button>
            </>
          ) : (
            <Link href="/login" className={cn(buttonVariants({ variant: "ghost" }), "hidden sm:inline-flex")}>
              <LogIn aria-hidden="true" />
              Ingresar
            </Link>
          )}
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
          {user ? (
            <>
              <Link href="/account/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted">
                <UserRound className="size-4" aria-hidden="true" />
                Mi cuenta
              </Link>
              <Button type="button" variant="ghost" className="justify-start" onClick={handleSignOut}>
                <LogOut aria-hidden="true" />
                Cerrar sesión
              </Button>
            </>
          ) : (
            <Link href="/login" onClick={() => setIsOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted">
              <LogIn className="size-4" aria-hidden="true" />
              Ingresar
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}
