export type UserRole = "customer" | "admin"

export type Profile = {
  id: string
  email: string
  role: UserRole
  firstName: string | null
  lastName: string | null
  dni: string | null
  department: string | null
  province: string | null
  district: string | null
  address: string | null
  createdAt: string
  updatedAt: string
}
