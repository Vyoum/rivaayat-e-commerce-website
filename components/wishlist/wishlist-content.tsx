"use client"

import { useEffect, useMemo, useState, type ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Heart,
  Share2,
  Trash2,
  ShoppingBag,
  ArrowUpRight,
  LayoutGrid,
  List,
  SlidersHorizontal,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useWishlist } from "@/components/providers/wishlist-provider"
import { useAuth } from "@/hooks/use-auth"
import {
  DEFAULT_WISHLIST_FILTERS,
  WISHLIST_PRICE_FILTER_LABELS,
  WISHLIST_STOCK_FILTER_LABELS,
  filterWishlistItems,
  getWishlistCategoryLabel,
  getWishlistCategoryOptions,
  getWishlistInStock,
  getWishlistSubcategoryLabel,
  getWishlistSubcategoryOptions,
  type WishlistFilters,
  type WishlistPriceFilter,
  type WishlistStockFilter,
} from "@/lib/wishlist-filters"

function formatAddedDate(isoDate: string) {
  const diffMs = Date.now() - new Date(isoDate).getTime()
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (days <= 0) return "Today"
  if (days === 1) return "1 day ago"
  if (days < 7) return `${days} days ago`
  if (days < 14) return "1 week ago"
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  return `${Math.floor(days / 30)} month${Math.floor(days / 30) === 1 ? "" : "s"} ago`
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-full px-3.5 py-1.5 font-sans text-[11px] font-medium transition-colors",
        active
          ? "bg-[#846246] text-white"
          : "border border-[#D9CFC0] bg-white text-[#6B5344] hover:border-[#846246]",
      )}
    >
      {children}
    </button>
  )
}

