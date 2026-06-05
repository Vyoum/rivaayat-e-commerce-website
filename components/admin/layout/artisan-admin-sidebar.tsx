"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Palette,
  Package,
  ShoppingBag,
  Sparkles,
  Truck,
  Settings,
  HelpCircle,
  LogOut,
  Plus,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Artisan Hub", icon: Palette, href: "/admin/community/artisans" },
  { label: "Inventory", icon: Package, href: "/admin/store/products" },
  { label: "Orders", icon: ShoppingBag, href: "/admin/commerce/orders" },
  { label: "Collections", icon: Sparkles, href: "/admin/store/products" },
  { label: "Logistics", icon: Truck, href: "/admin/commerce/orders" },
  { label: "Settings", icon: Settings, href: "/admin/settings" },
]

export function ArtisanAdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed top-0 left-0 z-30 flex h-screen w-[220px] flex-col bg-[#F2EBE1]">
      <div className="px-5 pt-7 pb-5">
        <p className="font-serif text-[17px] text-[#2B1B12]">House of Indika</p>
        <p className="text-[11px] text-[#9A8070]">Artisan Admin</p>
      </div>

      <div className="px-4 pb-4">
        <button
          type="button"
          className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#2B1B12] px-3 py-2.5 text-[12px] font-medium text-white transition-colors hover:bg-[#3D2B21]"
        >
          <Plus className="size-3.5" />
          Add New Collection
        </button>
      </div>

      <nav className="flex-1 space-y-0.5 px-3">
        {navItems.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors",
                active
                  ? "bg-white text-[#2B1B12] shadow-sm"
                  : "text-[#6B5344] hover:bg-white/60"
              )}
            >
              {active && (
                <span className="absolute top-1/2 left-0 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-[#C4783B]" />
              )}
              <item.icon className="size-[17px] shrink-0" strokeWidth={1.75} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="space-y-0.5 border-t border-[#E8D8C3] px-3 py-4">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-[#6B5344] transition-colors hover:bg-white/60"
        >
          <HelpCircle className="size-[17px]" strokeWidth={1.75} />
          Help Center
        </button>
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-[#6B5344] transition-colors hover:bg-white/60"
        >
          <LogOut className="size-[17px]" strokeWidth={1.75} />
          Log Out
        </button>
      </div>
    </aside>
  )
}
