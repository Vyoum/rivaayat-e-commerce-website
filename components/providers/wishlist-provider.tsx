"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { toast } from "sonner"

import { useAuth } from "@/hooks/use-auth"
import type { CatalogProduct } from "@/lib/category-catalog"
import {
  catalogProductToWishlistItem,
  type WishlistItem,
} from "@/lib/wishlist"

const LEGACY_STORAGE_PREFIX = "house-of-indika-wishlist-"

function getLegacyStorageKey(userId: string) {
  return `${LEGACY_STORAGE_PREFIX}${userId}`
}

type WishlistContextValue = {
  items: WishlistItem[]
  itemCount: number
  loading: boolean
  isLoggedIn: boolean
  isWishlisted: (productId: string) => boolean
  toggleItem: (product: CatalogProduct) => boolean
  removeItem: (productId: string) => void
  refreshWishlist: () => Promise<void>
}

const WishlistContext = createContext<WishlistContextValue | null>(null)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { userId, isLoggedIn, loading: authLoading } = useAuth()
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const migratedRef = useRef<string | null>(null)

  const refreshWishlist = useCallback(async () => {
    if (!userId) {
      setItems([])
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/wishlist", { credentials: "include" })
      if (!res.ok) {
        if (res.status === 401) {
          setItems([])
          return
        }
        throw new Error("Failed to load wishlist")
      }
      const data = (await res.json()) as { items: WishlistItem[] }
      setItems(Array.isArray(data.items) ? data.items : [])
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    if (authLoading) return

    if (!userId) {
      setItems([])
      setLoading(false)
      migratedRef.current = null
      return
    }

    void (async () => {
      await refreshWishlist()

      if (migratedRef.current === userId) return

      try {
        const legacyKey = getLegacyStorageKey(userId)
        const stored = localStorage.getItem(legacyKey)
        if (!stored) {
          migratedRef.current = userId
          return
        }

        const legacyItems = JSON.parse(stored) as WishlistItem[]
        if (!Array.isArray(legacyItems) || legacyItems.length === 0) {
          localStorage.removeItem(legacyKey)
          migratedRef.current = userId
          return
        }

        const res = await fetch("/api/wishlist", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "migrate",
            items: legacyItems.map((item) => ({
              productId: item.id,
              slug: item.slug,
            })),
          }),
        })

        if (res.ok) {
          localStorage.removeItem(legacyKey)
          const data = (await res.json()) as { items: WishlistItem[] }
          setItems(Array.isArray(data.items) ? data.items : [])
        }
      } catch {
        // Keep DB wishlist even if legacy migration fails.
      } finally {
        migratedRef.current = userId
      }
    })()
  }, [authLoading, refreshWishlist, userId])

  const isWishlisted = useCallback(
    (productId: string) => items.some((item) => item.id === productId),
    [items],
  )

  const toggleItem = useCallback(
    (product: CatalogProduct) => {
      if (!userId) return false

      const exists = items.some((item) => item.id === product.id)
      const added = !exists

      if (exists) {
        setItems((prev) => prev.filter((item) => item.id !== product.id))
      } else {
        setItems((prev) => [...prev, catalogProductToWishlistItem(product)])
      }

      void (async () => {
        try {
          const res = await fetch("/api/wishlist", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              productId: product.id,
              slug: product.slug,
            }),
          })
          const data = (await res.json()) as { items?: WishlistItem[]; error?: string }
          if (!res.ok) {
            throw new Error(data.error ?? "Failed to update wishlist")
          }
          if (Array.isArray(data.items)) {
            setItems(data.items)
          }
        } catch (error) {
          await refreshWishlist()
          toast.error(
            error instanceof Error ? error.message : "Could not update wishlist. Please try again.",
          )
        }
      })()

      return added
    },
    [items, refreshWishlist, userId],
  )

  const removeItem = useCallback(
    (productId: string) => {
      setItems((prev) => prev.filter((item) => item.id !== productId))

      void (async () => {
        try {
          const res = await fetch(`/api/wishlist/${encodeURIComponent(productId)}`, {
            method: "DELETE",
            credentials: "include",
          })
          const data = (await res.json()) as { items?: WishlistItem[]; error?: string }
          if (!res.ok) {
            throw new Error(data.error ?? "Failed to remove wishlist item")
          }
          if (Array.isArray(data.items)) {
            setItems(data.items)
          }
        } catch (error) {
          await refreshWishlist()
          toast.error(
            error instanceof Error ? error.message : "Could not remove item. Please try again.",
          )
        }
      })()
    },
    [refreshWishlist],
  )

  const value = useMemo(
    () => ({
      items,
      itemCount: items.length,
      loading,
      isLoggedIn,
      isWishlisted,
      toggleItem,
      removeItem,
      refreshWishlist,
    }),
    [items, loading, isLoggedIn, isWishlisted, toggleItem, removeItem, refreshWishlist],
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
