"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Search,
  Bell,
  HelpCircle,
  Upload,
  Trash2,
  ChevronDown,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"

import { AdminSidebar } from "./admin-sidebar"
import { HOUSE_OF_INDIKA } from "@/lib/brand"
import { categoryCatalog } from "@/lib/category-catalog"
import { CATEGORY_ROUTE_TO_ENUM, CATEGORY_ENUM_TO_ROUTE } from "@/lib/product-catalog"
import { parsePriceInput } from "@/lib/product-utils"
import type { AdminProduct } from "@/types/product"
import type { Category } from "@prisma/client"

const categoryOptions = [
  { route: "jewellery", label: "Jewellery" },
  { route: "clothing", label: "Clothing" },
  { route: "decor", label: "Décor" },
  { route: "custom-laddoos", label: "Custom Food" },
]

type ProductFormPageProps = {
  product?: AdminProduct
}

export function ProductFormPage({ product }: ProductFormPageProps) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const isEditing = Boolean(product)

  const [name, setName] = useState(product?.name ?? "")
  const [categoryRoute, setCategoryRoute] = useState(
    product ? CATEGORY_ENUM_TO_ROUTE[product.category] : "jewellery",
  )
  const [subcategory, setSubcategory] = useState(product?.subcategory ?? "")
  const [artisanName, setArtisanName] = useState(product?.artisanName ?? "")
  const [location, setLocation] = useState(product?.location ?? "")
  const [description, setDescription] = useState(product?.description ?? "")
  const [story, setStory] = useState(product?.story ?? "")
  const [materialsCare, setMaterialsCare] = useState(product?.materialsCare ?? "")
  const [price, setPrice] = useState(product ? String(product.price) : "")
  const [badge, setBadge] = useState(product?.badge ?? "HANDCRAFTED")
  const [tagsInput, setTagsInput] = useState(product?.tags.join(", ") ?? "")
  const [imageUrls, setImageUrls] = useState<string[]>(product?.imageUrls ?? [])
  const [handcrafted, setHandcrafted] = useState(product?.handcrafted ?? true)
  const [inStock, setInStock] = useState(product?.inStock ?? true)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const subcategories = categoryCatalog[categoryRoute]?.subcategories ?? []

  async function handleUpload(file: File) {
    if (imageUrls.length >= 5) {
      toast.error("Maximum 5 images allowed")
      return
    }

    setUploading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/admin/products/upload", { method: "POST", body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Upload failed")
      setImageUrls((prev) => [...prev, data.imageUrl])
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed"
      setError(message)
      toast.error(message)
    } finally {
      setUploading(false)
    }
  }

  function removeImage(index: number) {
    setImageUrls((prev) => prev.filter((_, i) => i !== index))
  }

  function moveImagePrimary(index: number) {
    setImageUrls((prev) => {
      const next = [...prev]
      const [item] = next.splice(index, 1)
      next.unshift(item)
      return next
    })
  }

  async function handleSave(publish: boolean) {
    setSaving(true)
    setError(null)

    const parsedPrice = parsePriceInput(price)
    if (!name.trim()) {
      setError("Product name is required")
      setSaving(false)
      return
    }
    if (!parsedPrice || parsedPrice <= 0) {
      setError("Enter a valid price")
      setSaving(false)
      return
    }
    if (imageUrls.length === 0) {
      setError("Upload at least one product image")
      setSaving(false)
      return
    }

    const tags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)

    const payload = {
      name: name.trim(),
      category: CATEGORY_ROUTE_TO_ENUM[categoryRoute] as Category,
      subcategory: subcategory || undefined,
      artisanName: artisanName.trim() || undefined,
      location: location.trim() || undefined,
      description: description.trim() || undefined,
      story: story.trim() || undefined,
      materialsCare: materialsCare.trim() || undefined,
      price: parsedPrice,
      badge: badge || undefined,
      tags,
      imageUrls,
      isPublished: publish,
      inStock,
      handcrafted,
    }

    try {
      const url = isEditing ? `/api/admin/products/${product!.id}` : "/api/admin/products"
      const method = isEditing ? "PATCH" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to save product")

      toast.success(publish ? "Product published" : "Product saved as draft")
      router.push("/admin/store/products")
      router.refresh()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save product"
      setError(message)
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

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
          <span className="mx-auto font-serif text-[16px] text-[#2B1B12]">{HOUSE_OF_INDIKA}</span>
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
          </nav>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <p className="text-[11px] font-medium tracking-[0.15em] text-[#9A8070] uppercase">
                Store &gt; Products &gt; {isEditing ? "Edit Product" : "Add Product"}
              </p>
              <h1 className="mt-1 font-serif text-[28px] font-semibold text-[#2B1B12]">
                {isEditing ? "Edit Product" : "Add New Product"}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {isEditing && product?.isPublished && (
                <Link
                  href={`/products/${product.slug}`}
                  target="_blank"
                  className="text-[12px] font-medium tracking-wide text-[#6B5344] uppercase"
                >
                  Preview on Site
                </Link>
              )}
              <button
                type="button"
                disabled={saving}
                onClick={() => handleSave(false)}
                className="rounded-xl border border-[#2B1B12] px-4 py-2 text-[12px] font-medium text-[#2B1B12] uppercase disabled:opacity-50"
              >
                Save as Draft
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => handleSave(true)}
                className="flex items-center gap-2 rounded-xl bg-[#2B1B12] px-5 py-2 text-[12px] font-medium text-white uppercase disabled:opacity-50"
              >
                {saving && <Loader2 className="size-3.5 animate-spin" />}
                Publish Product
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-[1fr_320px] gap-6">
            <div className="space-y-6">
              <section className="rounded-xl border border-[#EDE5D8] bg-white p-5">
                <h2 className="mb-4 text-[14px] font-semibold text-[#2B1B12]">Product Identity</h2>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-[12px] font-medium text-[#6B5344]">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
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
                        <select
                          value={categoryRoute}
                          onChange={(e) => {
                            setCategoryRoute(e.target.value)
                            setSubcategory("")
                          }}
                          className="h-10 w-full appearance-none rounded-lg border border-[#EDE5D8] px-3 text-[13px] outline-none"
                        >
                          {categoryOptions.map((option) => (
                            <option key={option.route} value={option.route}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[#9A8070]" />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[12px] font-medium text-[#6B5344]">
                        Subcategory
                      </label>
                      <div className="relative">
                        <select
                          value={subcategory}
                          onChange={(e) => setSubcategory(e.target.value)}
                          className="h-10 w-full appearance-none rounded-lg border border-[#EDE5D8] px-3 text-[13px] outline-none"
                        >
                          <option value="">Select subcategory</option>
                          {subcategories.map((entry) => (
                            <option key={entry.id} value={entry.id}>
                              {entry.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[#9A8070]" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[12px] font-medium text-[#6B5344]">
                      Artisan / Maker
                    </label>
                    <input
                      type="text"
                      value={artisanName}
                      onChange={(e) => setArtisanName(e.target.value)}
                      placeholder="e.g., Asha Devi"
                      className="h-10 w-full rounded-lg border border-[#EDE5D8] px-3 text-[13px] outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[12px] font-medium text-[#6B5344]">
                      Region of Origin
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
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
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="A brief overview of the product..."
                      className="w-full rounded-lg border border-[#EDE5D8] px-3 py-2 text-[13px] outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[12px] font-medium text-[#6B5344]">
                      Product Story
                    </label>
                    <textarea
                      rows={4}
                      value={story}
                      onChange={(e) => setStory(e.target.value)}
                      placeholder="Tell the story of this piece..."
                      className="w-full rounded-lg border border-[#EDE5D8] px-3 py-2 text-[13px] outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[12px] font-medium text-[#6B5344]">
                      Materials & Care Instructions
                    </label>
                    <textarea
                      rows={2}
                      value={materialsCare}
                      onChange={(e) => setMaterialsCare(e.target.value)}
                      placeholder="e.g., 100% Brass. Wash with mild soap..."
                      className="w-full rounded-lg border border-[#EDE5D8] px-3 py-2 text-[13px] outline-none"
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-xl border border-[#EDE5D8] bg-white p-5">
                <h2 className="mb-4 text-[14px] font-semibold text-[#2B1B12]">Pricing</h2>
                <div>
                  <label className="mb-1.5 block text-[12px] font-medium text-[#6B5344]">
                    Base Price (₹)
                  </label>
                  <div className="relative max-w-xs">
                    <span className="absolute top-1/2 left-3 -translate-y-1/2 text-[13px] text-[#9A8070]">
                      ₹
                    </span>
                    <input
                      type="text"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="2400"
                      className="h-10 w-full rounded-lg border border-[#EDE5D8] pl-7 pr-3 text-[13px] outline-none"
                    />
                  </div>
                </div>
              </section>
            </div>

            <div className="space-y-5">
              <section className="rounded-xl border border-[#EDE5D8] bg-white p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-[14px] font-semibold text-[#2B1B12]">Media</h2>
                  <span className="text-[12px] text-[#9A8070]">{imageUrls.length}/5</span>
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) void handleUpload(file)
                    e.target.value = ""
                  }}
                />
                <button
                  type="button"
                  disabled={uploading || imageUrls.length >= 5}
                  onClick={() => fileRef.current?.click()}
                  className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#D4C4A8] py-8 disabled:opacity-50"
                >
                  {uploading ? (
                    <Loader2 className="mb-2 size-8 animate-spin text-[#9A8070]" />
                  ) : (
                    <Upload className="mb-2 size-8 text-[#9A8070]" />
                  )}
                  <p className="text-center text-[12px] text-[#6B5344]">
                    Click to upload product images
                  </p>
                  <p className="text-center text-[11px] text-[#9A8070]">PNG, JPG or WebP (max 5MB)</p>
                </button>
                {imageUrls.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {imageUrls.map((url, index) => (
                      <div key={url} className="relative overflow-hidden rounded-lg">
                        <img src={url} alt="" className="aspect-square w-full object-cover" />
                        {index === 0 && (
                          <span className="absolute bottom-1 left-1 rounded bg-[#2B1B12] px-1.5 py-0.5 text-[9px] font-bold text-white">
                            PRIMARY
                          </span>
                        )}
                        <div className="absolute top-1 right-1 flex gap-1">
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => moveImagePrimary(index)}
                              className="rounded bg-white/90 px-1.5 py-0.5 text-[9px] font-medium"
                            >
                              Primary
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="rounded bg-white/90 p-1 text-[#C5221F]"
                          >
                            <Trash2 className="size-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="rounded-xl border border-[#EDE5D8] bg-white p-5">
                <h2 className="mb-4 text-[14px] font-semibold text-[#2B1B12]">Catalogue Settings</h2>
                <div className="mb-4">
                  <label className="mb-1.5 block text-[12px] font-medium text-[#6B5344]">
                    Badge
                  </label>
                  <select
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="h-10 w-full rounded-lg border border-[#EDE5D8] px-3 text-[13px] outline-none"
                  >
                    <option value="HANDCRAFTED">Handcrafted</option>
                    <option value="CUSTOMISABLE">Customisable</option>
                    <option value="">None</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="mb-1.5 block text-[12px] font-medium text-[#6B5344]">
                    Search Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="under-5000, gold-plated"
                    className="h-10 w-full rounded-lg border border-[#EDE5D8] px-3 text-[13px] outline-none"
                  />
                </div>
                <label className="mb-3 flex items-center justify-between text-[12px] text-[#6B5344]">
                  <span>In stock</span>
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    className="rounded"
                  />
                </label>
                <label className="flex items-center justify-between text-[12px] text-[#6B5344]">
                  <span>Handcrafted</span>
                  <input
                    type="checkbox"
                    checked={handcrafted}
                    onChange={(e) => setHandcrafted(e.target.checked)}
                    className="rounded"
                  />
                </label>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
