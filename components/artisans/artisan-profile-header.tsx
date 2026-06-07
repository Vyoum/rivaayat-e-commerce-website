"use client"

import Link from "next/link"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { HOUSE_OF_INDIKA } from "@/lib/brand"
import { AccountIconLink } from "@/components/account/account-icon-link"
import { CartIconLink } from "@/components/cart/cart-icon-link"
import { WishlistIconLink } from "@/components/wishlist/wishlist-icon-link"

const navItems = [
  { label: "Curation", href: "/jewellery" },
  { label: "Artisans", href: "/artisans/devendra-khatri", active: true },
  { label: "Our Story", href: "/outerboxdesign" },
  { label: "Custom Orders", href: "/custom-orders" },
]

export function ArtisanProfileHeader({ overHero = false }: { overHero?: boolean }) {
  return (
    <header
      className={cn(
        "absolute top-0 left-0 right-0 z-50",
        overHero ? "bg-transparent" : "relative bg-[#FDF8F4] border-b border-[#E8E0D4]",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <div className="hidden w-24 lg:block" aria-hidden />

        <div className="flex flex-1 flex-col items-center gap-4">
          <Link
            href="/"
            className={cn(
              "font-serif text-[22px] font-normal tracking-[0.02em] md:text-[26px]",
              overHero ? "text-white" : "text-[#3D2E24]",
            )}
          >
            {HOUSE_OF_INDIKA}
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "font-sans text-[11px] font-medium tracking-[0.18em] uppercase transition-colors",
                  overHero
                    ? item.active
                      ? "text-white border-b border-white/70 pb-0.5"
                      : "text-white/75 hover:text-white"
                    : item.active
                      ? "text-[#3D2E24] border-b border-[#3D2E24] pb-0.5"
                      : "text-[#6B5A4E] hover:text-[#3D2E24]",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex w-24 items-center justify-end gap-4">
          <button
            type="button"
            aria-label="Search"
            className={cn(
              "transition-colors",
              overHero ? "text-white/85 hover:text-white" : "text-[#6B5A4E] hover:text-[#3D2E24]",
            )}
          >
            <Search className="size-[18px] stroke-[1.5]" />
          </button>
          <AccountIconLink
            className={cn(
              "transition-colors",
              overHero ? "text-white/85 hover:text-white" : "text-[#6B5A4E] hover:text-[#3D2E24]",
            )}
            iconClassName="size-[18px] stroke-[1.5]"
          />
          <WishlistIconLink
            className={cn(
              "transition-colors",
              overHero ? "text-white/85 hover:text-white" : "text-[#6B5A4E] hover:text-[#3D2E24]",
            )}
            iconClassName="size-[18px] stroke-[1.5]"
          />
          <CartIconLink
            className={cn(
              "transition-colors",
              overHero ? "text-white/85 hover:text-white" : "text-[#6B5A4E] hover:text-[#3D2E24]",
            )}
            iconClassName="size-[18px] stroke-[1.5]"
          />
        </div>
      </div>
    </header>
  )
}
