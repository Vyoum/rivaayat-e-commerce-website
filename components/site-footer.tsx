import Link from "next/link"
import {
  Facebook,
  Handshake,
  Instagram,
  RefreshCw,
  Shield,
  Truck,
  Twitter,
  Youtube,
} from "lucide-react"
import { HOUSE_OF_INDIKA, INDIKA_HINDI } from "@/lib/brand"

const onlineShoppingLinks = [
  { label: "Jewellery", href: "/jewellery" },
  { label: "Custom Food", href: "/custom-laddoos" },
  { label: "The Loom Series", href: "/clothing" },
  { label: "Home & Living", href: "/decor" },
  { label: "New Arrivals", href: "/jewellery" },
]

const customerPolicyLinks = [
  { label: "Contact Us / Concierge", href: "#" },
  { label: "Track Orders", href: "/profile" },
  { label: "Shipping & Delivery", href: "#" },
  { label: "Cancellation & Returns", href: "#" },
  { label: "FAQ", href: "#" },
  { label: "Grievance Redressal", href: "#" },
  { label: "FSSAI Food Safety Connect", href: "#" },
]

const usefulLinks = [
  { label: "Our Sourcing Story", href: "/outerboxdesign" },
  { label: "Sustainability & Impact", href: "#" },
  { label: `The ${INDIKA_HINDI} Journal`, href: "#" },
  { label: "Careers", href: "#" },
  { label: "Corporate Information", href: "#" },
]

const socialLinks = [
  { label: "Facebook", href: "#", icon: Facebook },
  { label: "Instagram", href: "#", icon: Instagram },
  { label: "YouTube", href: "#", icon: Youtube },
  { label: "X (Twitter)", href: "#", icon: Twitter },
]

const trustItems = [
  {
    icon: Shield,
    title: "100% ORIGINAL",
    description: `100% Original guarantee for all products at ${HOUSE_OF_INDIKA}.`,
  },
  {
    icon: RefreshCw,
    title: "EASY RETURNS",
    description: "Complimentary returns within 14 days of receiving your order.",
  },
  {
    icon: Handshake,
    title: "ETHICALLY SOURCED",
    description: "Supporting artisan communities across India.",
  },
  {
    icon: Truck,
    title: "SECURE DELIVERY",
    description: "Reliable nationwide shipping and order tracking.",
  },
]

