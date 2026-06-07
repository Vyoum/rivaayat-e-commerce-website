"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Settings2, Sparkles } from "lucide-react"
import { CatalogHeader } from "@/components/catalog/catalog-header"
import { CatalogProductCard } from "@/components/catalog/catalog-product-card"
import { cn } from "@/lib/utils"
import type { CategoryConfig } from "@/lib/category-catalog"

const PAGE_SIZE = 6

type ActiveFilter = "under-5000" | "gold-plated"

const filterLabels: Record<ActiveFilter, string> = {
  "under-5000": "Under ₹5,000",
  "gold-plated": "Gold Plated",
}

export function CategoryListingPage({ category }: { category: CategoryConfig }) {
  const [activeSubcategory, setActiveSubcategory] = useState("")
  const [sortBy, setSortBy] = useState("best-selling")
  const [page, setPage] = useState(1)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([])

  const filteredProducts = useMemo(() => {
    let items = category.products.filter((product) => {
      if (activeSubcategory && product.subcategory !== activeSubcategory) return false
      if (activeFilters.includes("under-5000") && product.price > 5000) return false
      if (activeFilters.includes("gold-plated") && !product.tags?.includes("gold-plated")) return false
      return true
    })

    if (sortBy === "price-low") {
      items = [...items].sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-high") {
      items = [...items].sort((a, b) => b.price - a.price)
    }

    return items
  }, [category.products, activeSubcategory, activeFilters, sortBy])

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    (currentPage - 1) * PAGE_SIZE + visibleCount,
  )

  function toggleFilter(filter: ActiveFilter) {
    setActiveFilters((prev) =>
      prev.includes(filter) ? prev.filter((item) => item !== filter) : [...prev, filter],
    )
    setPage(1)
    setVisibleCount(PAGE_SIZE)
  }

  function clearFilters() {
    setActiveFilters([])
    setPage(1)
    setVisibleCount(PAGE_SIZE)
  }

  return (
    <main className="min-h-screen bg-[#FCF8F4]">
      <CatalogHeader />

      <section className="border-b border-[#E8E0D4] bg-[#E5D9C5]">
        <div className="mx-auto max-w-[1100px] px-5 py-10 lg:px-8 lg:py-12">
          <Sparkles className="mb-4 size-4 text-[#9A8070]/70" strokeWidth={1.5} />

          <nav className="font-sans text-[12px] text-[#6B5344]">
            <Link href="/" className="hover:text-[#3D2E24]">
              Home
            </Link>
            <span className="mx-2">&gt;</span>
            <span>{category.breadcrumb}</span>
          </nav>

          <h1 className="mt-4 font-serif text-[34px] font-normal leading-tight text-[#3D2E24] sm:text-[42px]">
            {category.title}
          </h1>
          <p className="mt-3 max-w-[640px] font-sans text-[14px] leading-relaxed text-[#6B5344]">
            {category.subtitle}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                setActiveSubcategory("")
                setPage(1)
                setVisibleCount(PAGE_SIZE)
              }}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-5 py-2 font-sans text-[12px] font-medium transition-colors",
                activeSubcategory === ""
                  ? "bg-[#785D44] text-white"
                  : "border border-[#C4B5A5] bg-[#FCF8F4] text-[#6B5344] hover:border-[#785D44]",
              )}
            >
              All Pieces
            </button>
            {category.subcategories.map((sub, index) => {
              const isActive = activeSubcategory === sub.id
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => {
                    setActiveSubcategory(sub.id)
                    setPage(1)
                    setVisibleCount(PAGE_SIZE)
                  }}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-5 py-2 font-sans text-[12px] font-medium transition-colors",
                    isActive
                      ? "bg-[#785D44] text-white"
                      : "border border-[#C4B5A5] bg-[#FCF8F4] text-[#6B5344] hover:border-[#785D44]",
                  )}
                >
                  {index === 0 && sub.icon ? <span className="text-[11px]">{sub.icon}</span> : null}
                  {sub.label}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-5 py-8 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-[#E8E0D4] pb-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-sans text-[13px] text-[#6B5344]">
            Showing {filteredProducts.length} piece{filteredProducts.length === 1 ? "" : "s"}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-10 border border-[#D9CFC0] bg-white px-3 font-sans text-[12px] text-[#3D2E24] outline-none"
            >
              <option value="best-selling">Best Selling</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>

            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 border border-[#D9CFC0] bg-white px-4 font-sans text-[12px] font-medium text-[#3D2E24]"
            >
              <Settings2 className="size-3.5" />
              Filter
            </button>
          </div>
        </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {(Object.keys(filterLabels) as ActiveFilter[]).map((filter) => {
              const isActive = activeFilters.includes(filter)
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => toggleFilter(filter)}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full border px-3 py-1 font-sans text-[11px] transition-colors",
                    isActive
                      ? "border-[#785D44] bg-[#785D44] text-white"
                      : "border-[#D9CFC0] bg-white text-[#6B5344] hover:border-[#785D44]",
                  )}
                >
                  {filterLabels[filter]}
                  {isActive ? <span aria-hidden>×</span> : null}
                </button>
              )
            })}
            {activeFilters.length > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="font-sans text-[11px] font-medium uppercase tracking-[0.12em] text-[#846246]"
              >
                Clear All
              </button>
            )}
          </div>

        {pageProducts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-sans text-[15px] text-[#9A8070]">No pieces match these filters.</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {pageProducts.map((product) => (
              <CatalogProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {filteredProducts.length > PAGE_SIZE && (
          <div className="mt-10 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex size-8 items-center justify-center text-[#9A8070] disabled:opacity-30"
              aria-label="Previous page"
            >
              <ChevronLeft className="size-4" />
            </button>

            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNumber = index + 1
              return (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => {
                    setPage(pageNumber)
                    setVisibleCount(PAGE_SIZE)
                  }}
                  className={cn(
                    "flex size-8 items-center justify-center font-sans text-[13px]",
                    currentPage === pageNumber
                      ? "rounded-full bg-[#785D44] text-white"
                      : "text-[#6B5344] hover:text-[#3D2E24]",
                  )}
                >
                  {pageNumber}
                </button>
              )
            })}

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex size-8 items-center justify-center text-[#9A8070] disabled:opacity-30"
              aria-label="Next page"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        )}

        {visibleCount < filteredProducts.length && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
              className="min-w-[220px] border border-[#785D44] px-8 py-3 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[#785D44] transition-colors hover:bg-[#785D44] hover:text-white"
            >
              Load More
            </button>
          </div>
        )}
      </section>
    </main>
  )
}
