import { describe, expect, it } from "vitest"

import { canTransitionOrderStatus, getNextOrderStatus, getOrderStatusLabel, isOrderStatus } from "@/lib/orders/status"

describe("estados de pedido", () => {
  it("traduce los estados para la interfaz", () => {
    expect(getOrderStatusLabel("pending")).toBe("Pendiente")
    expect(getOrderStatusLabel("shipped")).toBe("Enviado")
    expect(getOrderStatusLabel("delivered")).toBe("Entregado")
  })

  it("solo permite avanzar los estados en orden", () => {
    expect(getNextOrderStatus("pending")).toBe("shipped")
    expect(getNextOrderStatus("shipped")).toBe("delivered")
    expect(getNextOrderStatus("delivered")).toBeNull()
    expect(canTransitionOrderStatus("pending", "shipped")).toBe(true)
    expect(canTransitionOrderStatus("pending", "delivered")).toBe(false)
    expect(canTransitionOrderStatus("delivered", "pending")).toBe(false)
  })

  it("identifica los valores válidos de estado", () => {
    expect(isOrderStatus("pending")).toBe(true)
    expect(isOrderStatus("cancelled")).toBe(false)
  })
})
