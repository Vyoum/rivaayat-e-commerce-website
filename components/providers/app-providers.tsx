"use client"

import type { ReactNode } from "react"
import { Toaster } from "sonner"

import { CartProvider } from "@/components/providers/cart-provider"
import { WishlistProvider } from "@/components/providers/wishlist-provider"

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <WishlistProvider>
        {children}
        <Toaster position="top-center" richColors closeButton />
      </WishlistProvider>
    </CartProvider>
  )
}
