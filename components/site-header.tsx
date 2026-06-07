"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { HOUSE_OF_INDIKA } from "@/lib/brand"
import { isNavItemActive, SITE_NAV_ITEMS } from "@/lib/site-nav"
import { AccountIconLink } from "@/components/account/account-icon-link"
import { CartIconLink } from "@/components/cart/cart-icon-link"
import { WishlistIconLink } from "@/components/wishlist/wishlist-icon-link"

export type { SiteNavItem } from "@/lib/site-nav"

type SiteHeaderProps = {
  variant?: "solid" | "hero"
  className?: string
}

export function SiteHeader({ variant = "solid", className }: SiteHeaderProps) {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const isHero = variant === "hero"

  useEffect(() => {
    if (!isHero) return

    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isHero])

  const onHero = isHero && !isScrolled

  const brandClass = cn(
    "landing-brand text-[18px] transition-colors duration-300 lg:text-[21px]",
    onHero ? "text-[#B5C4CE]" : isHero ? "text-[#8A9DAA]" : "text-[#8A9DAA]",
  )

  const navLinkClass = (active: boolean) =>
    cn(
      "font-sans text-[10px] font-normal tracking-[0.12em] normal-case transition-colors duration-300",
      onHero
        ? active
          ? "text-white"
          : "text-white/88 hover:text-white"
        : active
          ? "text-[#2D1A12]"
          : "text-[#5C4332]/90 hover:text-[#2D1A12]",
    )

  const iconClass = cn(
    "transition-colors duration-300",
    onHero ? "text-white/88 hover:text-white" : "text-[#5C4332]/90 hover:text-[#2D1A12]",
  )

  return (
    <header
      className={cn(
        "left-0 right-0 z-50 transition-all duration-500",
        isHero
          ? cn(
              "fixed top-0",
              isScrolled
                ? "border-b border-[#3D2E24]/10 bg-[#F5EBE0]/60 py-3 shadow-lg backdrop-blur-xl"
                : "bg-white/10 py-4 backdrop-blur-md",
            )
          : "relative border-b border-[#E8E0D4] bg-[#FCF8F4] py-4",
        className,
      )}
    >
      <div className="mx-auto grid max-w-[960px] grid-cols-[1fr_auto_1fr] items-center px-5 lg:px-8">
        <Link href="/" className={cn(brandClass, "justify-self-start")}>
          {HOUSE_OF_INDIKA}
        </Link>

        <nav className="hidden items-center justify-center gap-6 lg:flex">
          {SITE_NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={navLinkClass(isNavItemActive(pathname, item.href))}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-4">
          <button type="button" aria-label="Search" className={iconClass}>
            <Search className="size-[15px] stroke-[1.5]" />
          </button>
          <AccountIconLink className={iconClass} iconClassName="size-[15px] stroke-[1.5]" />
          <WishlistIconLink
            className={iconClass}
            iconClassName="size-[15px] stroke-[1.5]"
            badgeClassName={onHero ? "bg-white text-[#785D44]" : undefined}
          />
          <CartIconLink
            className={iconClass}
            iconClassName="size-[15px] stroke-[1.5]"
            badgeClassName={onHero ? "bg-white text-[#785D44]" : undefined}
          />
        </div>
      </div>
    </header>
  )
}
