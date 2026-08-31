export const shippingFields = [
  "firstName",
  "lastName",
  "department",
  "province",
  "district",
  "address",
] as const

export type ShippingField = (typeof shippingFields)[number]

export type ShippingDetails = Record<ShippingField, string>

export type ShippingValidationResult = {
  values: ShippingDetails
  fieldErrors: Partial<Record<ShippingField, string>>
  isValid: boolean
}

const fieldLabels: Record<ShippingField, string> = {
  firstName: "nombres",
  lastName: "apellidos",
  department: "departamento",
  province: "provincia",
  district: "distrito",
  address: "dirección",
}

export function getEmptyShippingDetails(): ShippingDetails {
  return {
    firstName: "",
    lastName: "",
    department: "",
    province: "",
    district: "",
    address: "",
  }
}

export function validateShippingDetails(
  input: Partial<Record<ShippingField, string | null | undefined>>
): ShippingValidationResult {
  const values = getEmptyShippingDetails()
  const fieldErrors: Partial<Record<ShippingField, string>> = {}

  for (const field of shippingFields) {
    const value = input[field]?.trim() ?? ""
    values[field] = value

    if (!value) {
      fieldErrors[field] = `Ingresa tu ${fieldLabels[field]}.`
    }
  }

  return {
    values,
    fieldErrors,
    isValid: Object.keys(fieldErrors).length === 0,
  }
}
