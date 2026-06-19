import type { CatalogProduct } from "@/lib/category-catalog"

export type CartVariantOptions = {
  size?: string
  color?: string
  image?: string
}

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
  color?: string
}

export function getCartLineKey(id: string, options?: CartVariantOptions | string): string {
  const productId = getCartProductId(id)

  if (typeof options === "string") {
    const size = options.trim()
    return size ? `${productId}::${size}` : productId
  }

  const size = options?.size?.trim()
  const color = options?.color?.trim()

  if (!size && !color) return productId
  if (size && color) return `${productId}::${size}::color:${color}`
  if (size) return `${productId}::${size}`
  return `${productId}::color:${color}`
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

export function formatCartItemVariantDetails(item: {
  variant: string
  size?: string
  color?: string
}) {
  const parts: string[] = []
  if (item.variant) parts.push(item.variant)
  if (item.color) parts.push(`Color ${item.color}`)
  if (item.size) {
    parts.push(`${getCartOptionLabel(item.size) ?? "Option"} ${item.size}`)
  }
  return parts.join(" · ")
}

function parseLegacyLineKey(lineKey: string) {
  const segments = lineKey.split("::")
  let size: string | undefined
  let color: string | undefined

  for (let i = 1; i < segments.length; i++) {
    const segment = segments[i]?.trim()
    if (!segment) continue
    if (segment.startsWith("color:")) {
      color = segment.slice(6).trim() || undefined
      continue
    }
    if (!size) {
      size = segment
      continue
    }
    if (!color) color = segment
  }

  return { size, color }
}

export function normalizeCartItem(item: CartItem): CartItem {
  const productId = getCartProductId(item.id)
  let size = item.size?.trim() || undefined
  let color = item.color?.trim() || undefined

  if (item.lineKey?.includes("::")) {
    const parsed = parseLegacyLineKey(item.lineKey)
    if (!size && parsed.size) size = parsed.size
    if (!color && parsed.color) color = parsed.color
  } else if (!size && item.id.includes("::")) {
    const legacySize = item.id.slice(item.id.indexOf("::") + 2).trim()
    if (legacySize && !legacySize.startsWith("color:")) size = legacySize
  }

  const lineKey = item.lineKey || getCartLineKey(productId, { size, color })
  const slug = item.slug?.trim() || ""

  return { ...item, id: productId, size, color, lineKey, slug }
}

export function catalogProductToCartItem(
  product: CatalogProduct,
  options?: CartVariantOptions,
): CartItem {
  const size = options?.size?.trim() || undefined
  const color = options?.color?.trim() || undefined
  const image = options?.image?.trim() || product.image

  return {
    id: product.id,
    lineKey: getCartLineKey(product.id, { size, color }),
    name: product.name,
    slug: product.slug,
    variant: product.location,
    artisan: product.artisan,
    price: product.price,
    quantity: 1,
    image,
    tag: product.badge,
    size,
    color,
  }
}

export function getCartItemCount(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.quantity, 0)
}
