"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, ShoppingBag, Heart, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "bg-background/60 backdrop-blur-xl shadow-lg border-b border-foreground/10 py-3"
          : "bg-background/30 backdrop-blur-md py-4",
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="relative group flex flex-col items-start">
          <span
            className={cn(
              "text-2xl md:text-3xl tracking-[0.2em] uppercase transition-colors duration-300 font-serif font-bold",
              isScrolled ? "text-foreground" : "text-foreground",
            )}
          >
            RIVAAYAT
          </span>
          <span
            className={cn(
              "text-sm md:text-base font-serif tracking-wider transition-colors duration-300 -mt-1",
              isScrolled ? "text-primary" : "text-primary",
            )}
          >
            रिवायत
          </span>
          <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-10">
          {["Our Story", "Products", "Artisans", "Impact", "Contact"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(" ", "-")}`}
              className={cn(
                "relative font-sans tracking-wide transition-colors duration-300 group font-medium text-xl",
                isScrolled ? "text-foreground" : "text-foreground",
              )}
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Heart className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingBag className="opacity-100 shadow-xl w-7 h-3.5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center">
              0
            </span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 top-[72px] bg-background/98 backdrop-blur-lg transition-all duration-500 flex flex-col items-center justify-center gap-8",
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
      >
        {["Our Story", "Products", "Artisans", "Impact", "Contact"].map((item, index) => (
          <Link
            key={item}
            href={`#${item.toLowerCase().replace(" ", "-")}`}
            className="text-3xl font-serif text-foreground hover:text-primary transition-colors"
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {item}
          </Link>
        ))}
      </div>
    </header>
  )
}
