"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Heart, Menu, Search, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { HOUSE_OF_INDIKA } from "@/lib/brand"
import { isNavItemActive, SITE_NAV_ITEMS } from "@/lib/site-nav"
import { AccountIconLink } from "@/components/account/account-icon-link"
import { CartIconLink } from "@/components/cart/cart-icon-link"
import { SiteSearchPanel, SITE_HEADER_ID } from "@/components/site-search-panel"
import { useWishlist } from "@/components/providers/wishlist-provider"
import { WishlistIconLink } from "@/components/wishlist/wishlist-icon-link"

export type { SiteNavItem } from "@/lib/site-nav"

type SiteHeaderProps = {
  variant?: "solid" | "hero"
  className?: string
  brandLabel?: string
}

export function SiteHeader({ variant = "solid", className, brandLabel = HOUSE_OF_INDIKA }: SiteHeaderProps) {
  const pathname = usePathname()
  const { isLoggedIn } = useWishlist()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const isHero = variant === "hero"
  const wishlistHref = isLoggedIn ? "/wishlist" : "/login?next=/wishlist"

  useEffect(() => {
    if (!isHero) return

    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isHero])

  useEffect(() => {
    setMobileOpen(false)
    setSearchOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileOpen])

  const onHero = isHero && !isScrolled

  const brandClass = cn(
    "landing-brand text-[17px] transition-colors duration-300 sm:text-[18px] lg:text-[21px]",
    onHero ? "text-[#B5C4CE]" : "text-[#8A9DAA]",
  )

  const navLinkClass = (active: boolean, mobile = false) =>
    cn(
      "font-sans font-normal tracking-[0.12em] normal-case transition-colors duration-300",
      mobile
        ? "block py-3.5 text-[15px] tracking-[0.08em]"
        : "text-[10px]",
      onHero && !mobile
        ? active
          ? "text-white"
          : "text-white/88 hover:text-white"
        : mobile
          ? active
            ? "text-[#2D1A12]"
            : "text-[#5C4332] hover:text-[#2D1A12]"
          : active
            ? "text-[#2D1A12]"
            : "text-[#5C4332]/90 hover:text-[#2D1A12]",
    )

  const iconClass = cn(
    "transition-colors duration-300",
    onHero ? "text-white/88 hover:text-white" : "text-[#5C4332]/90 hover:text-[#2D1A12]",
  )

  const mobileMenuLinkClass = cn(
    "flex items-center gap-3 font-sans text-[14px] tracking-[0.06em] text-[#5C4332] transition-colors hover:text-[#2D1A12]",
  )

  return (
    <>
      <header
        id={SITE_HEADER_ID}
        className={cn(
          "left-0 right-0 z-50 transition-all duration-500",
          isHero
            ? cn(
                "fixed top-0",
                isScrolled
                  ? "border-b border-[#3D2E24]/10 bg-[#F5EBE0]/60 py-3 shadow-lg backdrop-blur-xl"
                  : "bg-white/10 py-3 backdrop-blur-md sm:py-4",
              )
            : "relative border-b border-[#E8E0D4] bg-[#FCF8F4] py-3 sm:py-4",
          className,
        )}
      >
        <div className="relative mx-auto max-w-[960px] px-5 lg:px-8">
          {/* Mobile bar */}
          <div className="flex items-center justify-between lg:hidden">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              className={cn("inline-flex size-10 items-center justify-center", iconClass)}
            >
              <Menu className="size-[18px] stroke-[1.5]" />
            </button>

            <Link
              href="/"
              className={cn(brandClass, "absolute left-1/2 -translate-x-1/2 text-center")}
            >
              {brandLabel}
            </Link>

            <div className="flex items-center gap-3">
              <AccountIconLink className={iconClass} iconClassName="size-[17px] stroke-[1.5]" />
              <CartIconLink
                className={iconClass}
                iconClassName="size-[17px] stroke-[1.5]"
                badgeClassName={onHero ? "bg-white text-[#785D44]" : undefined}
              />
            </div>
          </div>

          {/* Desktop bar */}
          <div className="hidden grid-cols-[1fr_auto_1fr] items-center lg:grid">
            <Link href="/" className={cn(brandClass, "justify-self-start")}>
              {brandLabel}
            </Link>

            <nav className="flex items-center justify-center gap-6">
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
              <button
                type="button"
                aria-label="Search"
                onClick={() => setSearchOpen(true)}
                className={iconClass}
              >
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
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-0 z-[60] lg:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!mobileOpen}
      >
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
          className={cn(
            "absolute inset-0 bg-[#2D1A12]/35 transition-opacity duration-300",
            mobileOpen ? "opacity-100" : "opacity-0",
          )}
        />

        <aside
          className={cn(
            "absolute top-0 left-0 flex h-full w-[min(300px,85vw)] flex-col border-r border-[#E8E0D4] bg-[#FCF8F4] shadow-2xl transition-transform duration-300 ease-out",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between border-b border-[#E8E0D4] px-5 py-4">
            <p className="font-serif text-[15px] text-[#3D2E24]">Menu</p>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="inline-flex size-9 items-center justify-center text-[#6B5344] hover:text-[#2D1A12]"
            >
              <X className="size-[18px] stroke-[1.5]" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-5 py-2">
            {SITE_NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={navLinkClass(isNavItemActive(pathname, item.href), true)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="space-y-1 border-t border-[#E8E0D4] px-5 py-4">
            <button
              type="button"
              className={cn(mobileMenuLinkClass, "w-full py-3")}
              onClick={() => {
                setMobileOpen(false)
                setSearchOpen(true)
              }}
            >
              <Search className="size-[16px] stroke-[1.5]" />
              Search
            </button>
            <Link
              href={wishlistHref}
              onClick={() => setMobileOpen(false)}
              className={cn(mobileMenuLinkClass, "py-3")}
            >
              <Heart className="size-[16px] stroke-[1.5]" />
              Wishlist
            </Link>
          </div>
        </aside>
      </div>

      {searchOpen ? <SiteSearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} /> : null}
    </>
  )
}
