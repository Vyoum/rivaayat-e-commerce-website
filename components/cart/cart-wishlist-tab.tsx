"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, Plus, Sparkles } from "lucide-react"
import { toast } from "sonner"

import { useCart } from "@/components/providers/cart-provider"
import { useWishlist } from "@/components/providers/wishlist-provider"
import { useAuth } from "@/hooks/use-auth"
import { wishlistItemToCatalogProduct } from "@/lib/wishlist"
import { cn } from "@/lib/utils"

function formatCurrency(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`
}

export function CartWishlistTab() {
  const { isLoggedIn } = useAuth()
  const { items: wishlistItems } = useWishlist()
  const { items: cartItems, addItem } = useCart()

  const cartProductIds = new Set(cartItems.map((item) => item.id))
  const suggestions = wishlistItems.filter((item) => !cartProductIds.has(item.id))

  function handleAddToCart(productId: string, productName: string) {
    const wishlistItem = wishlistItems.find((item) => item.id === productId)
    if (!wishlistItem) return

    addItem(wishlistItemToCatalogProduct(wishlistItem))
    toast.success(`${productName} added to cart`)
  }

  return (
    <section className="relative mt-10">
      <div className="absolute -top-3.5 left-5 z-10 inline-flex items-center gap-2 rounded-full border border-[#E8CFC4] bg-[#FFF8F5] px-4 py-1.5 shadow-[0_2px_8px_rgba(132,98,70,0.08)]">
        <Heart className="size-3.5 fill-[#E8A4A4] text-[#E8A4A4]" strokeWidth={1.5} />
        <span className="font-serif text-[13px] italic text-[#846246]">
          Add more from wishlist
        </span>
        <Sparkles className="size-3 text-[#C4A882]" aria-hidden />
      </div>

      <div className="rounded-xl border border-[#EDE5D8] bg-gradient-to-br from-[#FFFBF8] to-[#F5F2EB] px-5 pb-5 pt-8 sm:px-6 sm:pb-6 sm:pt-9">
        {!isLoggedIn ? (
          <div className="py-2 text-center">
            <p className="font-serif text-[15px] italic text-[#6B5344]">
              Sign in to pull saved favourites into your cart.
            </p>
            <Link
              href="/login?next=/cart"
              className="mt-3 inline-flex items-center gap-1.5 font-sans text-[11px] font-medium uppercase tracking-[0.12em] text-[#846246] underline underline-offset-4 transition-colors hover:text-[#2B1B12]"
            >
              <Heart className="size-3.5" strokeWidth={1.5} />
              Go to sign in
            </Link>
          </div>
        ) : suggestions.length === 0 ? (
          <div className="py-2 text-center">
            <p className="font-serif text-[15px] italic text-[#9A8070]">
              {wishlistItems.length === 0
                ? "Your wishlist is waiting for its first treasure."
                : "Everything you saved is already in your cart — lovely choices!"}
            </p>
            <Link
              href={wishlistItems.length === 0 ? "/" : "/wishlist"}
              className="mt-3 inline-block font-sans text-[11px] font-medium uppercase tracking-[0.12em] text-[#846246] underline underline-offset-4 transition-colors hover:text-[#2B1B12]"
            >
              {wishlistItems.length === 0 ? "Explore the collection" : "View wishlist"}
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {suggestions.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-3 rounded-lg border border-[#EDE5D8]/80 bg-white/70 p-3 transition-colors hover:border-[#E8CFC4] hover:bg-white sm:gap-4 sm:p-3.5"
              >
                <Link
                  href={`/products/${item.slug}`}
                  className="relative h-14 w-11 shrink-0 overflow-hidden rounded-t-[22px] rounded-b-md bg-[#EDE5D8] sm:h-16 sm:w-12"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </Link>

                <div className="min-w-0 flex-1">
                  <Link
                    href={`/products/${item.slug}`}
                    className="block truncate font-serif text-[14px] leading-tight text-[#2B1B12] transition-colors hover:text-[#846246] sm:text-[15px]"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-0.5 truncate font-sans text-[11px] text-[#9A8070]">
                    by {item.artisan}
                  </p>
                </div>

                <p className="hidden shrink-0 font-serif text-[14px] text-[#2B1B12] sm:block">
                  {formatCurrency(item.price)}
                </p>

                <button
                  type="button"
                  onClick={() => handleAddToCart(item.id, item.name)}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1 rounded-full border border-[#846246]/25 bg-[#846246] px-3 py-2 font-sans text-[10px] font-medium uppercase tracking-[0.1em] text-white transition-colors hover:bg-[#6B5344] sm:px-3.5 sm:text-[11px]",
                  )}
                >
                  <Plus className="size-3" strokeWidth={2} />
                  Add
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
