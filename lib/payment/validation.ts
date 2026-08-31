export const paymentFields = ["cardholderName", "cardNumber", "expirationDate", "cvv"] as const

export type PaymentField = (typeof paymentFields)[number]

export type PaymentDetails = Record<PaymentField, string>

export type PaymentValidationResult = {
  values: PaymentDetails
  fieldErrors: Partial<Record<PaymentField, string>>
  isValid: boolean
}

export function getEmptyPaymentDetails(): PaymentDetails {
  return {
    cardholderName: "",
    cardNumber: "",
    expirationDate: "",
    cvv: "",
  }
}

export function validatePaymentDetails(input: PaymentDetails, now = new Date()): PaymentValidationResult {
  const values: PaymentDetails = {
    cardholderName: input.cardholderName.trim(),
    cardNumber: input.cardNumber.replace(/\s/g, ""),
    expirationDate: input.expirationDate.trim(),
    cvv: input.cvv.trim(),
  }
  const fieldErrors: Partial<Record<PaymentField, string>> = {}

  if (values.cardholderName.length < 3) {
    fieldErrors.cardholderName = "Ingresa el nombre del titular." 
  }

  if (!/^\d{16}$/.test(values.cardNumber)) {
    fieldErrors.cardNumber = "El número de tarjeta debe contener 16 dígitos."
  }

  const expirationMatch = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(values.expirationDate)
  if (!expirationMatch) {
    fieldErrors.expirationDate = "Usa el formato MM/AA."
  } else {
    const month = Number(expirationMatch[1])
    const year = 2000 + Number(expirationMatch[2])
    const isExpired = year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1)

    if (isExpired) {
      fieldErrors.expirationDate = "La tarjeta está vencida."
    }
  }

  if (!/^\d{3,4}$/.test(values.cvv)) {
    fieldErrors.cvv = "El CVV debe contener 3 o 4 dígitos."
  }

  return {
    values,
    fieldErrors,
    isValid: Object.keys(fieldErrors).length === 0,
  }
}
