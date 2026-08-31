import { UserRound } from "lucide-react"

import { ProfileForm } from "@/components/account/profile-form"
import { AccountNavigation } from "@/components/account/account-navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { requireUser } from "@/lib/auth"
import { toProfile, type ProfileRow } from "@/lib/supabase/profiles"
import { createClient } from "@/lib/supabase/server"

export default async function ProfilePage() {
  const user = await requireUser()
  const supabase = await createClient()
  const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (error || !data) {
    return <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8"><Alert className="border-destructive/30"><AlertTitle>No se pudo cargar tu perfil</AlertTitle><AlertDescription>Confirma que tu perfil fue creado correctamente al registrarte.</AlertDescription></Alert></section>
  }

  const profile = toProfile(data as ProfileRow)
  return (
    <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center gap-3"><span className="grid size-10 place-items-center rounded-lg bg-primary text-primary-foreground"><UserRound className="size-5" aria-hidden="true" /></span><div><h1 className="text-3xl font-semibold tracking-tight">Mi perfil</h1><p className="mt-1 text-muted-foreground">Gestiona tus datos personales y de entrega.</p></div></div>
      <AccountNavigation active="profile" />
      <Card><CardHeader><CardTitle>Datos personales</CardTitle></CardHeader><CardContent><ProfileForm profile={profile} /></CardContent></Card>
    </section>
  )
}
