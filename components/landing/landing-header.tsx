"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Search, User, ShoppingBag } from "lucide-react"
import { cn } from "@/lib/utils"
import { HOUSE_OF_INDIKA } from "@/lib/brand"

const navItems = [
  { label: "Our Story", href: "/outerboxdesign" },
  { label: "Collections", href: "/jewellery" },
  { label: "Journal", href: "#" },
  { label: "Conscious Living", href: "#" },
  { label: "Contact", href: "#" },
]

export function LandingHeader() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "border-b border-[#3D2E24]/10 bg-[#F5EBE0]/60 py-3 shadow-lg backdrop-blur-xl"
          : "bg-white/10 py-4 backdrop-blur-md",
      )}
    >
      <div className="mx-auto grid max-w-[960px] grid-cols-[1fr_auto_1fr] items-center px-5 lg:px-8">
        <Link
          href="/"
          className={cn(
            "landing-brand text-[18px] transition-colors duration-300 lg:text-[21px]",
            isScrolled ? "text-[#8A9DAA]" : "text-[#B5C4CE]",
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
                "font-sans text-[10px] font-normal tracking-[0.12em] normal-case transition-colors duration-300",
                isScrolled
                  ? "text-[#5C4332]/90 hover:text-[#2D1A12]"
                  : "text-white/88 hover:text-white",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            aria-label="Search"
            className={cn(
              "transition-colors duration-300",
              isScrolled ? "text-[#5C4332]/90 hover:text-[#2D1A12]" : "text-white/88 hover:text-white",
            )}
          >
            <Search className="size-[15px] stroke-[1.5]" />
          </button>
          <Link
            href="/profile"
            aria-label="Account"
            className={cn(
              "transition-colors duration-300",
              isScrolled ? "text-[#5C4332]/90 hover:text-[#2D1A12]" : "text-white/88 hover:text-white",
            )}
          >
            <User className="size-[15px] stroke-[1.5]" />
          </Link>
          <Link
            href="/cart"
            aria-label="Cart"
            className={cn(
              "transition-colors duration-300",
              isScrolled ? "text-[#5C4332]/90 hover:text-[#2D1A12]" : "text-white/88 hover:text-white",
            )}
          >
            <ShoppingBag className="size-[15px] stroke-[1.5]" />
          </Link>
        </div>
      </div>
    </header>
  )
}
