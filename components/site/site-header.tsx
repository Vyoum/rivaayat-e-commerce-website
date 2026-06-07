"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { HOUSE_OF_INDIKA } from "@/lib/brand"
import { AccountIconLink } from "@/components/account/account-icon-link"
import { CartIconLink } from "@/components/cart/cart-icon-link"
import { WishlistIconLink } from "@/components/wishlist/wishlist-icon-link"

const leftNavItems = [
  { label: "Home", href: "/", id: "home" as const },
  { label: "About", href: "/outerboxdesign", id: "about" as const },
  { label: "Collection", href: "/jewellery", id: "collection" as const },
]

type SiteHeaderProps = {
  activeLink?: "home" | "about" | "collection"
  centerMode?: "brand" | "story"
  storyCenterLine1?: string
  storyCenterLine2?: string
}

export function SiteHeader({
  activeLink,
  centerMode = "brand",
  storyCenterLine1 = "From Craft",
  storyCenterLine2 = "to Collection",
}: SiteHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinkClass = (isActive: boolean) =>
    cn(
      "landing-label text-[10px] transition-colors duration-300",
      isScrolled
        ? isActive
          ? "text-[#2D1A12]"
          : "text-[#5C4332]/80 hover:text-[#2D1A12]"
        : isActive
          ? "text-white"
          : "text-white/85 hover:text-white",
    )

  const iconClass = cn(
    "transition-colors duration-300",
    isScrolled ? "text-[#5C4332]/90 hover:text-[#2D1A12]" : "text-white/88 hover:text-white",
  )

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "border-b border-[#3D2E24]/10 bg-[#F5EBE0]/75 py-3 shadow-lg backdrop-blur-xl"
          : "bg-transparent py-4 backdrop-blur-sm",
      )}
    >
      <div className="mx-auto grid max-w-[1100px] grid-cols-[1fr_auto_1fr] items-center px-5 lg:px-8">
        <nav className="flex items-center gap-4 sm:gap-6">
          {leftNavItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={navLinkClass(activeLink === item.id)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {centerMode === "story" ? (
          <Link
            href="/"
            className={cn(
              "hidden text-center sm:block",
              isScrolled ? "text-[#7D5A44]" : "text-white",
            )}
          >
            <span className="landing-display-italic block text-[17px] leading-tight lg:text-[19px]">
              {storyCenterLine1}
            </span>
            <span className="landing-display block text-[14px] leading-tight lg:text-[15px]">
              {storyCenterLine2}
            </span>
          </Link>
        ) : (
          <Link
            href="/"
            className={cn(
              "landing-brand text-center text-[17px] transition-colors duration-300 lg:text-[20px]",
              isScrolled ? "text-[#8A9DAA]" : "text-white/95",
            )}
          >
            {HOUSE_OF_INDIKA}
          </Link>
        )}

        <div className="flex items-center justify-end gap-3 sm:gap-4">
          <button type="button" aria-label="Search" className={iconClass}>
            <Search className="size-[15px] stroke-[1.5]" />
          </button>
          <span className="hidden items-center gap-1 sm:flex">
            <AccountIconLink className={iconClass} iconClassName="size-[15px] stroke-[1.5]" />
            <WishlistIconLink
              className={iconClass}
              iconClassName="size-[15px] stroke-[1.5]"
              badgeClassName={isScrolled ? undefined : "bg-white text-[#785D44]"}
            />
          </span>
          <CartIconLink
            className={iconClass}
            iconClassName="size-[15px] stroke-[1.5]"
            badgeClassName={isScrolled ? undefined : "bg-white text-[#785D44]"}
            showLabel
            labelClassName={cn(
              "landing-label hidden text-[10px] sm:inline",
              isScrolled ? "text-[#5C4332]/90" : "text-white/88",
            )}
          />
        </div>
      </div>
    </header>
  )
}
