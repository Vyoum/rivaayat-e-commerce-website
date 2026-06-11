import type { Metadata } from "next"

import { CheckoutContent } from "@/components/checkout/checkout-content"
import { SiteHeader } from "@/components/site-header"
import { HOUSE_OF_INDIKA } from "@/lib/brand"

export const metadata: Metadata = {
  title: `Checkout — ${HOUSE_OF_INDIKA}`,
  description: "Enter delivery details and complete your order securely with Razorpay.",
}

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-[#FCFAF5]">
      <SiteHeader className="bg-[#FCFAF5]" />
      <CheckoutContent />
    </main>
  )
}
