import type { Metadata } from "next"
import { CartHeader } from "@/components/cart/cart-header"
import { CartContent } from "@/components/cart/cart-content"
import { HOUSE_OF_INDIKA } from "@/lib/brand"

export const metadata: Metadata = {
  title: `Your Cart — ${HOUSE_OF_INDIKA}`,
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
