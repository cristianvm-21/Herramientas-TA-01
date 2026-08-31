import { cache } from "react"
import { redirect } from "next/navigation"

import { getSafeNextPath } from "@/lib/auth-redirect"
import { createClient } from "@/lib/supabase/server"

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
