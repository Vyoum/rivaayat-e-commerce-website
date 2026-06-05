"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const tabs = [
  { label: "Orders", href: "/admin/commerce/orders" },
  { label: "Custom Orders", href: "/admin/commerce/custom-orders" },
]

export function CommerceSubnav() {
  const pathname = usePathname()

  return (
    <div className="mb-5 flex items-center gap-1 border-b border-[#EDE5D8]">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={cn(
            "px-4 py-2.5 text-[13px] font-medium transition-colors",
            pathname === tab.href
              ? "border-b-2 border-[#2B1B12] text-[#2B1B12]"
              : "text-[#9A8070] hover:text-[#2B1B12]"
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  )
}
