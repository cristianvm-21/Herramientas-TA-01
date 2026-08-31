"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { getSafeNextPath } from "@/lib/auth-redirect"
import { createClient } from "@/lib/supabase/server"

export type AuthFormState = {
  fieldErrors?: {
    email?: string
    password?: string
    confirmPassword?: string
  }
  message?: string
}

function getCredentials(formData: FormData, includesConfirmation: boolean) {
  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")
  const confirmPassword = String(formData.get("confirmPassword") ?? "")
  const fieldErrors: NonNullable<AuthFormState["fieldErrors"]> = {}

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    fieldErrors.email = "Ingresa un correo electrónico válido."
  }

  if (password.length < 8) {
    fieldErrors.password = "La contraseña debe tener al menos 8 caracteres."
  }

  if (includesConfirmation && password !== confirmPassword) {
    fieldErrors.confirmPassword = "Las contraseñas no coinciden."
  }

  return { email, password, fieldErrors }
}

async function getCallbackUrl(nextPath: string) {
  const requestHeaders = await headers()
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host")
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http"

  return host ? `${protocol}://${host}/auth/callback?next=${encodeURIComponent(nextPath)}` : undefined
}

export async function signIn(_: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const { email, password, fieldErrors } = getCredentials(formData, false)
  const nextPath = getSafeNextPath(String(formData.get("next") ?? ""))

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { message: "Correo o contraseña incorrectos." }
  }

  redirect(nextPath)
}

export async function signUp(_: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const { email, password, fieldErrors } = getCredentials(formData, true)
  const nextPath = getSafeNextPath(String(formData.get("next") ?? ""))

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: await getCallbackUrl(nextPath) },
  })

  if (error) {
    return { message: "No se pudo crear la cuenta. Inténtalo nuevamente." }
  }

  if (data.session) {
    redirect(nextPath)
  }

  return { message: "Revisa tu correo para confirmar tu cuenta antes de iniciar sesión." }
}
