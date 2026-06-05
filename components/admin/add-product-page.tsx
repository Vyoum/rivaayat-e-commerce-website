"use client"

import Link from "next/link"
import {
  Search,
  Bell,
  HelpCircle,
  Bold,
  Italic,
  List,
  Link2,
  Upload,
  Trash2,
  ChevronDown,
} from "lucide-react"
import { AdminSidebar } from "./admin-sidebar"

export function AddProductPage() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <div className="ml-[220px] flex min-h-screen flex-1 flex-col bg-[#F5F2EB]">
        <header className="flex h-[56px] items-center gap-4 border-b border-[#EDE5D8] bg-white px-6">
          <div className="relative w-[200px]">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#9A8070]" />
            <input
              type="search"
              placeholder="Search..."
              className="h-9 w-full rounded-lg border border-[#EDE5D8] bg-[#FAF7F2] pr-3 pl-9 text-[13px] outline-none"
            />
          </div>
          <span className="mx-auto font-serif text-[16px] text-[#2B1B12]">
            House of Indika
          </span>
          <nav className="flex items-center gap-4">
            {["Dashboard", "Analytics", "Settings"].map((l) => (
              <Link
                key={l}
                href={l === "Dashboard" ? "/admin" : "/admin/settings"}
                className="text-[13px] text-[#6B5344]"
              >
                {l}
              </Link>
            ))}
            <Bell className="size-[18px] text-[#6B5344]" />
            <HelpCircle className="size-[18px] text-[#6B5344]" />
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face"
              alt=""
              className="size-8 rounded-full object-cover"
            />
          </nav>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <p className="text-[11px] font-medium tracking-[0.15em] text-[#9A8070] uppercase">
                Store &gt; Products &gt; Add Product
              </p>
              <h1 className="mt-1 font-serif text-[28px] font-semibold text-[#2B1B12]">
                Add New Product
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="text-[12px] font-medium tracking-wide text-[#6B5344] uppercase"
              >
                Preview on Site
              </button>
              <button
                type="button"
                className="rounded-xl border border-[#2B1B12] px-4 py-2 text-[12px] font-medium text-[#2B1B12] uppercase"
              >
                Save as Draft
              </button>
              <button
                type="button"
                className="rounded-xl bg-[#2B1B12] px-5 py-2 text-[12px] font-medium text-white uppercase"
              >
                Publish Product
              </button>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_320px] gap-6">
            <div className="space-y-6">
              <section className="rounded-xl border border-[#EDE5D8] bg-white p-5">
                <h2 className="mb-4 text-[14px] font-semibold text-[#2B1B12]">
                  Product Identity
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-[12px] font-medium text-[#6B5344]">
                      Product Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Handwoven Kansa Thali Set"
                      className="h-10 w-full rounded-lg border border-[#EDE5D8] px-3 text-[13px] outline-none focus:border-[#C4A882]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block text-[12px] font-medium text-[#6B5344]">
                        Category
                      </label>
                      <div className="relative">
                        <select className="h-10 w-full appearance-none rounded-lg border border-[#EDE5D8] px-3 text-[13px] outline-none">
                          <option>Décor</option>
                          <option>Jewellery</option>
                          <option>Clothing</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[#9A8070]" />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[12px] font-medium text-[#6B5344]">
                        Subcategory
                      </label>
                      <div className="relative">
                        <select className="h-10 w-full appearance-none rounded-lg border border-[#EDE5D8] px-3 text-[13px] outline-none">
                          <option>Tableware</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[#9A8070]" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[12px] font-medium text-[#6B5344]">
                      Artisan / Maker
                    </label>
                    <div className="relative">
                      <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#9A8070]" />
                      <input
                        type="text"
                        placeholder="Search artisan..."
                        className="h-10 w-full rounded-lg border border-[#EDE5D8] pl-9 pr-3 text-[13px] outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[12px] font-medium text-[#6B5344]">
                      Region of Origin
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Jaipur, Rajasthan"
                      className="h-10 w-full rounded-lg border border-[#EDE5D8] px-3 text-[13px] outline-none"
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-xl border border-[#EDE5D8] bg-white p-5">
                <h2 className="mb-4 text-[14px] font-semibold text-[#2B1B12]">
                  Description & Story
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-[12px] font-medium text-[#6B5344]">
                      Short Description (Summary)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="A brief overview of the product..."
                      className="w-full rounded-lg border border-[#EDE5D8] px-3 py-2 text-[13px] outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[12px] font-medium text-[#6B5344]">
                      Product Story
                    </label>
                    <div className="overflow-hidden rounded-lg border border-[#EDE5D8]">
                      <div className="flex items-center gap-2 border-b border-[#EDE5D8] bg-[#FAF7F2] px-3 py-2">
                        {[Bold, Italic, List, Link2].map((Icon, i) => (
                          <button key={i} type="button" className="text-[#6B5344]">
                            <Icon className="size-4" />
                          </button>
                        ))}
                      </div>
                      <textarea
                        rows={4}
                        placeholder="Tell the story of this piece..."
                        className="w-full px-3 py-2 text-[13px] outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[12px] font-medium text-[#6B5344]">
                      Materials & Care Instructions
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g., 100% Brass. Wash with mild soap..."
                      className="w-full rounded-lg border border-[#EDE5D8] px-3 py-2 text-[13px] outline-none"
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-xl border border-[#EDE5D8] bg-white p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-[14px] font-semibold text-[#2B1B12]">
                    Food & Pantry Information
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] text-[#6B5344]">Customisable?</span>
                    <div className="h-5 w-9 rounded-full bg-[#3B82F6]" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-[12px] font-medium text-[#6B5344]">
                      Ingredients (Tags)
                    </label>
                    <div className="flex flex-wrap gap-2 rounded-lg border border-[#EDE5D8] p-2">
                      {["Turmeric", "Black Pepper"].map((tag) => (
                        <span
                          key={tag}
                          className="flex items-center gap-1 rounded-full bg-[#F5EDE3] px-2.5 py-1 text-[12px] text-[#6B5344]"
                        >
                          {tag}
                          <span className="text-[#9A8070]">×</span>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block text-[12px] font-medium text-[#6B5344]">
                        Shelf Life
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          defaultValue="6"
                          className="h-10 flex-1 rounded-lg border border-[#EDE5D8] px-3 text-[13px] outline-none"
                        />
                        <select className="h-10 rounded-lg border border-[#EDE5D8] px-3 text-[13px]">
                          <option>Months</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-[12px] font-medium text-[#6B5344]">
                      Nutritional Information (per 100g)
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {["Energy (kcal)", "Protein (g)", "Carbs (g)", "Fat (g)", "Sugar (g)", "Sodium (mg)"].map(
                        (label) => (
                          <div key={label}>
                            <p className="mb-1 text-[10px] text-[#9A8070]">{label}</p>
                            <input
                              type="text"
                              defaultValue="—"
                              className="h-9 w-full rounded-lg border border-[#EDE5D8] px-2 text-[13px] text-center outline-none"
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-xl border border-[#EDE5D8] bg-white p-5">
                <h2 className="mb-4 text-[14px] font-semibold text-[#2B1B12]">
                  Pricing & Variants
                </h2>
                <div className="mb-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-[12px] font-medium text-[#6B5344]">
                      Base Price
                    </label>
                    <div className="relative">
                      <span className="absolute top-1/2 left-3 -translate-y-1/2 text-[13px] text-[#9A8070]">
                        ₹
                      </span>
                      <input
                        type="text"
                        defaultValue="2,400"
                        className="h-10 w-full rounded-lg border border-[#EDE5D8] pl-7 pr-3 text-[13px] outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[12px] font-medium text-[#6B5344]">
                      Compare at Price (Optional)
                    </label>
                    <div className="relative">
                      <span className="absolute top-1/2 left-3 -translate-y-1/2 text-[13px] text-[#9A8070]">
                        ₹
                      </span>
                      <input
                        type="text"
                        placeholder="—"
                        className="h-10 w-full rounded-lg border border-[#EDE5D8] pl-7 pr-3 text-[13px] outline-none"
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[13px] font-medium text-[#2B1B12]">
                    Product Variants
                  </span>
                  <button
                    type="button"
                    className="text-[12px] font-medium text-[#6B5344]"
                  >
                    + Add Variant Option
                  </button>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#EDE5D8] text-[11px] text-[#9A8070]">
                      <th className="pb-2 text-left font-medium">Variant (Size/Color)</th>
                      <th className="pb-2 text-left font-medium">Price Modifier</th>
                      <th className="pb-2 text-left font-medium">Stock</th>
                      <th className="pb-2 w-8" />
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { variant: "Small / Brass", modifier: "+ ₹ 0", stock: "24" },
                      { variant: "Large / Brass", modifier: "+ ₹ 400", stock: "12" },
                    ].map((row) => (
                      <tr key={row.variant} className="border-b border-[#F5EDE3]">
                        <td className="py-2.5 text-[13px]">{row.variant}</td>
                        <td className="py-2.5 text-[13px]">{row.modifier}</td>
                        <td className="py-2.5 text-[13px]">{row.stock}</td>
                        <td className="py-2.5">
                          <Trash2 className="size-4 text-[#C5221F]" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            </div>

            <div className="space-y-5">
              <section className="rounded-xl border border-[#EDE5D8] bg-white p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-[14px] font-semibold text-[#2B1B12]">Media</h2>
                  <span className="text-[12px] text-[#9A8070]">0/5</span>
                </div>
                <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#D4C4A8] py-8">
                  <Upload className="mb-2 size-8 text-[#9A8070]" />
                  <p className="text-center text-[12px] text-[#6B5344]">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-center text-[11px] text-[#9A8070]">
                    SVG, PNG, JPG or GIF (max. 800x400px)
                  </p>
                </div>
                <div className="mt-3 grid grid-cols-4 gap-2">
                  <div className="relative overflow-hidden rounded-lg">
                    <img
                      src="https://images.unsplash.com/photo-1602810318383-9a4a0e8b8c8e?w=120&h=120&fit=crop"
                      alt=""
                      className="aspect-square w-full object-cover"
                    />
                    <span className="absolute bottom-1 left-1 rounded bg-[#2B1B12] px-1.5 py-0.5 text-[9px] font-bold text-white">
                      PRIMARY
                    </span>
                  </div>
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-lg border-2 border-dashed border-[#EDE5D8] bg-[#FAF7F2]"
                    />
                  ))}
                </div>
              </section>

              <section className="rounded-xl border border-[#EDE5D8] bg-white p-5">
                <h2 className="mb-4 text-[14px] font-semibold text-[#2B1B12]">
                  Catalogue Settings
                </h2>
                <div className="mb-4">
                  <label className="mb-2 block text-[12px] font-medium text-[#6B5344]">
                    Product Status
                  </label>
                  <div className="flex rounded-lg border border-[#EDE5D8] p-1">
                    {["Active", "Draft", "Coming Soon"].map((s, i) => (
                      <button
                        key={s}
                        type="button"
                        className={`flex-1 rounded-md py-1.5 text-[12px] font-medium ${
                          i === 0
                            ? "bg-white text-[#2B1B12] shadow-sm"
                            : "text-[#9A8070]"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4 space-y-2">
                  <p className="text-[12px] font-medium text-[#6B5344]">
                    Visibility & Collections
                  </p>
                  {[
                    { label: "Feature on Homepage", checked: true },
                    { label: "Include in 'New Arrivals'", checked: false },
                    { label: "Include in 'Bestsellers'", checked: true },
                  ].map((item) => (
                    <label
                      key={item.label}
                      className="flex items-center gap-2 text-[12px] text-[#6B5344]"
                    >
                      <input
                        type="checkbox"
                        defaultChecked={item.checked}
                        className="rounded"
                      />
                      {item.label}
                    </label>
                  ))}
                </div>
                <div className="mb-4">
                  <label className="mb-1.5 block text-[12px] font-medium text-[#6B5344]">
                    Search Tags
                  </label>
                  <div className="flex flex-wrap gap-2 rounded-lg border border-[#EDE5D8] p-2">
                    {["brass", "handmade"].map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-[#F5EDE3] px-2.5 py-1 text-[12px] text-[#6B5344]"
                      >
                        {tag} ×
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-medium text-[#6B5344]">
                    Display Artisan Credit
                  </span>
                  <div className="h-5 w-9 rounded-full bg-[#3B82F6]" />
                </div>
              </section>

              <section className="rounded-xl border border-[#EDE5D8] bg-white p-4">
                <button
                  type="button"
                  className="flex w-full items-center justify-between text-[13px] font-medium text-[#2B1B12]"
                >
                  SEO & Meta Settings
                  <ChevronDown className="size-4 text-[#9A8070]" />
                </button>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
