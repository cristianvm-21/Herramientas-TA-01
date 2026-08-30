import { NextResponse } from "next/server"

import { createClient } from "@/lib/supabase/server"

function getSafeNextPath(next: string | null) {
  return next?.startsWith("/") && !next.startsWith("//") ? next : "/"
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(new URL(getSafeNextPath(url.searchParams.get("next")), url.origin))
}
