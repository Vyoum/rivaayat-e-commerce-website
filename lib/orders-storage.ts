import type { ProfileOrder, ProfileOrderItem } from "@/types/profile"
import { formatCartItemVariantDetails } from "@/lib/cart"

export type StoredCheckoutItem = {
  id: string
  name: string
  slug: string
  variant: string
  artisan: string
  price: number
  quantity: number
  image: string
  size?: string
  color?: string
}

function getStorageKey(userId: string) {
  return `house-of-indika-orders-${userId}`
}

function formatOrderVariant(item: StoredCheckoutItem) {
  return formatCartItemVariantDetails(item)
}

export function checkoutItemsToOrderItems(items: StoredCheckoutItem[]): ProfileOrderItem[] {
  return items.map((item) => ({
    id: item.id,
    productName: item.name,
    variant: formatOrderVariant(item),
    quantity: item.quantity,
    unitPrice: item.price,
    image: item.image,
    artisan: item.artisan,
  }))
}

export function buildOrderFromCheckout(
  orderId: string,
  items: StoredCheckoutItem[],
  total: number,
  artisanTip: number,
  giftMessage?: string | null,
  promoCode?: string | null,
  discountAmount?: number,
): ProfileOrder {
  return {
    id: orderId,
    displayId: orderId,
    status: "Processing",
    paymentStatus: "paid",
    total,
    artisanTip,
    discountAmount: discountAmount ?? 0,
    promoCode: promoCode?.trim().toUpperCase() || null,
    giftMessage: giftMessage?.trim() || null,
    createdAt: new Date().toISOString(),
    items: checkoutItemsToOrderItems(items),
  }
}

export function getStoredOrders(userId: string | null): ProfileOrder[] {
  if (!userId || typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(getStorageKey(userId))
    if (!stored) return []
    return JSON.parse(stored) as ProfileOrder[]
  } catch {
    return []
  }
}

export function saveStoredOrder(userId: string, order: ProfileOrder) {
  if (typeof window === "undefined") return

  const existing = getStoredOrders(userId)
  const next = [order, ...existing.filter((entry) => entry.id !== order.id && entry.displayId !== order.displayId)]
  localStorage.setItem(getStorageKey(userId), JSON.stringify(next))
}

export function mergeProfileOrders(serverOrders: ProfileOrder[], localOrders: ProfileOrder[]) {
  const seen = new Set<string>()
  const merged: ProfileOrder[] = []

  for (const order of [...serverOrders, ...localOrders]) {
    const key = order.displayId || order.id
    if (seen.has(key)) continue
    seen.add(key)
    merged.push(order)
  }

  return merged.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}
