import type { UserRole } from "@/types/profile"

export function isAdminRole(role: UserRole | null | undefined) {
  return role === "admin"
}
