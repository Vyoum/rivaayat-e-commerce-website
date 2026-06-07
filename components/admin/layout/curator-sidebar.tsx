"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutGrid,
  ShoppingBag,
  Users,
  FileText,
  Store,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { HOUSE_OF_INDIKA } from "@/lib/brand"

const navItems = [
  { label: "Overview", icon: LayoutGrid, href: "/admin" },
  { label: "Commerce", icon: ShoppingBag, href: "/admin/commerce/orders" },
  { label: "Community", icon: Users, href: "/admin/community/artisans" },
  { label: "Content", icon: FileText, href: "/admin" },
  { label: "Store", icon: Store, href: "/admin/store/products" },
]

export function CuratorSidebar() {
  const pathname = usePathname()

  const isActive = (href: string, label: string) => {
    if (label === "Store") return pathname.startsWith("/admin/store")
    if (href === "/admin") return pathname === "/admin"
    return pathname.startsWith(href)
  }

  return (
    <aside className="fixed top-0 left-0 z-30 flex h-screen w-[200px] flex-col bg-[#2A1B15]">
      <div className="flex items-center gap-2.5 px-4 pt-7 pb-6">
        <div className="flex size-8 items-center justify-center rounded-full border border-[#C4A882]/30 bg-[#3D2B21]">
          <span className="font-serif text-sm text-[#C4A882]">H</span>
        </div>
        <div>
          <p className="font-serif text-[14px] text-white">{HOUSE_OF_INDIKA}</p>
          <p className="text-[10px] text-[#9A8070]">Curator Access</p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 px-2.5">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[12px] font-medium transition-colors",
              isActive(item.href, item.label)
                ? "bg-[#3D2B21] text-[#C4A882]"
                : "text-[#7A6555] hover:bg-[#3D2B21]/50 hover:text-[#C4A882]"
            )}
          >
            <item.icon className="size-4 shrink-0" strokeWidth={1.75} />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
