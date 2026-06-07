import { WishlistHeader } from "@/components/wishlist/wishlist-header"
import { WishlistContent } from "@/components/wishlist/wishlist-content"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "My Wishlist — Rivaayat",
  description: "Curate your collection of handcrafted artisan pieces.",
}

export default function WishlistPage() {
  return (
    <main className="min-h-screen bg-[#F5F3E9]">
      <WishlistHeader />
      <WishlistContent />
    </main>
  )
}
