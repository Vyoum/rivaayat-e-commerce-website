import { SiteHeader } from "@/components/site-header"

const catalogNavItems = [
  { label: "Collections", href: "/jewellery", active: true },
  { label: "Artisans", href: "/artisans/devendra-khatri" },
  { label: "Our Story", href: "/outerboxdesign" },
  { label: "Custom Orders", href: "/custom-orders" },
]

export function CatalogHeader() {
  return <SiteHeader navItems={catalogNavItems} />
}