export function WishlistContent() {
  const router = useRouter()
  const { loading: authLoading, isLoggedIn } = useAuth()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filters, setFilters] = useState<WishlistFilters>(DEFAULT_WISHLIST_FILTERS)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const { items, removeItem } = useWishlist()

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.replace("/login?next=/wishlist")
    }
  }, [authLoading, isLoggedIn, router])

  const categoryOptions = useMemo(() => getWishlistCategoryOptions(items), [items])
  const subcategoryOptions = useMemo(
    () => getWishlistSubcategoryOptions(items, filters.category),
    [items, filters.category],
  )

  const filteredItems = useMemo(() => filterWishlistItems(items, filters), [items, filters])

  const hasActiveFilters =
    filters.category !== "all" ||
    filters.subcategory !== "all" ||
    filters.price !== "all" ||
    filters.stock !== "all"

  const displayItems = filteredItems.map((item) => ({
    id: item.id,
    name: item.name,
    category: getWishlistCategoryLabel(item),
    subcategory: getWishlistSubcategoryLabel(item),
    price: item.price,
    image: item.image,
    artisan: item.artisan,
    addedDate: formatAddedDate(item.addedAt),
    inStock: getWishlistInStock(item),
    slug: item.slug,
  }))

  const inStockCount = items.filter((item) => getWishlistInStock(item)).length

  function updateFilters(patch: Partial<WishlistFilters>) {
    setFilters((prev) => {
      const next = { ...prev, ...patch }
      if (patch.category && patch.category !== prev.category) {
        next.subcategory = "all"
      }
      return next
    })
  }

  function clearFilters() {
    setFilters(DEFAULT_WISHLIST_FILTERS)
  }

  if (authLoading || !isLoggedIn) {
    return null
  }

  return (
    <>
      {/* Stats Bar */}
      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-[#EDE8DC]/50 px-6 py-4 border border-[#E8E0D4]">
            <p className="font-sans text-[12px] font-medium text-[#9A8070] uppercase tracking-wider">
              Total Items
            </p>
            <p className="mt-2 font-serif text-[32px] text-[#3D2E24]">{items.length}</p>
          </div>
          <div className="rounded-lg bg-[#8FA68E]/8 px-6 py-4 border border-[#8FA68E]/20">
            <p className="font-sans text-[12px] font-medium text-[#6B8471] uppercase tracking-wider">
              In Stock
            </p>
            <p className="mt-2 font-serif text-[32px] text-[#5C7064]">{inStockCount}</p>
          </div>
          <div className="rounded-lg bg-[#846246]/8 px-6 py-4 border border-[#846246]/20">
            <p className="font-sans text-[12px] font-medium text-[#9A8070] uppercase tracking-wider">
              Total Value
            </p>
            <p className="mt-2 font-serif text-[32px] text-[#6B5344]">
              ₹{items.reduce((sum, item) => sum + item.price, 0).toLocaleString()}
            </p>
          </div>
        </div>
      </section>

      {/* Controls */}
      <section className="mx-auto max-w-7xl px-6 pb-4 lg:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "rounded p-2 transition-colors",
                viewMode === "grid"
                  ? "bg-[#846246] text-white"
                  : "text-[#9A8070] hover:bg-[#EDE8DC]",
              )}
              aria-label="Grid view"
            >
              <LayoutGrid className="size-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "rounded p-2 transition-colors",
                viewMode === "list"
                  ? "bg-[#846246] text-white"
                  : "text-[#9A8070] hover:bg-[#EDE8DC]",
              )}
              aria-label="List view"
            >
              <List className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => setFiltersOpen((open) => !open)}
              className={cn(
                "ml-1 inline-flex items-center gap-2 rounded-full border px-3.5 py-2 font-sans text-[11px] font-medium uppercase tracking-wider transition-colors",
                filtersOpen || hasActiveFilters
                  ? "border-[#846246] bg-[#846246] text-white"
                  : "border-[#D9CFC0] bg-white text-[#6B5344] hover:border-[#846246]",
              )}
            >
              <SlidersHorizontal className="size-3.5" />
              Filters
              {hasActiveFilters ? (
                <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10px]">On</span>
              ) : null}
            </button>
          </div>
          <p className="font-sans text-[13px] text-[#9A8070]">
            Showing {filteredItems.length} of {items.length}{" "}
            {items.length === 1 ? "item" : "items"}
          </p>
        </div>

        {filtersOpen && items.length > 0 ? (
          <div className="mt-4 rounded-xl border border-[#E8E0D4] bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="font-sans text-[12px] font-semibold uppercase tracking-[0.14em] text-[#9A8070]">
                Refine your collection
              </p>
              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1 font-sans text-[11px] font-medium text-[#846246] transition-colors hover:text-[#5C4332]"
                >
                  <X className="size-3" />
                  Clear all
                </button>
              ) : null}
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <p className="mb-2 font-sans text-[11px] font-medium uppercase tracking-wider text-[#9A8070]">
                  Category
                </p>
                <div className="flex flex-wrap gap-2">
                  <FilterPill
                    active={filters.category === "all"}
                    onClick={() => updateFilters({ category: "all" })}
                  >
                    All
                  </FilterPill>
                  {categoryOptions.map((category) => (
                    <FilterPill
                      key={category}
                      active={filters.category === category}
                      onClick={() => updateFilters({ category })}
                    >
                      {category}
                    </FilterPill>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 font-sans text-[11px] font-medium uppercase tracking-wider text-[#9A8070]">
                  Subcategory
                </p>
                <div className="flex flex-wrap gap-2">
                  <FilterPill
                    active={filters.subcategory === "all"}
                    onClick={() => updateFilters({ subcategory: "all" })}
                  >
                    All
                  </FilterPill>
                  {subcategoryOptions.map((subcategory) => (
                    <FilterPill
                      key={subcategory}
                      active={filters.subcategory === subcategory}
                      onClick={() => updateFilters({ subcategory })}
                    >
                      {subcategory}
                    </FilterPill>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="wishlist-price-filter"
                    className="mb-2 block font-sans text-[11px] font-medium uppercase tracking-wider text-[#9A8070]"
                  >
                    Price
                  </label>
                  <select
                    id="wishlist-price-filter"
                    value={filters.price}
                    onChange={(event) =>
                      updateFilters({ price: event.target.value as WishlistPriceFilter })
                    }
                    className="h-10 w-full rounded-lg border border-[#D9CFC0] bg-[#FCFAF5] px-3 font-sans text-[12px] text-[#3D2E24] outline-none focus:border-[#846246]"
                  >
                    {(Object.keys(WISHLIST_PRICE_FILTER_LABELS) as WishlistPriceFilter[]).map(
                      (value) => (
                        <option key={value} value={value}>
                          {WISHLIST_PRICE_FILTER_LABELS[value]}
                        </option>
                      ),
                    )}
                  </select>
                </div>

                <div>
                  <p className="mb-2 font-sans text-[11px] font-medium uppercase tracking-wider text-[#9A8070]">
                    Availability
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(WISHLIST_STOCK_FILTER_LABELS) as WishlistStockFilter[]).map(
                      (value) => (
                        <FilterPill
                          key={value}
                          active={filters.stock === value}
                          onClick={() => updateFilters({ stock: value })}
                        >
                          {WISHLIST_STOCK_FILTER_LABELS[value]}
                        </FilterPill>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </section>

      {/* Items Grid/List */}
      {items.length > 0 ? (
        <section
          className={cn(
            "mx-auto max-w-7xl px-6 pb-16 lg:px-10",
            viewMode === "grid"
              ? "grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
              : "space-y-4",
          )}
        >
          {displayItems.length === 0 ? (
            <div className="col-span-full rounded-xl border border-dashed border-[#D9CFC0] bg-white px-6 py-14 text-center">
              <p className="font-serif text-[22px] text-[#3D2E24]">No items match these filters</p>
              <p className="mt-2 font-sans text-[14px] text-[#9A8070]">
                Try adjusting category, subcategory, price, or stock filters.
              </p>
              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 font-sans text-[12px] font-semibold uppercase tracking-wider text-[#846246] underline underline-offset-4"
                >
                  Clear filters
                </button>
              ) : null}
            </div>
          ) : null}

          {displayItems.map((item) => (
            <div
              key={item.id}
              className={cn(
                "group overflow-hidden rounded-lg border border-[#E8E0D4] bg-white transition-all hover:border-[#D9CFC0] hover:shadow-lg",
                !item.inStock && "opacity-75",
                viewMode === "list" ? "flex items-stretch" : undefined,
              )}
            >
              {/* Image Container */}
              <div
                className={cn(
                  "relative shrink-0 overflow-hidden bg-[#EDE8DC]",
                  viewMode === "list"
                    ? "aspect-square w-[88px] sm:w-[104px]"
                    : "relative aspect-[4/5] w-full",
                )}
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes={viewMode === "grid" ? "(max-width: 768px) 100vw, 33vw" : "104px"}
                />

                {/* Badge */}
                {viewMode === "grid" ? (
                  <div className="absolute top-4 right-4 space-y-2">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="flex size-10 items-center justify-center rounded-full bg-white/90 text-[#846246] backdrop-blur-sm transition-colors hover:bg-white hover:text-[#5C4332]"
                      aria-label="Remove from wishlist"
                    >
                      <Heart className="size-5 fill-current" />
                    </button>
                  </div>
                ) : null}

                {!item.inStock && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <span className="font-sans text-[9px] font-semibold uppercase tracking-wider text-white sm:text-[10px]">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div
                className={cn(
                  "min-w-0 flex-1 p-4 sm:p-5",
                  viewMode === "list" && "flex items-center justify-between gap-4",
                )}
              >
                <div className={cn("space-y-3", viewMode === "list" && "min-w-0 flex-1 space-y-2")}>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-sans text-[11px] font-medium uppercase tracking-wider text-[#9A8070]">
                      {item.category}
                    </p>
                    <span className="text-[#D9CFC0]">·</span>
                    <p className="font-sans text-[11px] text-[#B5A898]">{item.subcategory}</p>
                  </div>
                  <Link
                    href={`/products/${item.slug}`}
                    className={cn(
                      "block font-serif font-normal text-[#3D2E24] transition-colors hover:text-[#846246]",
                      viewMode === "list" ? "text-[15px] leading-snug sm:text-[16px]" : "text-[16px]",
                    )}
                  >
                    {item.name}
                  </Link>
                  <div className="space-y-1.5">
                    <p className="font-sans text-[12px] text-[#9A8070]">
                      by <span className="text-[#6B5344]">{item.artisan}</span>
                    </p>
                    <p className="font-sans text-[12px] text-[#C4B5A5]">
                      Added {item.addedDate}
                    </p>
                  </div>
                  <div className={cn("flex items-center justify-between", viewMode === "list" ? "pt-0" : "pt-2")}>
                    <p className="font-serif text-[18px] text-[#3D2E24] sm:text-[20px]">
                      ₹{item.price.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div
                  className={cn(
                    "mt-4 flex gap-2",
                    viewMode === "list" && "mt-0 shrink-0 flex-col sm:flex-row",
                  )}
                >
                  <button
                    disabled={!item.inStock}
                    className={cn(
                      "flex-1 py-2.5 px-3 rounded font-sans text-[11px] font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2",
                      item.inStock
                        ? "bg-[#846246] text-white hover:bg-[#6B5344]"
                        : "bg-[#E8E0D4] text-[#9A8070] cursor-not-allowed",
                    )}
                  >
                    <ShoppingBag className="size-4" />
                    <span className="hidden sm:inline">Add</span>
                  </button>
                  <button
                    className="py-2.5 px-3 rounded border border-[#D9CFC0] text-[#846246] font-sans text-[11px] font-semibold uppercase tracking-wider transition-colors hover:bg-[#EDE8DC] flex items-center justify-center gap-2"
                  >
                    <Share2 className="size-4" />
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="py-2.5 px-3 rounded border border-[#D9CFC0] text-[#9A8070] font-sans text-[11px] font-semibold uppercase tracking-wider transition-colors hover:text-[#846246] hover:border-[#846246] flex items-center justify-center gap-2"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>
      ) : (
        /* Empty State */
        <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
          <div className="text-center py-24">
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 rounded-full bg-[#EDE8DC] flex items-center justify-center">
                <Heart className="size-10 text-[#C4B5A5]" />
              </div>
            </div>
            <h2 className="font-serif text-[28px] text-[#3D2E24] mb-3">
              Your wishlist is empty
            </h2>
            <p className="font-serif text-[16px] text-[#9A8070] mb-8 max-w-md mx-auto">
              Start exploring our collection of handcrafted artisan pieces and add your favorites.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-[#846246] text-white px-8 py-3 rounded font-sans text-[12px] font-semibold uppercase tracking-wider hover:bg-[#6B5344] transition-colors"
            >
              Explore Products
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </section>
      )}
    </>
  )
}
