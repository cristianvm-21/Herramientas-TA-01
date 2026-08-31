import { describe, expect, it } from "vitest"

import { validateShippingDetails } from "@/lib/checkout/shipping"

describe("validación de datos de entrega", () => {
  it("acepta datos completos y elimina espacios adicionales", () => {
    const result = validateShippingDetails({
      firstName: " Ana ",
      lastName: " Pérez ",
      department: " Lima ",
      province: " Lima ",
      district: " Miraflores ",
      address: " Av. Principal 123 ",
    })

    expect(result.isValid).toBe(true)
    expect(result.fieldErrors).toEqual({})
    expect(result.values).toMatchObject({ firstName: "Ana", address: "Av. Principal 123" })
  })

  it("informa los campos obligatorios vacíos", () => {
    const result = validateShippingDetails({
      firstName: "",
      lastName: "",
      department: "",
      province: "",
      district: "",
      address: "",
    })

    expect(result.isValid).toBe(false)
    expect(Object.keys(result.fieldErrors)).toHaveLength(6)
  })

  it("considera inválidos los valores compuestos solo por espacios", () => {
    const result = validateShippingDetails({
      firstName: "   ",
      lastName: "Pérez",
      department: "Lima",
      province: "Lima",
      district: "Miraflores",
      address: "Av. Principal 123",
    })

    expect(result.isValid).toBe(false)
    expect(result.fieldErrors.firstName).toBe("Ingresa tu nombres.")
  })
})
