"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutGrid,
  Users,
  Hammer,
  Package,
  ShoppingBag,
  Settings,
  HelpCircle,
  LogOut,
  Plus,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Dashboard", icon: LayoutGrid, href: "/admin" },
  { label: "Artisans", icon: Users, href: "/admin/community/artisans" },
  { label: "Workshops", icon: Hammer, href: "/admin/community/artisans" },
  { label: "Inventory", icon: Package, href: "/admin/store/products" },
  { label: "Orders", icon: ShoppingBag, href: "/admin/commerce/orders" },
  { label: "Settings", icon: Settings, href: "/admin/settings" },
]

export function ArtisanCommandSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed top-0 left-0 z-30 flex h-screen w-[220px] flex-col bg-[#2D1B14]">
      <div className="px-5 pt-7 pb-5">
        <p className="font-serif text-[15px] text-white">House of Indika</p>
        <p className="text-[11px] text-[#9A8070]">Artisan Command Centre</p>
      </div>

      <nav className="flex-1 space-y-0.5 px-3">
        {navItems.map((item) => {
          const active =
            item.label === "Artisans"
              ? pathname.startsWith("/admin/community/artisans")
              : pathname === item.href
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors",
                active
                  ? "bg-[#3D2B21] text-white"
                  : "text-[#9A8070] hover:bg-[#3D2B21]/50 hover:text-[#C4A882]"
              )}
            >
              <item.icon className="size-[17px] shrink-0" strokeWidth={1.75} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-4 pb-4">
        <button
          type="button"
          className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#D9C5B2] px-3 py-2.5 text-[12px] font-semibold text-[#2D1B14] transition-colors hover:bg-[#CDB89F]"
        >
          <Plus className="size-3.5" />
          New Artisan
        </button>
      </div>

      <div className="space-y-0.5 border-t border-[#3D2B21] px-3 py-4">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-[#9A8070] transition-colors hover:bg-[#3D2B21]/50"
        >
          <HelpCircle className="size-[17px]" strokeWidth={1.75} />
          Help
        </button>
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-[#9A8070] transition-colors hover:bg-[#3D2B21]/50"
        >
          <LogOut className="size-[17px]" strokeWidth={1.75} />
          Logout
        </button>
      </div>

      <div className="border-t border-[#3D2B21] px-4 py-4">
        <div className="flex items-center gap-3">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face"
            alt="Admin"
            className="size-8 rounded-full object-cover"
          />
          <p className="text-[12px] font-medium text-white">Admin Profile</p>
        </div>
      </div>
    </aside>
  )
}
