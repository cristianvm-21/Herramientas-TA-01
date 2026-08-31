"use server"

import { revalidatePath } from "next/cache"

import { requireUser } from "@/lib/auth"
import { shippingFields, validateShippingDetails, type ShippingField } from "@/lib/checkout/shipping"
import { createClient } from "@/lib/supabase/server"

export type CheckoutShippingFormState = {
  message?: string
  success?: boolean
  fieldErrors?: Partial<Record<ShippingField, string>>
}

export async function saveCheckoutShippingDetails(
  _: CheckoutShippingFormState,
  formData: FormData
): Promise<CheckoutShippingFormState> {
  const user = await requireUser("/checkout")
  const validation = validateShippingDetails(
    Object.fromEntries(
      shippingFields.map((field) => [field, String(formData.get(field) ?? "")])
    )
  )

  if (!validation.isValid) {
    return { fieldErrors: validation.fieldErrors }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from("profiles")
    .update({
      first_name: validation.values.firstName,
      last_name: validation.values.lastName,
      department: validation.values.department,
      province: validation.values.province,
      district: validation.values.district,
      address: validation.values.address,
    })
    .eq("id", user.id)
    .select("id")
    .single()

  if (error) {
    return { message: "No se pudieron guardar los datos de entrega. Inténtalo nuevamente." }
  }

  revalidatePath("/checkout")
  revalidatePath("/account/profile")

  return { success: true, message: "Tus datos de entrega se guardaron correctamente." }
}
