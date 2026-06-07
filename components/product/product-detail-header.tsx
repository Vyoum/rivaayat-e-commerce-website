import Link from "next/link"
import { Search } from "lucide-react"

import { CartIconLink } from "@/components/cart/cart-icon-link"
import { WishlistIconLink } from "@/components/wishlist/wishlist-icon-link"
import { HOUSE_OF_INDIKA } from "@/lib/brand"
import { cn } from "@/lib/utils"

const productNavItems = [
  { label: "Heritage", href: "/outerboxdesign" },
  { label: "Shop", href: "/jewellery", active: true },
  { label: "Artisans", href: "/artisans/devendra-khatri" },
  { label: "Custom Orders", href: "/custom-orders" },
]

export function ProductDetailHeader() {
  return (
    <header className="border-b border-[#E8E0D4]/80 bg-[#F5F3E9]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <div className="flex flex-1 items-center justify-center gap-8 lg:gap-12">
          <Link
            href="/"
            className="font-serif text-[20px] font-normal tracking-[0.02em] text-[#3D2E24] lg:text-[22px]"
          >
            {HOUSE_OF_INDIKA}
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {productNavItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "font-sans text-[10px] font-medium uppercase tracking-[0.16em] transition-colors",
                  item.active
                    ? "border-b border-[#3D2E24] pb-0.5 text-[#3D2E24]"
                    : "text-[#6B5A4E] hover:text-[#3D2E24]",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4 text-[#6B5A4E]">
          <button type="button" aria-label="Search" className="transition-colors hover:text-[#3D2E24]">
            <Search className="size-[17px] stroke-[1.5]" />
          </button>
          <WishlistIconLink
            className="transition-colors hover:text-[#3D2E24]"
            iconClassName="size-[17px] stroke-[1.5]"
          />
          <CartIconLink
            className="transition-colors hover:text-[#3D2E24]"
            iconClassName="size-[17px] stroke-[1.5]"
          />
        </div>
      </div>
    </header>
  )
}
