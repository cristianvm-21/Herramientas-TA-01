import { createBrowserClient } from "@supabase/ssr"

function getSupabaseBrowserConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!url || !publishableKey) {
    throw new Error("Falta la configuración pública de Supabase.")
  }

  return { url, publishableKey }
}

export function createClient() {
  const { url, publishableKey } = getSupabaseBrowserConfig()
  return createBrowserClient(url, publishableKey)
}
