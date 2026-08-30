export type CartItem = {
  productId: number
  title: string
  image: string
  price: number
  quantity: number
}

export type CartProduct = Pick<CartItem, "productId" | "title" | "image" | "price">
