import { describe, expect, it } from "vitest"

import { getOrderStatusLabel } from "@/lib/orders/status"

describe("estados de pedido", () => {
  it("traduce los estados para la interfaz", () => {
    expect(getOrderStatusLabel("pending")).toBe("Pendiente")
    expect(getOrderStatusLabel("shipped")).toBe("Enviado")
    expect(getOrderStatusLabel("delivered")).toBe("Entregado")
  })
})
