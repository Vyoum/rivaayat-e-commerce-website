import Link from "next/link"
import { HOUSE_OF_INDIKA } from "@/lib/brand"

const linkColumns = [
  ["Shipping & Returns", "Privacy Policy"],
  ["Artisan Stories", "Wholesale"],
]

export function ArtisanProfileFooter() {
  return (
    <footer className="bg-[#F9F1EB] text-[#3D2E24]">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <Link href="/" className="font-serif text-[24px] font-normal text-[#3D2E24]">
              {HOUSE_OF_INDIKA}
            </Link>
            <p className="mt-3 font-sans text-[12px] text-[#9A8070]">
              © 2024 {HOUSE_OF_INDIKA}. Preserving the poetry of Indian craft.
            </p>
          </div>

          <div className="flex gap-16 sm:gap-20">
            {linkColumns.map((column, colIndex) => (
              <ul key={colIndex} className="space-y-2.5">
                {column.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="font-sans text-[12px] text-[#6B5344] transition-colors hover:text-[#3D2E24]"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
