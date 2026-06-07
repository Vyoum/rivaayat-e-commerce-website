import Link from "next/link"
import { Mail, Share2 } from "lucide-react"
import { HOUSE_OF_INDIKA } from "@/lib/brand"

export function CatalogFooter() {
  return (
    <footer className="bg-[#5C4332] text-[#F5F0E8]">
      <div className="mx-auto flex max-w-[1100px] flex-col gap-10 px-5 py-12 sm:flex-row sm:items-start sm:justify-between lg:px-8">
        <div>
          <Link href="/" className="font-serif text-[26px] font-normal text-[#F5F0E8]">
            {HOUSE_OF_INDIKA}
          </Link>
          <p className="mt-3 font-sans text-[12px] text-[#F5F0E8]/55">
            © 2026 {HOUSE_OF_INDIKA}. Crafted with Heritage.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              aria-label="Share"
              className="flex size-8 items-center justify-center rounded-full border border-[#F5F0E8]/20 text-[#F5F0E8]/70"
            >
              <Share2 className="size-3.5" />
            </button>
            <button
              type="button"
              aria-label="Email"
              className="flex size-8 items-center justify-center rounded-full border border-[#F5F0E8]/20 text-[#F5F0E8]/70"
            >
              <Mail className="size-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-12 gap-y-3">
          {["Shipping & Returns", "Privacy Policy", "Contact Us", "Artisan Grants"].map((link) => (
            <Link
              key={link}
              href="#"
              className="font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-[#F5F0E8]/80 transition-colors hover:text-[#F5F0E8]"
            >
              {link}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
