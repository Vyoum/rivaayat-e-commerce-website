import type { Metadata } from "next"
import { ProductDetailHeader } from "@/components/product/product-detail-header"
import { ProductDetailContent } from "@/components/product/product-detail-content"
import { ProductDetailFooter } from "@/components/product/product-detail-footer"
import { HOUSE_OF_INDIKA } from "@/lib/brand"

export const metadata: Metadata = {
  title: `Mandala Crochet Earrings — ${HOUSE_OF_INDIKA}`,
  description:
    "Handcrafted mandala crochet earrings by Asha from Rajasthan. Earthy terracotta thread work, ₹650.",
}

export default function MandalaCrochetEarringsPage() {
  return (
    <main className="min-h-screen bg-[#F5F3E9]">
      <ProductDetailHeader />
      <ProductDetailContent />
      <ProductDetailFooter />
    </main>
  )
}
