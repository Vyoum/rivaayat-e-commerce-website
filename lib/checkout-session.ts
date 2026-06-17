import type { AppliedPromo } from "@/types/discount-code"

export type CheckoutSession = {
  selectedTip: number
  appliedPromo: AppliedPromo | null
  giftMessage: string | null
}

const STORAGE_KEY = "house-of-indika-checkout"

export function saveCheckoutSession(data: CheckoutSession) {
  if (typeof window === "undefined") return
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function loadCheckoutSession(): CheckoutSession | null {
  if (typeof window === "undefined") return null
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as CheckoutSession
  } catch {
    return null
  }
}

export function clearCheckoutSession() {
  if (typeof window === "undefined") return
  sessionStorage.removeItem(STORAGE_KEY)
}

export const DEFAULT_CHECKOUT_SESSION: CheckoutSession = {
  selectedTip: 0,
  appliedPromo: null,
  giftMessage: null,
}
