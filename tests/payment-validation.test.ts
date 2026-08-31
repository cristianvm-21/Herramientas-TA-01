import { describe, expect, it } from "vitest"

import { validatePaymentDetails } from "@/lib/payment/validation"

const now = new Date(2026, 7, 30)

describe("validación de pago simulado", () => {
  it("acepta una tarjeta válida y normaliza espacios", () => {
    const result = validatePaymentDetails({
      cardholderName: " Ana Pérez ",
      cardNumber: "4242 4242 4242 4242",
      expirationDate: "08/26",
      cvv: "123",
    }, now)

    expect(result.isValid).toBe(true)
    expect(result.values.cardNumber).toBe("4242424242424242")
  })

  it("rechaza tarjeta, fecha y CVV inválidos", () => {
    const result = validatePaymentDetails({
      cardholderName: "A",
      cardNumber: "123",
      expirationDate: "07/26",
      cvv: "12",
    }, now)

    expect(result.isValid).toBe(false)
    expect(Object.keys(result.fieldErrors)).toHaveLength(4)
  })
})
