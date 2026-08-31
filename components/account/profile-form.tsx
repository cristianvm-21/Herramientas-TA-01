"use client"

import { useActionState } from "react"

import { updateProfile, type ProfileFormState } from "@/app/account/profile/actions"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Profile } from "@/types/profile"

const initialState: ProfileFormState = {}

export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, formAction, isPending] = useActionState(updateProfile, initialState)

  return (
    <form action={formAction} className="space-y-6">
      {state.message && (
        <Alert className={state.success ? "border-success/30" : "border-destructive/30"}>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      <section className="space-y-4">
        <div>
          <h2 className="font-semibold">Información de cuenta</h2>
          <p className="mt-1 text-sm text-muted-foreground">El correo y el rol se administran desde tu cuenta de Supabase.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Correo electrónico"><Input value={profile.email} disabled /></Field>
          <Field label="Rol"><Input value={profile.role === "admin" ? "Administrador" : "Cliente"} disabled /></Field>
        </div>
      </section>

      <section className="space-y-4 border-t pt-6">
        <div>
          <h2 className="font-semibold">Datos personales</h2>
          <p className="mt-1 text-sm text-muted-foreground">Completa los datos que se usarán para la entrega de tus pedidos.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nombres" htmlFor="firstName"><Input id="firstName" name="firstName" defaultValue={profile.firstName ?? ""} /></Field>
          <Field label="Apellidos" htmlFor="lastName"><Input id="lastName" name="lastName" defaultValue={profile.lastName ?? ""} /></Field>
          <Field label="DNI" htmlFor="dni"><Input id="dni" name="dni" inputMode="numeric" maxLength={8} defaultValue={profile.dni ?? ""} aria-invalid={Boolean(state.fieldErrors?.dni)} /></Field>
          <div className="hidden sm:block" />
          <Field label="Departamento" htmlFor="department"><Input id="department" name="department" defaultValue={profile.department ?? ""} /></Field>
          <Field label="Provincia" htmlFor="province"><Input id="province" name="province" defaultValue={profile.province ?? ""} /></Field>
          <Field label="Distrito" htmlFor="district"><Input id="district" name="district" defaultValue={profile.district ?? ""} /></Field>
          <Field label="Dirección" htmlFor="address"><Input id="address" name="address" defaultValue={profile.address ?? ""} /></Field>
        </div>
        {state.fieldErrors?.dni && <p className="text-sm text-destructive">{state.fieldErrors.dni}</p>}
      </section>

      <Button type="submit" disabled={isPending}>{isPending ? "Guardando..." : "Guardar cambios"}</Button>
    </form>
  )
}

function Field({ label, htmlFor, children }: { label: string; htmlFor?: string; children: React.ReactNode }) {
  return <div className="space-y-2"><label htmlFor={htmlFor} className="text-sm font-medium">{label}</label>{children}</div>
}
