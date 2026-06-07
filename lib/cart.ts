import type { CatalogProduct } from "@/lib/category-catalog"

export type CartItem = {
  id: string
  name: string
  slug: string
  variant: string
  artisan: string
  price: number
  quantity: number
  image: string
  tag?: string
}

export function catalogProductToCartItem(product: CatalogProduct): CartItem {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    variant: product.location,
    artisan: product.artisan,
    price: product.price,
    quantity: 1,
    image: product.image,
    tag: product.badge,
  }
}

export function getCartItemCount(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.quantity, 0)
}
