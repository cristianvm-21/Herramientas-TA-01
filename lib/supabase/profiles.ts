import type { Profile, UserRole } from "@/types/profile"

export type ProfileRow = {
  id: string
  email: string
  role: UserRole
  first_name: string | null
  last_name: string | null
  dni: string | null
  department: string | null
  province: string | null
  district: string | null
  address: string | null
  created_at: string
  updated_at: string
}

export function toProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    email: row.email,
    role: row.role,
    firstName: row.first_name,
    lastName: row.last_name,
    dni: row.dni,
    department: row.department,
    province: row.province,
    district: row.district,
    address: row.address,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}
