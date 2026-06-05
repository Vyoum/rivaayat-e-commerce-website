import Link from "next/link"
import { ShoppingBag } from "lucide-react"

const navLinks = ["Heritage", "Craft", "Atelier", "Story"]

export function CartHeader() {
  return (
    <header className="border-b border-[#EDE5D8] bg-[#FCFAF5]">
      <div className="relative mx-auto flex h-20 max-w-6xl items-center justify-center px-6">
        <Link
          href="/"
          className="font-serif text-[28px] font-light tracking-wide text-[#2B1B12] sm:text-[32px]"
        >
          House of Indika
        </Link>

        <div className="absolute right-6 flex items-center gap-6 sm:gap-8">
          <nav className="hidden items-center gap-5 sm:flex">
            {navLinks.map((link) => (
              <Link
                key={link}
                href="#"
                className="font-sans text-[11px] font-normal uppercase tracking-[0.12em] text-[#6B5344] transition-colors hover:text-[#2B1B12]"
              >
                {link}
              </Link>
            ))}
          </nav>
          <Link
            href="/cart"
            className="flex items-center gap-1.5 font-sans text-[11px] uppercase tracking-[0.12em] text-[#6B5344] transition-colors hover:text-[#2B1B12]"
            aria-label="Shopping bag"
          >
            <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
            <span className="hidden sm:inline">Bag</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
