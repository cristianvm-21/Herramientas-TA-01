import { api } from "@/lib/api/axios"
import type { Product } from "@/types/product"

function isProduct(value: unknown): value is Product {
  if (typeof value !== "object" || value === null) {
    return false
  }

  const product = value as Record<string, unknown>
  return (
    typeof product.id === "number" &&
    typeof product.title === "string" &&
    typeof product.price === "number" &&
    typeof product.description === "string" &&
    typeof product.category === "string" &&
    typeof product.image === "string" &&
    typeof product.rating === "object" &&
    product.rating !== null
  )
}

export async function getProducts() {
  const { data } = await api.get<unknown>("/products")

  if (!Array.isArray(data) || !data.every(isProduct)) {
    throw new Error("Respuesta de catálogo no válida")
  }

  return data
}

export async function getProductById(id: number) {
  const { data } = await api.get<unknown>(`/products/${id}`)

  if (!isProduct(data)) {
    throw new Error("Respuesta de producto no válida")
  }

  return data
}

export async function getCategories() {
  const { data } = await api.get<unknown>("/products/categories")

  if (!Array.isArray(data) || !data.every((category) => typeof category === "string")) {
    throw new Error("Respuesta de categorías no válida")
  }

  return data
}

export async function getProductsByCategory(category: string) {
  const { data } = await api.get<unknown>(`/products/category/${encodeURIComponent(category)}`)

  if (!Array.isArray(data) || !data.every(isProduct)) {
    throw new Error("Respuesta de catálogo no válida")
  }

  return data
}
