import { UsersRound } from "lucide-react"

import { AdminNavigation } from "@/components/admin/admin-navigation"
import { AdminUsersList } from "@/components/admin/admin-users-list"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getAdminUsers, type AdminUser } from "@/lib/supabase/admin"

export default async function AdminUsersPage() {
  let users: AdminUser[] = []
  let hasLoadError = false

  try {
    users = await getAdminUsers()
  } catch {
    hasLoadError = true
  }

  return <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><div className="mb-6 flex items-center gap-3"><span className="grid size-10 place-items-center rounded-lg bg-primary text-primary-foreground"><UsersRound className="size-5" aria-hidden="true" /></span><div><h1 className="text-3xl font-semibold tracking-tight">Usuarios</h1><p className="mt-1 text-muted-foreground">Consulta las cuentas registradas en la tienda.</p></div></div><AdminNavigation active="users" />{hasLoadError ? <Alert className="border-destructive/30"><AlertTitle>No se pudieron cargar los usuarios</AlertTitle><AlertDescription>Inténtalo nuevamente en unos momentos.</AlertDescription></Alert> : <AdminUsersList users={users} />}</section>
}
