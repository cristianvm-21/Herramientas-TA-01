import { UsersRound } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import type { AdminUser } from "@/lib/supabase/admin"

export function AdminUsersList({ users }: { users: AdminUser[] }) {
  if (users.length === 0) {
    return <div className="grid min-h-64 place-items-center rounded-xl border border-dashed bg-surface p-8 text-center"><div><UsersRound className="mx-auto mb-3 size-9 text-muted-foreground" aria-hidden="true" /><h2 className="text-lg font-semibold">No hay usuarios registrados</h2></div></div>
  }

  return <div className="space-y-4">{users.map((user) => <Card key={user.id}><CardContent className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-5"><div><p className="text-xs text-muted-foreground">Nombre</p><p className="mt-1 font-medium">{[user.firstName, user.lastName].filter(Boolean).join(" ") || "Sin completar"}</p></div><div><p className="text-xs text-muted-foreground">Correo</p><p className="mt-1 break-all font-medium">{user.email}</p></div><div><p className="text-xs text-muted-foreground">DNI</p><p className="mt-1 font-medium">{user.dni ?? "Sin completar"}</p></div><div><p className="text-xs text-muted-foreground">Registro</p><p className="mt-1 font-medium">{new Intl.DateTimeFormat("es-PE", { dateStyle: "medium" }).format(new Date(user.createdAt))}</p></div><div><p className="text-xs text-muted-foreground">Rol</p><p className="mt-1 font-medium">{user.role === "admin" ? "Administrador" : "Cliente"}</p></div></CardContent></Card>)}</div>
}
