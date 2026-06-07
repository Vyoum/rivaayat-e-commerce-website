import {
  LayoutGrid,
  ShoppingBag,
  Users,
  FileText,
  Store,
  BookOpen,
  type LucideIcon,
} from "lucide-react"

export type AdminNavItem = {
  label: string
  icon: LucideIcon
  href: string
  match: (pathname: string) => boolean
}

export const adminNavItems: AdminNavItem[] = [
  {
    label: "Overview",
    icon: LayoutGrid,
    href: "/admin",
    match: (pathname) => pathname === "/admin",
  },
  {
    label: "Commerce",
    icon: ShoppingBag,
    href: "/admin/commerce/orders",
    match: (pathname) => pathname.startsWith("/admin/commerce"),
  },
  {
    label: "Community",
    icon: Users,
    href: "/admin/community",
    match: (pathname) => pathname.startsWith("/admin/community"),
  },
  {
    label: "Content",
    icon: FileText,
    href: "/admin/content",
    match: (pathname) => pathname.startsWith("/admin/content"),
  },
  {
    label: "Our Story",
    icon: BookOpen,
    href: "/admin/our-story",
    match: (pathname) => pathname.startsWith("/admin/our-story"),
  },
  {
    label: "Store",
    icon: Store,
    href: "/admin/store/products",
    match: (pathname) => pathname.startsWith("/admin/store"),
  },
]

export function isAdminNavActive(item: AdminNavItem, pathname: string) {
  return item.match(pathname)
}
