"use client"

import Link from "next/link"
import {
  Search,
  Bell,
  HelpCircle,
  LayoutGrid,
  List,
  ExternalLink,
  ChevronDown,
} from "lucide-react"
import { AdminSidebar } from "./admin-sidebar"

const tabs = [
  { label: "All", count: 86, active: true },
  { label: "Clothing", count: 18 },
  { label: "Jewellery", count: 24 },
  { label: "Décor", count: 22 },
  { label: "Custom Food", count: 12 },
  { label: "Coming Soon", count: 10 },
]

const products = [
  {
    name: "Silver Tribal Choker",
    price: "₹4,200",
    artisan: "Meera Devi",
    sku: "JAL-042-MD",
    category: "JEWELLERY",
    categoryColor: "bg-[#E3F2FD] text-[#1565C0]",
    status: "green",
    image:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=300&fit=crop",
  },
  {
    name: "Hand-painted Ceramic Vase",
    price: "₹3,800",
    artisan: "Dev Kumar",
    sku: "DEC-018-DK",
    category: "DÉCOR",
    categoryColor: "bg-[#FFF3E0] text-[#E65100]",
    status: "orange",
    image:
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&h=300&fit=crop",
  },
  {
    name: "Block Print Cotton Kurta",
    price: "₹2,450",
    artisan: "Asha Devi",
    sku: "CLT-031-AD",
    category: "CLOTHING",
    categoryColor: "bg-[#F3E5F5] text-[#7B1FA2]",
    status: "green",
    image:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=300&fit=crop",
  },
]

const statusColors = {
  green: "bg-[#4CAF50]",
  orange: "bg-[#FF9800]",
  red: "bg-[#F44336]",
}

export function ProductsPage() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <div className="ml-[220px] flex min-h-screen flex-1 flex-col bg-[#F9F6F1]">
        <header className="flex h-[56px] items-center justify-between border-b border-[#EDE5D8] bg-white px-6">
          <span className="font-serif text-[16px] text-[#2B1B12]">
            House of Indika
          </span>
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
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face"
              alt=""
              className="size-8 rounded-full object-cover"
            />
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="mb-5 flex items-start justify-between">
            <div>
              <h1 className="font-serif text-[26px] font-semibold text-[#2B1B12]">
                Products
              </h1>
              <p className="mt-1 text-[13px] text-[#9A8070]">
                Manage your handcrafted catalogue — clothing, jewellery, décor,
                food.
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
            {tabs.map((tab) => (
              <button
                key={tab.label}
                type="button"
                className={`px-4 py-2.5 text-[13px] font-medium ${
                  tab.active
                    ? "border-b-2 border-[#2B1B12] text-[#2B1B12]"
                    : "text-[#9A8070]"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          <div className="mb-5 flex items-center gap-3 rounded-xl border border-[#EDE5D8] bg-white p-3">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#9A8070]" />
              <input
                type="search"
                placeholder="Search by name, SKU, or artisan..."
                className="h-9 w-full rounded-lg border border-[#EDE5D8] bg-[#FAF7F2] pr-3 pl-9 text-[13px] outline-none"
              />
            </div>
            {["Artisan: All", "Stock: All", "Price: All"].map((filter) => (
              <button
                key={filter}
                type="button"
                className="flex items-center gap-1.5 rounded-lg border border-[#EDE5D8] px-3 py-2 text-[12px] font-medium text-[#6B5344]"
              >
                {filter}
                <ChevronDown className="size-3" />
              </button>
            ))}
            <div className="flex items-center gap-1 rounded-lg border border-[#EDE5D8] p-1">
              <button
                type="button"
                className="rounded-md bg-[#2B1B12] p-1.5 text-white"
              >
                <LayoutGrid className="size-4" />
              </button>
              <button type="button" className="rounded-md p-1.5 text-[#9A8070]">
                <List className="size-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            {products.map((product) => (
              <div
                key={product.sku}
                className="overflow-hidden rounded-xl border border-[#EDE5D8] bg-white shadow-sm"
              >
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-[200px] w-full object-cover"
                  />
                  <span
                    className={`absolute top-3 left-3 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${product.categoryColor}`}
                  >
                    {product.category}
                  </span>
                  <span
                    className={`absolute top-3 right-3 size-2.5 rounded-full ${statusColors[product.status as keyof typeof statusColors]}`}
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <h3 className="font-serif text-[16px] font-semibold text-[#2B1B12]">
                      {product.name}
                    </h3>
                    <span className="text-[14px] font-semibold text-[#2B1B12]">
                      {product.price}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[12px] text-[#9A8070] italic">
                    by {product.artisan}
                  </p>
                  <div className="mt-3 flex items-center justify-between border-t border-[#F5EDE3] pt-3">
                    <span className="text-[11px] text-[#9A8070]">
                      SKU: {product.sku}
                    </span>
                    <div className="flex items-center gap-2">
                      <Link
                        href="/admin/store/products/new"
                        className="text-[11px] font-bold tracking-wide text-[#6B5344] uppercase hover:text-[#2B1B12]"
                      >
                        Edit
                      </Link>
                      <ExternalLink className="size-3.5 text-[#9A8070]" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
