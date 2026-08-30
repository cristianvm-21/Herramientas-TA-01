import axios from "axios"

export const api = axios.create({
  baseURL: "https://fakestoreapi.com",
  timeout: 10_000,
})

export function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (error.code === "ECONNABORTED") {
      return "La conexión tardó demasiado. Inténtalo nuevamente."
    }

    if (error.response?.status === 404) {
      return "No encontramos el producto solicitado."
    }
  }

  return "No se pudo cargar la información. Inténtalo nuevamente más tarde."
}
