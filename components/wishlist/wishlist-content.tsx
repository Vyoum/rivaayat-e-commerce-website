"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Share2, Trash2, ShoppingBag, ArrowUpRight, LayoutGrid, List } from "lucide-react"
import { cn } from "@/lib/utils"

interface WishlistItem {
  id: string
  name: string
  category: string
  price: number
  image: string
  artisan: string
  addedDate: string
  inStock: boolean
}

const mockWishlistItems: WishlistItem[] = [
  {
    id: "1",
    name: "Mandala Crochet Earrings",
    category: "Jewellery",
    price: 650,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=500&fit=crop&q=80",
    artisan: "Asha from Rajasthan",
    addedDate: "2 days ago",
    inStock: true,
  },
  {
    id: "2",
    name: "Hand-Woven Silk Scarf",
    category: "Textiles",
    price: 1200,
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&h=500&fit=crop&q=80",
    artisan: "Priya from Varanasi",
    addedDate: "1 week ago",
    inStock: true,
  },
  {
    id: "3",
    name: "Ceramic Tea Set",
    category: "Home Décor",
    price: 1800,
    image: "https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=400&h=500&fit=crop&q=80",
    artisan: "Deepak from Jaipur",
    addedDate: "10 days ago",
    inStock: true,
  },
  {
    id: "4",
    name: "Indigo Block Print Cushion",
    category: "Home Décor",
    price: 899,
    image: "https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=400&h=500&fit=crop&q=80",
    artisan: "Meera from Kutch",
    addedDate: "3 weeks ago",
    inStock: false,
  },
  {
    id: "5",
    name: "Brass Jewelry Box",
    category: "Home Décor",
    price: 2100,
    image: "https://images.unsplash.com/photo-1593642632509-c6fed59fed98?w=400&h=500&fit=crop&q=80",
    artisan: "Rajesh from Moradabad",
    addedDate: "1 month ago",
    inStock: true,
  },
  {
    id: "6",
    name: "Embroidered Phulkari Dupatta",
    category: "Textiles",
    price: 1500,
    image: "https://images.unsplash.com/photo-1555049519-a85b0020ecaa?w=400&h=500&fit=crop&q=80",
    artisan: "Harpreet from Punjab",
    addedDate: "1 month ago",
    inStock: true,
  },
]

export function WishlistContent() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [items, setItems] = useState(mockWishlistItems)

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const inStockCount = items.filter((item) => item.inStock).length
  const outOfStockCount = items.filter((item) => !item.inStock).length

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
      <section className="mx-auto max-w-7xl px-6 pb-8 lg:px-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "p-2 rounded transition-colors",
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
              "p-2 rounded transition-colors",
              viewMode === "list"
                ? "bg-[#846246] text-white"
                : "text-[#9A8070] hover:bg-[#EDE8DC]",
            )}
            aria-label="List view"
          >
            <List className="size-5" />
          </button>
        </div>
        <p className="font-sans text-[13px] text-[#9A8070]">
          {items.length} {items.length === 1 ? "item" : "items"}
        </p>
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
          {items.map((item) => (
            <div
              key={item.id}
              className={cn(
                "group rounded-lg border border-[#E8E0D4] bg-white overflow-hidden transition-all hover:shadow-lg hover:border-[#D9CFC0]",
                !item.inStock && "opacity-75",
              )}
            >
              {/* Image Container */}
              <div className="relative aspect-[4/5] overflow-hidden bg-[#EDE8DC]">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes={viewMode === "grid" ? "(max-width: 768px) 100vw, 33vw" : "120px"}
                />

                {/* Badge */}
                <div className="absolute top-4 right-4 space-y-2">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="flex size-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-[#846246] transition-colors hover:bg-white hover:text-[#5C4332]"
                    aria-label="Remove from wishlist"
                  >
                    <Heart className="size-5 fill-current" />
                  </button>
                </div>

                {!item.inStock && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <span className="font-sans text-[12px] font-semibold text-white uppercase tracking-wider">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className={cn(
                "p-5",
                viewMode === "list" && "flex-1 flex items-center justify-between"
              )}>
                <div className="space-y-3">
                  <p className="font-sans text-[11px] font-medium text-[#9A8070] uppercase tracking-wider">
                    {item.category}
                  </p>
                  <Link
                    href="#"
                    className="block font-serif text-[16px] font-normal text-[#3D2E24] hover:text-[#846246] transition-colors"
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
                  <div className="flex items-center justify-between pt-2">
                    <p className="font-serif text-[20px] text-[#3D2E24]">
                      ₹{item.price.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className={cn(
                  "flex gap-2 mt-4",
                  viewMode === "list" && "mt-0 ml-4 flex-col"
                )}>
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
