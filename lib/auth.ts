import { cache } from "react"
import { redirect } from "next/navigation"

import { getSafeNextPath } from "@/lib/auth-redirect"
import { isAdminRole } from "@/lib/roles"
import { createClient } from "@/lib/supabase/server"
import type { UserRole } from "@/types/profile"

export const getCurrentUser = cache(async () => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user
})

export async function requireUser(nextPath?: string) {
  const user = await getCurrentUser()

  if (!user) {
    redirect(nextPath ? `/login?next=${encodeURIComponent(getSafeNextPath(nextPath))}` : "/login")
  }

  return user
}

export async function requireAdmin(nextPath = "/admin") {
  const user = await requireUser(nextPath)
  const supabase = await createClient()
  const { data } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle()
  const role = (data as { role?: UserRole } | null)?.role

  if (!isAdminRole(role)) {
    redirect("/")
  }

  return user
}
