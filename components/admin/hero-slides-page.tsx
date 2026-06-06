"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { AdminSidebar } from "./admin-sidebar"
import { AdminTopbar } from "./admin-topbar"
import { ArrowLeft, GripVertical, ImageIcon, Loader2, Plus, Trash2, Upload } from "lucide-react"
import type { HeroSlide } from "@/lib/hero-slides-shared"

const MAX_SLIDES = 5

export function HeroSlidesPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState("")
  const [alt, setAlt] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)

  const loadSlides = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/hero-slides")
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to load slides")
      setSlides(data.slides ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load slides")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSlides()
  }, [loadSlides])

  async function handleUpload(file: File) {
    setSaving(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/admin/hero-slides/upload", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Upload failed")
      setImageUrl(data.imageUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setSaving(false)
    }
  }

  async function handleAddSlide() {
    if (!imageUrl.trim()) {
      setError("Add an image URL or upload a photo first")
      return
    }
    if (slides.length >= MAX_SLIDES) {
      setError(`Maximum ${MAX_SLIDES} slides allowed`)
      return
    }

    setSaving(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/hero-slides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: imageUrl.trim(), alt: alt.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to add slide")
      setImageUrl("")
      setAlt("")
      await loadSlides()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add slide")
    } finally {
      setSaving(false)
    }
  }

  async function handleToggle(slide: HeroSlide) {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/hero-slides/${slide.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !slide.isActive }),
      })
      if (!res.ok) throw new Error("Failed to update slide")
      await loadSlides()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update slide")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this hero slide?")) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/hero-slides/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete slide")
      await loadSlides()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete slide")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <div className="ml-[220px] flex min-h-screen flex-1 flex-col">
        <AdminTopbar />

        <main className="flex-1 space-y-5 p-6">
          <div className="flex items-start justify-between">
            <div>
              <Link
                href="/admin/content"
                className="mb-2 inline-flex items-center gap-1.5 text-[12px] text-[#9A8070] hover:text-[#6B5344]"
              >
                <ArrowLeft className="size-3.5" />
                Back to Content
              </Link>
              <h1 className="font-serif text-[26px] font-semibold text-[#2D1E17]">
                Homepage Hero Slideshow
              </h1>
              <p className="mt-1 text-[13px] text-[#9A8070]">
                Add up to {MAX_SLIDES} background images. They rotate every 6 seconds on the
                homepage.
              </p>
            </div>
            <span className="rounded-full bg-[#F5EDE3] px-3 py-1 text-[12px] font-medium text-[#6B5344]">
              {slides.length}/{MAX_SLIDES} slides
            </span>
          </div>

          {error && (
            <div className="rounded-lg border border-[#F5C2C0] bg-[#FEF2F2] px-4 py-3 text-[13px] text-[#B42318]">
              {error}
            </div>
          )}

          <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
            <section className="rounded-xl border border-[#EDE5D8] bg-white p-5 shadow-sm">
              <h2 className="text-[14px] font-semibold text-[#2B1B12]">Add New Slide</h2>
              <p className="mt-1 text-[12px] text-[#9A8070]">
                Upload a photo or paste an image URL.
              </p>

              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleUpload(file)
                  e.target.value = ""
                }}
              />

              <button
                type="button"
                disabled={saving || slides.length >= MAX_SLIDES}
                onClick={() => fileRef.current?.click()}
                className="mt-4 flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#D4C4A8] py-8 hover:bg-[#FAF7F2] disabled:opacity-50"
              >
                <Upload className="mb-2 size-7 text-[#9A8070]" />
                <span className="text-[12px] font-medium text-[#6B5344]">
                  Click to upload image
                </span>
                <span className="mt-1 text-[11px] text-[#9A8070]">JPG, PNG, WebP — max 5MB</span>
              </button>

              <div className="my-4 text-center text-[11px] text-[#9A8070]">or paste URL</div>

              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://... or /uploads/hero/..."
                className="w-full rounded-lg border border-[#EDE5D8] px-3 py-2.5 text-[13px] outline-none focus:border-[#6B5344]"
              />

              <input
                type="text"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                placeholder="Alt text (optional)"
                className="mt-3 w-full rounded-lg border border-[#EDE5D8] px-3 py-2.5 text-[13px] outline-none focus:border-[#6B5344]"
              />

              {imageUrl && (
                <div className="relative mt-4 aspect-[16/9] overflow-hidden rounded-lg bg-[#FAF7F2]">
                  <Image src={imageUrl} alt="Preview" fill className="object-cover" />
                </div>
              )}

              <button
                type="button"
                disabled={saving || slides.length >= MAX_SLIDES || !imageUrl}
                onClick={handleAddSlide}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#2D1E17] px-4 py-2.5 text-[13px] font-medium text-white hover:bg-[#3D2B21] disabled:opacity-50"
              >
                {saving ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                Add to Slideshow
              </button>
            </section>

            <section className="rounded-xl border border-[#EDE5D8] bg-white p-5 shadow-sm">
              <h2 className="text-[14px] font-semibold text-[#2B1B12]">Current Slides</h2>
              <p className="mt-1 text-[12px] text-[#9A8070]">
                Active slides appear on the homepage hero.
              </p>

              {loading ? (
                <div className="flex items-center justify-center py-16 text-[#9A8070]">
                  <Loader2 className="size-6 animate-spin" />
                </div>
              ) : slides.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <ImageIcon className="size-10 text-[#D4C4A8]" />
                  <p className="mt-3 text-[13px] text-[#9A8070]">No slides yet. Add your first image.</p>
                </div>
              ) : (
                <ul className="mt-4 space-y-3">
                  {slides.map((slide, index) => (
                    <li
                      key={slide.id}
                      className="flex items-center gap-3 rounded-xl border border-[#EDE5D8] p-3"
                    >
                      <GripVertical className="size-4 shrink-0 text-[#D4C4A8]" />
                      <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-[#FAF7F2]">
                        <Image
                          src={slide.imageUrl}
                          alt={slide.alt}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-medium text-[#2D1E17]">
                          Slide {index + 1}
                        </p>
                        <p className="truncate text-[11px] text-[#9A8070]">{slide.alt || slide.imageUrl}</p>
                        <button
                          type="button"
                          onClick={() => handleToggle(slide)}
                          className={`mt-1 text-[11px] font-medium ${
                            slide.isActive ? "text-[#2E7D32]" : "text-[#9A8070]"
                          }`}
                        >
                          {slide.isActive ? "Active" : "Hidden"} — click to toggle
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDelete(slide.id)}
                        className="rounded-lg p-2 text-[#C5221F] hover:bg-[#FEF2F2]"
                        aria-label="Delete slide"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}
