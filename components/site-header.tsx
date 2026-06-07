"use client"

import Link from "next/link"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { HOUSE_OF_INDIKA } from "@/lib/brand"
import { AccountIconLink } from "@/components/account/account-icon-link"
import { CartIconLink } from "@/components/cart/cart-icon-link"
import { WishlistIconLink } from "@/components/wishlist/wishlist-icon-link"

export type SiteNavItem = {
  label: string
  href: string
  active?: boolean
}

const defaultNavItems: SiteNavItem[] = [
  { label: "Our Story", href: "/outerboxdesign" },
  { label: "Collections", href: "/jewellery" },
  { label: "Custom Orders", href: "/custom-orders" },
  { label: "Contact", href: "#" },
]

type SiteHeaderProps = {
  navItems?: SiteNavItem[]
  variant?: "solid" | "transparent"
  className?: string
}

export function SiteHeader({
  navItems = defaultNavItems,
  variant = "solid",
  className,
}: SiteHeaderProps) {
  const isTransparent = variant === "transparent"

  return (
    <header
      className={cn(
        "left-0 right-0 z-50",
        isTransparent
          ? "absolute top-0 border-b border-transparent bg-transparent"
          : "relative border-b border-[#E8E0D4] bg-[#FCF8F4]",
        className,
      )}
    >
      <div className="mx-auto grid max-w-[1100px] grid-cols-[1fr_auto_1fr] items-center px-5 py-4 lg:px-8">
        <Link
          href="/"
          className={cn(
            "justify-self-start font-serif text-[18px] font-normal tracking-[0.02em] transition-colors lg:text-[21px]",
            isTransparent ? "text-white" : "text-[#3D2E24]",
          )}
        >
          {HOUSE_OF_INDIKA}
        </Link>

        <nav className="hidden items-center justify-center gap-6 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "font-sans text-[10px] font-medium uppercase tracking-[0.14em] transition-colors",
                isTransparent
                  ? item.active
                    ? "border-b border-white/80 pb-0.5 text-white"
                    : "text-white/80 hover:text-white"
                  : item.active
                    ? "border-b border-[#3D2E24] pb-0.5 text-[#3D2E24]"
                    : "text-[#6B5A4E] hover:text-[#3D2E24]",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            aria-label="Search"
            className={cn(
              "transition-colors",
              isTransparent ? "text-white/85 hover:text-white" : "text-[#6B5A4E] hover:text-[#3D2E24]",
            )}
          >
            <Search className="size-[17px] stroke-[1.5]" />
          </button>
          <AccountIconLink
            className={cn(
              "transition-colors",
              isTransparent ? "text-white/85 hover:text-white" : "text-[#6B5A4E] hover:text-[#3D2E24]",
            )}
            iconClassName="size-[17px] stroke-[1.5]"
          />
          <WishlistIconLink
            className={cn(
              "transition-colors",
              isTransparent ? "text-white/85 hover:text-white" : "text-[#6B5A4E] hover:text-[#3D2E24]",
            )}
            iconClassName="size-[17px] stroke-[1.5]"
          />
          <CartIconLink
            className={cn(
              "transition-colors",
              isTransparent ? "text-white/85 hover:text-white" : "text-[#6B5A4E] hover:text-[#3D2E24]",
            )}
            iconClassName="size-[17px] stroke-[1.5]"
          />
        </div>
      </div>
    </header>
  )
}
