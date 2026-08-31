export function getSafeNextPath(value: string | null | undefined, fallback = "/") {
  if (!value || !value.startsWith("/")) {
    return fallback
  }

  try {
    const safeOrigin = "https://online-store.local"
    const destination = new URL(value, safeOrigin)

    if (destination.origin !== safeOrigin) {
      return fallback
    }

    return `${destination.pathname}${destination.search}${destination.hash}`
  } catch {
    return fallback
  }
}
