import Link from "next/link"
import { ClipboardList, LayoutDashboard, UsersRound } from "lucide-react"

import { cn } from "@/lib/utils"

type AdminNavigationProps = {
  active: "dashboard" | "orders" | "users"
}

const links = [
  { href: "/admin", label: "Resumen", icon: LayoutDashboard, value: "dashboard" },
  { href: "/admin/orders", label: "Pedidos", icon: ClipboardList, value: "orders" },
  { href: "/admin/users", label: "Usuarios", icon: UsersRound, value: "users" },
] as const

export function AdminNavigation({ active }: AdminNavigationProps) {
  return (
    <nav className="mb-8 flex flex-wrap gap-2" aria-label="Navegación administrativa">
      {links.map((link) => {
        const Icon = link.icon
        const isActive = link.value === active

        return <Link key={link.href} href={link.href} aria-current={isActive ? "page" : undefined} className={cn("inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors", isActive ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:bg-muted")}><Icon className="size-4" aria-hidden="true" />{link.label}</Link>
      })}
    </nav>
  )
}
