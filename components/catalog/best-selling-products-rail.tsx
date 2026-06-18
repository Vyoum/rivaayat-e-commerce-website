"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Loader2 } from "lucide-react"

import type { CatalogProduct } from "@/lib/category-catalog"
import { formatProductPrice } from "@/lib/product-utils"
import { cn } from "@/lib/utils"

type BestSellingProductsRailProps = {
  title?: string
  initialProducts?: CatalogProduct[]
  excludeIds?: string[]
  excludeSlugs?: string[]
  categoryRoute?: string
  limit?: number
  className?: string
}

function CompactProductCard({ product }: { product: CatalogProduct }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#E8E0D4]/80 bg-white shadow-[0_8px_24px_rgba(61,46,36,0.06)] transition-transform duration-300 hover:-translate-y-0.5"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#EDE8DC]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          sizes="220px"
        />
        {product.badge === "HANDCRAFTED" ? (
          <span className="absolute top-2.5 left-2.5 rounded-full bg-[#8FA68E]/90 px-2.5 py-0.5 font-sans text-[9px] font-semibold tracking-[0.12em] text-white uppercase">
            Best Seller
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col px-3.5 py-3.5">
        <p className="line-clamp-2 min-h-[2.5rem] font-serif text-[13px] leading-snug text-[#2B1B12]">
          {product.name}
        </p>
        <p className="mt-2 font-sans text-[12px] font-medium text-[#846246]">
          {formatProductPrice(product.price)}
        </p>
        <p className="mt-1 line-clamp-1 font-sans text-[11px] text-[#9A8070]">{product.artisan}</p>
      </div>
    </Link>
  )
}

export function BestSellingProductsRail({
  title = "Best Sellers",
  initialProducts,
  excludeIds = [],
  excludeSlugs = [],
  categoryRoute,
  limit = 12,
  className,
}: BestSellingProductsRailProps) {
  const [products, setProducts] = useState<CatalogProduct[]>(initialProducts ?? [])
  const [loading, setLoading] = useState(!initialProducts?.length)

  useEffect(() => {
    if (initialProducts?.length) {
      setProducts(initialProducts)
      setLoading(false)
      return
    }

    const params = new URLSearchParams({ limit: String(limit) })
    if (categoryRoute) params.set("category", categoryRoute)
    if (excludeIds.length > 0) params.set("excludeIds", excludeIds.join(","))
    if (excludeSlugs.length > 0) params.set("excludeSlugs", excludeSlugs.join(","))

    let cancelled = false

    async function loadProducts() {
      setLoading(true)
      try {
        const res = await fetch(`/api/products/best-selling?${params.toString()}`)
        const data = (await res.json()) as { products?: CatalogProduct[] }
        if (!cancelled && Array.isArray(data.products)) {
          setProducts(data.products)
        }
      } catch {
        if (!cancelled) setProducts([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void loadProducts()

    return () => {
      cancelled = true
    }
  }, [categoryRoute, excludeIds.join(","), excludeSlugs.join(","), initialProducts, limit])

  if (!loading && products.length === 0) {
    return null
  }

  return (
    <section className={cn("border-t border-[#EDE5D8] bg-[#FCFAF5] py-12 sm:py-14", className)}>
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-[#9A8070]">
              Curated for you
            </p>
            <h2 className="mt-1 font-serif text-[24px] text-[#2B1B12] sm:text-[28px]">{title}</h2>
          </div>
          <Link
            href="/collections"
            className="hidden items-center gap-1 font-sans text-[12px] font-medium uppercase tracking-[0.12em] text-[#846246] transition-colors hover:text-[#5C4332] sm:inline-flex"
          >
            View all
            <ChevronRight className="size-4" />
          </Link>
        </div>

        {loading ? (
          <div className="mt-8 flex min-h-[280px] items-center justify-center">
            <Loader2 className="size-6 animate-spin text-[#9A8070]" />
          </div>
        ) : (
          <div className="relative mt-8">
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#FCFAF5] to-transparent" />
            <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {products.map((product) => (
                <div key={product.id} className="w-[180px] shrink-0 snap-start sm:w-[210px]">
                  <CompactProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
