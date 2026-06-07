import { SiteHeader } from "@/components/site-header"

const productNavItems = [
  { label: "Heritage", href: "/outerboxdesign" },
  { label: "Shop", href: "/jewellery", active: true },
  { label: "Artisans", href: "/artisans/devendra-khatri" },
  { label: "Journal", href: "#" },
]

export function ProductDetailHeader() {
  return <SiteHeader navItems={productNavItems} className="bg-[#F5F3E9]" />
}
