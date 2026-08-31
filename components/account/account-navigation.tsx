import Link from "next/link"
import { ClipboardList, UserRound } from "lucide-react"

import { cn } from "@/lib/utils"

type AccountNavigationProps = {
  active: "profile" | "orders"
  showOrders?: boolean
}

const links = [
  { href: "/account/profile", label: "Mi perfil", icon: UserRound, value: "profile" },
  { href: "/account/orders", label: "Mis pedidos", icon: ClipboardList, value: "orders" },
] as const

export function AccountNavigation({ active, showOrders = true }: AccountNavigationProps) {
  return (
    <nav className="mb-6 flex flex-wrap gap-2" aria-label="Navegación de mi cuenta">
      {links.filter((link) => showOrders || link.value !== "orders").map((link) => {
        const Icon = link.icon
        const isActive = link.value === active

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors",
              isActive ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:bg-muted"
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
