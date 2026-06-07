import type { Metadata } from "next"
import { CartHeader } from "@/components/cart/cart-header"
import { CartContent } from "@/components/cart/cart-content"

export const metadata: Metadata = {
  title: "Your Cart — House of Indika",
  description:
    "Review your handcrafted selections and proceed to checkout.",
}

export default function CartPage() {
  return (
    <main className="min-h-screen bg-[#FCFAF5]">
      <CartHeader />
      <CartContent />
    </main>
  )
}
