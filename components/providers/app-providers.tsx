"use client"

import type { ReactNode } from "react"
import { Toaster } from "sonner"

import { CartProvider } from "@/components/providers/cart-provider"
import { WishlistProvider } from "@/components/providers/wishlist-provider"
import { AuthUserSync } from "@/components/auth/auth-user-sync"

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <WishlistProvider>
        <AuthUserSync />
        {children}
        <Toaster
          position="bottom-center"
          richColors
          closeButton
          toastOptions={{
            classNames: {
              toast: "font-sans",
            },
          }}
        />
      </WishlistProvider>
    </CartProvider>
  )
}
