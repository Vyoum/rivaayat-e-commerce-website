"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import type { CatalogProduct } from "@/lib/category-catalog"
import {
  catalogProductToCartItem,
  getCartItemCount,
  getCartLineKey,
  normalizeCartItem,
  type CartItem,
} from "@/lib/cart"
import { showAddedToCollectionToast } from "@/lib/cart-toast"

type AddItemOptions = {
  quantity?: number
  silent?: boolean
  size?: string
  color?: string
  image?: string
  unitPrice?: number
}

const STORAGE_KEY = "house-of-indika-cart"

type CartContextValue = {
  items: CartItem[]
  itemCount: number
  addItem: (product: CatalogProduct, options?: AddItemOptions) => void
  updateQuantity: (lineKey: string, quantity: number) => void
  removeItem: (lineKey: string) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as CartItem[]
        setItems(parsed.map((item) => normalizeCartItem(item)))
      }
    } catch {
      // Ignore invalid stored cart data.
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items, hydrated])

  const addItem = useCallback((product: CatalogProduct, options?: AddItemOptions) => {
    const quantity = Math.max(1, options?.quantity ?? 1)
    const size = options?.size?.trim() || undefined
    const color = options?.color?.trim() || undefined
    const image = options?.image?.trim() || undefined
    const unitPrice = options?.unitPrice
    const lineKey = getCartLineKey(product.id, { size, color })

    setItems((prev) => {
      const existing = prev.find((item) => item.lineKey === lineKey)
      if (existing) {
        return prev.map((item) =>
          item.lineKey === lineKey
            ? { ...item, quantity: item.quantity + quantity, ...(image ? { image } : {}) }
            : item,
        )
      }
      return [
        normalizeCartItem({
          ...catalogProductToCartItem(product, { size, color, image, unitPrice }),
          quantity,
        }),
        ...prev,
      ]
    })

    if (!options?.silent) {
      showAddedToCollectionToast(product.name, quantity)
    }
  }, [])

  const updateQuantity = useCallback((lineKey: string, quantity: number) => {
    if (quantity < 1) return
    setItems((prev) =>
      prev.map((item) => (item.lineKey === lineKey ? { ...item, quantity } : item)),
    )
  }, [])

  const removeItem = useCallback((lineKey: string) => {
    setItems((prev) => prev.filter((item) => item.lineKey !== lineKey))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const value = useMemo(
    () => ({
      items,
      itemCount: getCartItemCount(items),
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [items, addItem, updateQuantity, removeItem, clearCart],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within CartProvider")
  }
  return context
}