function FooterLinkColumn({
  title,
  links,
}: {
  title: string
  links: { label: string; href: string }[]
}) {
  return (
    <div>
      <h4 className="font-sans text-[10px] font-semibold tracking-[0.2em] text-[#F5F0E8]/45 uppercase">
        {title}
      </h4>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="font-sans text-[12px] text-[#F5F0E8]/70 transition-colors hover:text-[#F5F0E8]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function SiteFooter() {
  return (
    <footer className="bg-[#1C1917] text-[#F5F0E8]">
      <div className="mx-auto max-w-[1100px] px-5 py-14 lg:px-8 lg:py-16">
        <div className="mb-12 max-w-[280px]">
          <Link href="/" className="inline-block">
            <span className="font-serif text-[36px] leading-none text-[#F5F0E8]">{INDIKA_HINDI}</span>
            <span className="mt-1 block font-sans text-[10px] tracking-[0.28em] text-[#F5F0E8]/50">
              House of
            </span>
          </Link>
          <p className="mt-5 font-sans text-[12px] leading-[1.7] text-[#F5F0E8]/65">
            Where every purchase nurtures a life, preserves a tradition, and weaves a story of hope.
          </p>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <FooterLinkColumn title="Online Shopping" links={onlineShoppingLinks} />
          <FooterLinkColumn title="Customer Policies" links={customerPolicyLinks} />
          <FooterLinkColumn title="Useful Links" links={usefulLinks} />

          <div>
            <h4 className="font-sans text-[10px] font-semibold tracking-[0.2em] text-[#F5F0E8]/45 uppercase">
              Experience {HOUSE_OF_INDIKA} on Mobile
            </h4>

            <div className="mt-4 flex flex-col gap-2.5">
              <Link
                href="#"
                className="inline-flex h-10 w-[140px] items-center gap-2 rounded-md border border-[#F5F0E8]/20 bg-[#F5F0E8]/5 px-3 transition-colors hover:bg-[#F5F0E8]/10"
                aria-label="Get it on Google Play"
              >
                <svg viewBox="0 0 24 24" className="size-5 shrink-0" aria-hidden>
                  <path
                    fill="currentColor"
                    d="M3.6 1.8c-.3.3-.5.8-.5 1.4v17.6c0 .6.2 1.1.5 1.4l.1.1 9.9-9.9v-.2L3.7 1.7l-.1.1zm12.4 8.9 3.1-3.1-4.4-2.5-5 5 2.5 2.5 3.8-2.4v-.5zm-9.1 9.1 5-5-2.5-2.5-4.4 2.5 3.1 3.1c.4.4 1 .4 1.4 0l-.6-.1zm11.5-6.6-3.2 1.9v2.5l3.2 1.9c.5.3 1 .1 1.2-.4.1-.2.1-.5 0-.7-.2-.5-.7-.7-1.2-.4v.2z"
                  />
                </svg>
                <span className="text-left leading-tight">
                  <span className="block font-sans text-[8px] text-[#F5F0E8]/55">GET IT ON</span>
                  <span className="block font-sans text-[11px] font-semibold text-[#F5F0E8]">
                    Google Play
                  </span>
                </span>
              </Link>

              <Link
                href="#"
                className="inline-flex h-10 w-[140px] items-center gap-2 rounded-md border border-[#F5F0E8]/20 bg-[#F5F0E8]/5 px-3 transition-colors hover:bg-[#F5F0E8]/10"
                aria-label="Download on the App Store"
              >
                <svg viewBox="0 0 24 24" className="size-5 shrink-0" aria-hidden>
                  <path
                    fill="currentColor"
                    d="M18.7 12.6c0-2.5 2-3.7 2.1-3.8-1.1-1.7-2.9-1.9-3.5-2-1.5-.1-2.9.9-3.7.9-.8 0-2-.9-3.3-.8-1.7 0-3.3 1-4.2 2.5-1.8 3.1-.5 7.7 1.3 10.2.9 1.3 1.9 2.7 3.3 2.7 1.3-.1 1.8-.8 3.4-.8 1.6 0 2 .8 3.3.8 1.4 0 2.3-1.3 3.1-2.6 1-1.4 1.4-2.8 1.4-2.9-.1 0-2.8-1.1-2.8-4.2zm-2.6-7.8c.7-.9 1.2-2.1 1.1-3.3-1.1.1-2.3.7-3.1 1.6-.7.8-1.2 2-1 3.2 1.2.1 2.4-.6 3-1.5z"
                  />
                </svg>
                <span className="text-left leading-tight">
                  <span className="block font-sans text-[8px] text-[#F5F0E8]/55">Download on the</span>
                  <span className="block font-sans text-[11px] font-semibold text-[#F5F0E8]">
                    App Store
                  </span>
                </span>
              </Link>
            </div>

            <h4 className="mt-8 font-sans text-[10px] font-semibold tracking-[0.2em] text-[#F5F0E8]/45 uppercase">
              Keep in Touch
            </h4>
            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex size-8 items-center justify-center rounded-full bg-[#F5F0E8]/10 text-[#F5F0E8]/70 transition-colors hover:bg-[#F5F0E8]/18 hover:text-[#F5F0E8]"
                >
                  <Icon className="size-3.5" strokeWidth={1.5} />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-[#F5F0E8]/10 pt-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {trustItems.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex gap-3">
                <Icon className="mt-0.5 size-4 shrink-0 text-[#F5F0E8]/55" strokeWidth={1.5} />
                <div>
                  <p className="font-sans text-[10px] font-semibold tracking-[0.14em] text-[#F5F0E8]/75 uppercase">
                    {title}
                  </p>
                  <p className="mt-1 font-sans text-[11px] leading-[1.55] text-[#F5F0E8]/50">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-[#F5F0E8]/10 pt-8 sm:flex-row">
          <p className="font-sans text-[11px] text-[#F5F0E8]/45">
            © 2026 {INDIKA_HINDI}. Crafted with love in India.
          </p>
          <div className="flex items-center gap-5 font-sans text-[11px] text-[#F5F0E8]/45">
            <Link href="#" className="transition-colors hover:text-[#F5F0E8]/75">
              Privacy Policy
            </Link>
            <Link href="#" className="transition-colors hover:text-[#F5F0E8]/75">
              Terms of Service
            </Link>
            <Link href="#" className="transition-colors hover:text-[#F5F0E8]/75">
              Shipping
            </Link>
          </div>
        </div>

        <div className="mt-10 text-center">
          <p className="font-serif text-[18px] italic text-[#F5F0E8]/35 sm:text-[20px]">
            &apos;आपकी हर खरीद एक कहानी लिखती है&apos;
          </p>
          <p className="mt-2 font-sans text-[11px] text-[#F5F0E8]/28">
            Every purchase you make writes a story
          </p>
        </div>
      </div>
    </footer>
  )
}
