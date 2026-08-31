import { NextResponse } from "next/server"

import { getSafeNextPath } from "@/lib/auth-redirect"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(new URL(getSafeNextPath(url.searchParams.get("next")), url.origin))
}
