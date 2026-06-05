"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Settings, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { adminNavItems, isAdminNavActive } from "./nav-config"

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed top-0 left-0 z-30 flex h-screen w-[220px] flex-col bg-[#2D1E17]">
      <div className="px-5 pt-7 pb-6">
        <p className="text-[11px] font-medium tracking-[0.15em] text-[#6B5344] uppercase">
          House of Indika
        </p>
        <p className="mt-1 text-[13px] font-medium text-[#C4A882]">
          Admin Console
        </p>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {adminNavItems.map((item) => {
          const active = isAdminNavActive(item, pathname)
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors",
                active
                  ? "bg-[#3D2B21] text-white"
                  : "text-[#9A8070] hover:bg-[#3D2B21]/50 hover:text-[#C4A882]"
              )}
            >
              {active && (
                <span className="absolute top-1/2 left-0 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-[#C4A882]" />
              )}
              <item.icon
                className={cn(
                  "size-[18px] shrink-0",
                  active ? "text-white" : "text-[#7A6555]"
                )}
                strokeWidth={1.75}
              />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="space-y-0.5 border-t border-[#3D2B21] px-3 py-4">
        <Link
          href="/admin/settings"
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors",
            pathname === "/admin/settings"
              ? "bg-[#3D2B21] text-white"
              : "text-[#9A8070] hover:bg-[#3D2B21]/50 hover:text-[#C4A882]"
          )}
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

      <div className="border-t border-[#3D2B21] px-4 py-5">
        <div className="flex items-center gap-3">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face"
            alt="Kala"
            className="size-9 rounded-full object-cover"
          />
          <div>
            <p className="text-[13px] font-medium text-white">Kala</p>
            <p className="text-[11px] text-[#9A8070]">Brand Owner</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
