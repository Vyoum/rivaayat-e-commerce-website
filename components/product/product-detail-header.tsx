"use client"

import Link from "next/link"
import { Search, Heart, ShoppingBag } from "lucide-react"

const navItems = [
  { label: "Heritage", href: "/outerboxdesign" },
  { label: "Shop", href: "/jewellery" },
  { label: "Artisans", href: "/#artisans" },
  { label: "Journal", href: "#" },
]

export function ProductDetailHeader() {
  return (
    <header className="border-b border-[#E8E0D4] bg-[#F5F3E9]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <div className="hidden w-24 lg:block" aria-hidden />

        <div className="flex flex-1 flex-col items-center gap-5">
          <Link
            href="/"
            className="font-serif text-[22px] font-normal tracking-[0.02em] text-[#3D2E24] md:text-[26px]"
          >
            House of Indika
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="font-sans text-[11px] font-medium tracking-[0.18em] text-[#6B5A4E] uppercase transition-colors hover:text-[#3D2E24]"
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
            className="text-[#6B5A4E] transition-colors hover:text-[#3D2E24]"
          >
            <Search className="size-[18px] stroke-[1.5]" />
          </button>
          <button
            type="button"
            aria-label="Wishlist"
            className="hidden text-[#6B5A4E] transition-colors hover:text-[#3D2E24] sm:block"
          >
            <Heart className="size-[18px] stroke-[1.5]" />
          </button>
          <Link
            href="/cart"
            aria-label="Cart"
            className="text-[#6B5A4E] transition-colors hover:text-[#3D2E24]"
          >
            <ShoppingBag className="size-[18px] stroke-[1.5]" />
          </Link>
        </div>
      </div>
    </header>
  )
}
