"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { AdminSidebar } from "./admin-sidebar"
import { AdminTopbar } from "./admin-topbar"
import { CustomOrderCategoriesManager } from "./custom-order-categories-manager"

export function CustomOrderContentPage() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <div className="ml-[220px] flex min-h-screen flex-1 flex-col">
        <AdminTopbar />

        <main className="flex-1 space-y-5 p-6">
          <Link
            href="/admin/content"
            className="inline-flex items-center gap-1.5 text-[12px] text-[#9A8070] hover:text-[#6B5344]"
          >
            <ArrowLeft className="size-3.5" />
            Back to Content
          </Link>

          <div>
            <h1 className="font-serif text-[26px] font-semibold text-[#2D1E17]">Custom Order</h1>
            <p className="mt-1 text-[13px] text-[#9A8070]">
              Edit category names, starting prices, box sizes (250g, 500g, 1kg), form options, and
              per-option pricing shown on the public custom orders page.
            </p>
          </div>

          <section className="rounded-xl border border-[#EDE5D8] bg-[#FAF7F2]/50 p-5 shadow-sm">
            <CustomOrderCategoriesManager />
          </section>
        </main>
      </div>
    </div>
  )
}
