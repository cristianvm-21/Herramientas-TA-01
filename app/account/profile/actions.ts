"use server"

import { revalidatePath } from "next/cache"

import { requireUser } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

export type ProfileFormState = {
  message?: string
  success?: boolean
  fieldErrors?: Record<string, string>
}

function getOptionalValue(formData: FormData, field: string) {
  const value = String(formData.get(field) ?? "").trim()
  return value || null
}

export async function updateProfile(_: ProfileFormState, formData: FormData): Promise<ProfileFormState> {
  const user = await requireUser()
  const dni = getOptionalValue(formData, "dni")

  if (dni && !/^\d{8}$/.test(dni)) {
    return { fieldErrors: { dni: "El DNI debe contener exactamente 8 dígitos." } }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from("profiles")
    .update({
      first_name: getOptionalValue(formData, "firstName"),
      last_name: getOptionalValue(formData, "lastName"),
      dni,
      department: getOptionalValue(formData, "department"),
      province: getOptionalValue(formData, "province"),
      district: getOptionalValue(formData, "district"),
      address: getOptionalValue(formData, "address"),
    })
    .eq("id", user.id)

  if (error) {
    return { message: "No se pudo guardar tu perfil. Inténtalo nuevamente." }
  }

  revalidatePath("/account/profile")
  return { success: true, message: "Tu perfil se actualizó correctamente." }
}
