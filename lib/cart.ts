import type { CatalogProduct } from "@/lib/category-catalog"

export type CartItem = {
  id: string
  lineKey: string
  name: string
  slug: string
  variant: string
  artisan: string
  price: number
  quantity: number
  image: string
  tag?: string
  size?: string
}

export function getCartLineKey(id: string, size?: string) {
  return size ? `${id}::${size}` : id
}

export function normalizeCartItem(item: CartItem): CartItem {
  const size = item.size?.trim() || undefined
  const lineKey = item.lineKey || getCartLineKey(item.id, size)
  return { ...item, size, lineKey }
}

export function catalogProductToCartItem(
  product: CatalogProduct,
  options?: { size?: string },
): CartItem {
  const size = options?.size?.trim() || undefined

  return {
    id: product.id,
    lineKey: getCartLineKey(product.id, size),
    name: product.name,
    slug: product.slug,
    variant: product.location,
    artisan: product.artisan,
    price: product.price,
    quantity: 1,
    image: product.image,
    tag: product.badge,
    size,
  }
}

export function getCartItemCount(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.quantity, 0)
}
