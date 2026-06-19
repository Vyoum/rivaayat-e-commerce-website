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

/** Strip variant suffix accidentally stored in legacy cart ids. */
export function getCartProductId(id: string) {
  const base = id.trim()
  const separator = base.indexOf("::")
  return separator === -1 ? base : base.slice(0, separator)
}

export function getCartProductHref(item: Pick<CartItem, "slug" | "id">) {
  const slug = item.slug?.trim()
  if (slug && !slug.includes("::") && !slug.includes("/")) {
    return `/products/${slug}`
  }
  return null
}

export function getCartOptionLabel(value?: string) {
  if (!value) return null
  const isPack = isFoodPackOption(value)
  return isPack ? "Pack" : "Size"
}

export function isFoodPackOption(value?: string) {
  if (!value) return false
  return /(\d+\s*(gm|g|kg|ml|l|pcs|pieces|box|boxes|pack|packs))/i.test(value)
}

export function formatCartQuantitySummary(size: string | undefined, quantity: number) {
  if (isFoodPackOption(size)) {
    const unit = quantity === 1 ? "box" : "boxes"
    return `${quantity} ${unit}`
  }
  return `Qty: ${quantity}`
}

export function normalizeCartItem(item: CartItem): CartItem {
  const productId = getCartProductId(item.id)
  let size = item.size?.trim() || undefined

  if (!size && item.id.includes("::")) {
    const legacySize = item.id.slice(item.id.indexOf("::") + 2).trim()
    if (legacySize) size = legacySize
  }

  const lineKey = item.lineKey || getCartLineKey(productId, size)
  const slug = item.slug?.trim() || ""

  return { ...item, id: productId, size, lineKey, slug }
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
