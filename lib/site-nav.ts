export type SiteNavItem = {
  label: string
  href: string
}

export const SITE_NAV_ITEMS: SiteNavItem[] = [
  { label: "Our Story", href: "/outerboxdesign" },
  { label: "Collections", href: "/jewellery" },
  { label: "Custom Orders", href: "/custom-orders" },
  { label: "Artisans", href: "/artisans" },
  { label: "Contact", href: "/contact" },
]

export function isNavItemActive(pathname: string, href: string) {
  if (href === "#") return false
  if (href === "/") return pathname === "/"
  if (href === "/jewellery") {
    return (
      pathname === "/jewellery" ||
      pathname === "/clothing" ||
      pathname === "/decor" ||
      pathname === "/custom-laddoos" ||
      pathname.startsWith("/products/") ||
      pathname.startsWith("/collections/")
    )
  }
  if (href === "/outerboxdesign") return pathname === "/outerboxdesign" || pathname === "/ourstory"
  if (href === "/custom-orders") return pathname === "/custom-orders"
  if (href === "/contact") return pathname === "/contact"
  if (href.startsWith("/artisans")) return pathname.startsWith("/artisans")
  return pathname === href || pathname.startsWith(`${href}/`)
}
