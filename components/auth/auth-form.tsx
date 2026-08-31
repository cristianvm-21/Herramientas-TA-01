"use client"

import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { useActionState, useState } from "react"

import { signIn, signUp, type AuthFormState } from "@/app/auth/actions"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type AuthMode = "login" | "register"

const initialState: AuthFormState = {}

type AuthFormProps = {
  mode: AuthMode
  nextPath?: string
}

export function AuthForm({ mode, nextPath = "/" }: AuthFormProps) {
  const isRegister = mode === "register"
  const [state, formAction, isPending] = useActionState(isRegister ? signUp : signIn, initialState)
  const alternatePath = isRegister ? "/login" : "/register"
  const alternateHref = `${alternatePath}?next=${encodeURIComponent(nextPath)}`

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <input type="hidden" name="next" value={nextPath} />
      {state.message && (
        <Alert className="border-primary/30 bg-primary/5">
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">Correo electrónico</label>
        <Input id="email" name="email" type="email" autoComplete="email" placeholder="tu@correo.com" aria-invalid={Boolean(state.fieldErrors?.email)} required />
        {state.fieldErrors?.email && <p className="text-sm text-destructive">{state.fieldErrors.email}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">Contraseña</label>
        <PasswordField id="password" name="password" autoComplete={isRegister ? "new-password" : "current-password"} hasError={Boolean(state.fieldErrors?.password)} />
        {isRegister && <p className="text-xs text-muted-foreground">Usa al menos 8 caracteres.</p>}
        {state.fieldErrors?.password && <p className="text-sm text-destructive">{state.fieldErrors.password}</p>}
      </div>

      {isRegister && (
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium">Confirmar contraseña</label>
          <PasswordField id="confirmPassword" name="confirmPassword" autoComplete="new-password" hasError={Boolean(state.fieldErrors?.confirmPassword)} />
          {state.fieldErrors?.confirmPassword && <p className="text-sm text-destructive">{state.fieldErrors.confirmPassword}</p>}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Procesando..." : isRegister ? "Crear cuenta" : "Iniciar sesión"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {isRegister ? "¿Ya tienes una cuenta?" : "¿Aún no tienes una cuenta?"}{" "}
        <Link href={alternateHref} className="font-medium text-primary hover:underline">
          {isRegister ? "Inicia sesión" : "Regístrate"}
        </Link>
      </p>
    </form>
  )
}

type PasswordFieldProps = {
  id: string
  name: string
  autoComplete: "current-password" | "new-password"
  hasError: boolean
}

function PasswordField({ id, name, autoComplete, hasError }: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="relative">
      <Input id={id} name={name} type={isVisible ? "text" : "password"} autoComplete={autoComplete} aria-invalid={hasError} className="pr-10" required />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute top-1/2 right-1 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        onClick={() => setIsVisible((visible) => !visible)}
        aria-label={isVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
      >
        {isVisible ? <Eye aria-hidden="true" /> : <EyeOff aria-hidden="true" />}
      </Button>
    </div>
  )
}
