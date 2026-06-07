import Link from "next/link"
import { HOUSE_OF_INDIKA } from "@/lib/brand"

const linkColumns = [
  ["The Craft", "Our Story", "Sustainability"],
  ["Shipping & Returns", "Privacy Policy", "Contact Us"],
]

export function ProductDetailFooter() {
  return (
    <footer className="bg-[#5C4332] text-[#F5F0E8]">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr] lg:gap-16">
          <div>
            <Link href="/" className="font-serif text-[26px] font-normal text-[#F5F0E8]">
              {HOUSE_OF_INDIKA}
            </Link>
            <p className="mt-4 max-w-xs font-serif text-[15px] leading-relaxed text-[#F5F0E8]/75 italic">
              Bridging ancestral craftsmanship with contemporary living.
            </p>
          </div>

          {linkColumns.map((column, colIndex) => (
            <ul key={colIndex} className="space-y-3">
              {column.map((link) => (
                <li key={link}>
                  <Link
                    href="#"
                    className="font-sans text-[11px] font-medium tracking-[0.16em] text-[#F5F0E8]/80 uppercase transition-colors hover:text-[#F5F0E8]"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          ))}
        </div>

        <div className="mt-14 border-t border-[#F5F0E8]/15 pt-8 text-center">
          <p className="font-sans text-[12px] tracking-wide text-[#F5F0E8]/55">
            © 2026 {HOUSE_OF_INDIKA}. Crafted with Love.
          </p>
        </div>
      </div>
    </footer>
  )
}
