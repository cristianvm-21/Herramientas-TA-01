export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatCategory(category: string) {
  return category.replace(/\b\w/g, (letter) => letter.toUpperCase())
}
