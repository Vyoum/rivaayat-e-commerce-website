"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import {
  Search,
  Bell,
  HelpCircle,
  LayoutGrid,
  List,
  ExternalLink,
  ChevronDown,
  Loader2,
} from "lucide-react"

import { AdminSidebar } from "./admin-sidebar"
import { AdminUserAvatar } from "./admin-user-avatar"
import { useAdminProfile } from "./admin-session-provider"
import { HOUSE_OF_INDIKA } from "@/lib/brand"
import { formatProductPrice } from "@/lib/product-utils"
import type { AdminProduct } from "@/types/product"
import type { AdminProductTab } from "@/types/product"
import { ADMIN_CATEGORY_COLORS } from "@/lib/product-catalog"

const tabs: { label: string; tab: AdminProductTab; countKey: keyof ProductCounts }[] = [
  { label: "All", tab: "All", countKey: "All" },
  { label: "Clothing", tab: "clothing", countKey: "clothing" },
  { label: "Jewellery", tab: "jewellery", countKey: "jewellery" },
  { label: "Décor", tab: "decor", countKey: "decor" },
  { label: "Custom Food", tab: "custom_food", countKey: "custom_food" },
  { label: "Draft", tab: "Draft", countKey: "Draft" },
]

type ProductCounts = Record<"All" | "jewellery" | "clothing" | "decor" | "custom_food" | "Draft", number>

export function ProductsPage() {
  const profile = useAdminProfile()
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [counts, setCounts] = useState<ProductCounts>({
    All: 0,
    jewellery: 0,
    clothing: 0,
    decor: 0,
    custom_food: 0,
    Draft: 0,
  })
  const [activeTab, setActiveTab] = useState<AdminProductTab>("All")
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ tab: activeTab })
      if (query.trim()) params.set("q", query.trim())

      const res = await fetch(`/api/admin/products?${params}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to load products")

      setProducts(data.products ?? [])
      if (data.counts) setCounts(data.counts)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products")
    } finally {
      setLoading(false)
    }
  }, [activeTab, query])

  useEffect(() => {
    const timer = setTimeout(loadProducts, query ? 300 : 0)
    return () => clearTimeout(timer)
  }, [loadProducts, query])

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <div className="ml-[220px] flex min-h-screen flex-1 flex-col bg-[#F9F6F1]">
        <header className="flex h-[56px] items-center justify-between border-b border-[#EDE5D8] bg-white px-6">
          <span className="font-serif text-[16px] text-[#2B1B12]">{HOUSE_OF_INDIKA}</span>
          <nav className="flex items-center gap-5">
            {["Dashboard", "Analytics", "Settings"].map((link) => (
              <Link
                key={link}
                href={link === "Dashboard" ? "/admin" : "/admin/settings"}
                className="text-[13px] font-medium text-[#6B5344] hover:text-[#2B1B12]"
              >
                {link}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button type="button" className="text-[#6B5344]">
              <Bell className="size-[18px]" />
            </button>
            <button type="button" className="text-[#6B5344]">
              <HelpCircle className="size-[18px]" />
            </button>
            {profile ? <AdminUserAvatar profile={profile} size="sm" /> : null}
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="mb-5 flex items-start justify-between">
            <div>
              <h1 className="font-serif text-[26px] font-semibold text-[#2B1B12]">Products</h1>
              <p className="mt-1 text-[13px] text-[#9A8070]">
                Manage your handcrafted catalogue — clothing, jewellery, décor, food.
              </p>
            </div>
            <Link
              href="/admin/store/products/new"
              className="rounded-xl bg-[#2B1B12] px-5 py-2.5 text-[12px] font-bold tracking-wide text-white uppercase hover:bg-[#3D2B21]"
            >
              + Add New Product
            </Link>
          </div>

          <div className="mb-5 flex items-center gap-1 border-b border-[#EDE5D8]">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.tab

              return (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => setActiveTab(tab.tab)}
                  className={`px-4 py-2.5 text-[13px] font-medium ${
                    isActive
                      ? "border-b-2 border-[#2B1B12] text-[#2B1B12]"
                      : "text-[#9A8070]"
                  }`}
                >
                  {tab.label} ({counts[tab.countKey]})
                </button>
              )
            })}
          </div>

          <div className="mb-5 flex items-center gap-3 rounded-xl border border-[#EDE5D8] bg-white p-3">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#9A8070]" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, slug, or artisan..."
                className="h-9 w-full rounded-lg border border-[#EDE5D8] bg-[#FAF7F2] pr-3 pl-9 text-[13px] outline-none"
              />
            </div>
            <div className="flex items-center gap-1 rounded-lg border border-[#EDE5D8] p-1">
              <button type="button" className="rounded-md bg-[#2B1B12] p-1.5 text-white">
                <LayoutGrid className="size-4" />
              </button>
              <button type="button" className="rounded-md p-1.5 text-[#9A8070]">
                <List className="size-4" />
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20 text-[#9A8070]">
              <Loader2 className="mr-2 size-5 animate-spin" />
              Loading products…
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#EDE5D8] bg-white px-6 py-16 text-center">
              <p className="font-serif text-[18px] text-[#2B1B12]">No products yet</p>
              <p className="mt-2 text-[13px] text-[#9A8070]">
                Add your first product — it will appear on the site once published.
              </p>
              <Link
                href="/admin/store/products/new"
                className="mt-5 inline-block rounded-xl bg-[#2B1B12] px-5 py-2.5 text-[12px] font-bold tracking-wide text-white uppercase"
              >
                + Add New Product
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-5">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="overflow-hidden rounded-xl border border-[#EDE5D8] bg-white shadow-sm"
                >
                  <div className="relative">
                    <img
                      src={product.imageUrls[0] ?? "/placeholder.svg"}
                      alt={product.name}
                      className="h-[200px] w-full object-cover"
                    />
                    <span
                      className={`absolute top-3 left-3 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${ADMIN_CATEGORY_COLORS[product.category]}`}
                    >
                      {product.categoryLabel}
                    </span>
                    <span
                      className={`absolute top-3 right-3 size-2.5 rounded-full ${
                        product.isPublished
                          ? product.inStock
                            ? "bg-[#4CAF50]"
                            : "bg-[#FF9800]"
                          : "bg-[#9A8070]"
                      }`}
                      title={
                        product.isPublished
                          ? product.inStock
                            ? "Published & in stock"
                            : "Published, out of stock"
                          : "Draft"
                      }
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-serif text-[16px] font-semibold text-[#2B1B12]">
                        {product.name}
                      </h3>
                      <span className="shrink-0 text-[14px] font-semibold text-[#2B1B12]">
                        {formatProductPrice(product.price)}
                      </span>
                    </div>
                    {product.artisanName && (
                      <p className="mt-0.5 text-[12px] text-[#9A8070] italic">
                        by {product.artisanName}
                      </p>
                    )}
                    <div className="mt-3 flex items-center justify-between border-t border-[#F5EDE3] pt-3">
                      <span className="text-[11px] text-[#9A8070]">
                        {product.isPublished ? "Live" : "Draft"} · /{product.slug}
                      </span>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/store/products/${product.id}/edit`}
                          className="text-[11px] font-bold tracking-wide text-[#6B5344] uppercase hover:text-[#2B1B12]"
                        >
                          Edit
                        </Link>
                        {product.isPublished && (
                          <Link
                            href={`/products/${product.slug}`}
                            target="_blank"
                            className="text-[#9A8070] hover:text-[#2B1B12]"
                          >
                            <ExternalLink className="size-3.5" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
