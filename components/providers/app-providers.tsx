"use client"

import type { ReactNode } from "react"
import { Toaster } from "sonner"

import { CartProvider } from "@/components/providers/cart-provider"

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      {children}
      <Toaster position="top-center" richColors closeButton />
    </CartProvider>
  )
}
