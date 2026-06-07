import { SiteHeader } from "@/components/site-header"

const customOrdersNavItems = [
  { label: "Our Story", href: "/outerboxdesign" },
  { label: "Collections", href: "/jewellery" },
  { label: "Custom Orders", href: "/custom-orders", active: true },
  { label: "Contact", href: "#" },
]

export function CustomOrdersHeader() {
  return <SiteHeader navItems={customOrdersNavItems} className="bg-[#FCFAF5]" />
}
