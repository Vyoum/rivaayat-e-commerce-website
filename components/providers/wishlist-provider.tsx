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

import { useAuth } from "@/hooks/use-auth"
import type { CatalogProduct } from "@/lib/category-catalog"
import {
  catalogProductToWishlistItem,
  type WishlistItem,
} from "@/lib/wishlist"

function getStorageKey(userId: string) {
  return `house-of-indika-wishlist-${userId}`
}

type WishlistContextValue = {
  items: WishlistItem[]
  itemCount: number
  isLoggedIn: boolean
  isWishlisted: (productId: string) => boolean
  toggleItem: (product: CatalogProduct) => boolean
  removeItem: (productId: string) => void
}

const WishlistContext = createContext<WishlistContextValue | null>(null)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { userId, isLoggedIn } = useAuth()
  const [items, setItems] = useState<WishlistItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    if (!userId) {
      setItems([])
      setHydrated(true)
      return
    }

    try {
      const stored = localStorage.getItem(getStorageKey(userId))
      if (stored) {
        setItems(JSON.parse(stored) as WishlistItem[])
      } else {
        setItems([])
      }
    } catch {
      setItems([])
    }
    setHydrated(true)
  }, [userId])

  useEffect(() => {
    if (!hydrated || !userId) return
    localStorage.setItem(getStorageKey(userId), JSON.stringify(items))
  }, [items, hydrated, userId])

  const isWishlisted = useCallback(
    (productId: string) => items.some((item) => item.id === productId),
    [items],
  )

  const toggleItem = useCallback(
    (product: CatalogProduct) => {
      if (!userId) return false

      const exists = items.some((item) => item.id === product.id)
      if (exists) {
        setItems((prev) => prev.filter((item) => item.id !== product.id))
        return false
      }
      setItems((prev) => [...prev, catalogProductToWishlistItem(product)])
      return true
    },
    [items, userId],
  )

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== productId))
  }, [])

  const value = useMemo(
    () => ({
      items,
      itemCount: items.length,
      isLoggedIn,
      isWishlisted,
      toggleItem,
      removeItem,
    }),
    [items, isLoggedIn, isWishlisted, toggleItem, removeItem],
  )

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider")
  }
  return context
}
