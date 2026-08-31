import { UserRoundPlus } from "lucide-react"

import { AuthForm } from "@/components/auth/auth-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import siteConfig from "@/site.config.mjs"

type RegisterPageProps = {
  searchParams: Promise<{ next?: string }>
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const { next } = await searchParams

  return (
    <section className="mx-auto grid min-h-[calc(100svh-8rem)] max-w-md place-items-center px-4 py-10 sm:px-6">
      <Card className="w-full">
        <CardHeader className="items-center text-center">
          <span className="grid size-10 place-items-center rounded-lg bg-primary text-primary-foreground"><UserRoundPlus className="size-5" aria-hidden="true" /></span>
          <CardTitle className="mt-2 text-2xl">Crear cuenta</CardTitle>
          <CardDescription>Regístrate para continuar en {siteConfig.name}.</CardDescription>
        </CardHeader>
        <CardContent><AuthForm mode="register" nextPath={next} /></CardContent>
      </Card>
    </section>
  )
}
