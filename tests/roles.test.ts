import { describe, expect, it } from "vitest"

import { isAdminRole } from "@/lib/roles"

describe("roles", () => {
  it("identifica exclusivamente al administrador", () => {
    expect(isAdminRole("admin")).toBe(true)
    expect(isAdminRole("customer")).toBe(false)
    expect(isAdminRole(null)).toBe(false)
  })
})
