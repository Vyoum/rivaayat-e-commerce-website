import Link from "next/link"

const paymentMethods = ["UPI", "VISA", "MASTERCARD", "COD"]

const footerLinks = [
  { label: "Our Lineage", href: "#" },
  { label: "Artisan Registry", href: "#" },
  { label: "Care Guide", href: "#" },
  { label: "Shipping", href: "#" },
  { label: "Contact", href: "#" },
]

export function CartFooter() {
  return (
    <footer className="border-t border-[#EDE5D8] bg-[#FCFAF5] px-6 py-14">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8">
        <div className="flex items-center gap-8 sm:gap-12">
          {paymentMethods.map((method) => (
            <span
              key={method}
              className="font-sans text-[11px] font-medium uppercase tracking-[0.15em] text-[#9A8070]"
            >
              {method}
            </span>
          ))}
        </div>

        <Link
          href="/"
          className="font-serif text-[36px] font-light tracking-wide text-[#2B1B12] sm:text-[42px]"
        >
          House of Indika
        </Link>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-sans text-[12px] text-[#6B5344] underline underline-offset-4 transition-colors hover:text-[#2B1B12]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="font-sans text-[12px] text-[#9A8070]">
          © 2026 House of Indika. Crafted with Love.{" "}
          <span className="text-[#6B5344]">नमस्ते</span>
        </p>
      </div>
    </footer>
  )
}
