"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutGrid,
  ShoppingBag,
  Users,
  FileText,
  Store,
  Settings,
  HelpCircle,
  Plus,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { HOUSE_OF_INDIKA } from "@/lib/brand"

const navItems = [
  { label: "Overview", icon: LayoutGrid, href: "/admin" },
  { label: "Commerce", icon: ShoppingBag, href: "/admin/commerce/custom-orders" },
  { label: "Community", icon: Users, href: "/admin/community/artisans" },
  { label: "Content", icon: FileText, href: "/admin" },
  { label: "Store", icon: Store, href: "/admin/store/products" },
]

type CommandSidebarProps = {
  subtitle?: string
  actionLabel?: string
  activeSection?: string
}

export function CommandSidebar({
  subtitle = "Command Centre",
  actionLabel = "+ New Collection",
  activeSection,
}: CommandSidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string, label: string) => {
    if (activeSection) return activeSection === label
    if (label === "Overview") return pathname === "/admin"
    if (label === "Commerce") return pathname.startsWith("/admin/commerce")
    if (label === "Community") return pathname.startsWith("/admin/community")
    if (label === "Store") return pathname.startsWith("/admin/store")
    return pathname.startsWith(href)
  }

  return (
    <aside className="fixed top-0 left-0 z-30 flex h-screen w-[220px] flex-col bg-[#2B1B12]">
      <div className="flex items-center gap-2.5 px-5 pt-7 pb-5">
        <div className="flex size-8 items-center justify-center rounded-full bg-[#C4A882]/20">
          <span className="font-serif text-sm text-[#C4A882]">H</span>
        </div>
        <div>
          <p className="font-serif text-[15px] text-white">{HOUSE_OF_INDIKA}</p>
          <p className="text-[11px] text-[#9A8070]">{subtitle}</p>
        </div>
      </div>

      <div className="px-4 pb-4">
        <button
          type="button"
          className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#F5D7B5] px-3 py-2.5 text-[12px] font-semibold text-[#2B1B12] transition-colors hover:bg-[#EDD9B8]"
        >
          <Plus className="size-3.5" />
          {actionLabel.replace("+ ", "")}
        </button>
      </div>

      <nav className="flex-1 space-y-0.5 px-3">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors",
              isActive(item.href, item.label)
                ? "bg-[#3D2B21] text-white"
                : "text-[#9A8070] hover:bg-[#3D2B21]/50 hover:text-[#C4A882]"
            )}
          >
            <item.icon className="size-[17px] shrink-0" strokeWidth={1.75} />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="space-y-0.5 border-t border-[#3D2B21] px-3 py-4">
        <Link
          href="/admin/settings"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-[#9A8070] transition-colors hover:bg-[#3D2B21]/50 hover:text-[#C4A882]"
        >
          <Settings className="size-[17px]" strokeWidth={1.75} />
          Settings
        </Link>
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-[#9A8070] transition-colors hover:bg-[#3D2B21]/50 hover:text-[#C4A882]"
        >
          <HelpCircle className="size-[17px]" strokeWidth={1.75} />
          Support
        </button>
      </div>
    </aside>
  )
}
