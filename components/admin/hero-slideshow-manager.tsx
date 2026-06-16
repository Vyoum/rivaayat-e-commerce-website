"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import {
  GripVertical,
  ImageIcon,
  Loader2,
  Plus,
  Save,
  Trash2,
  Upload,
  Video,
} from "lucide-react"
import type { HeroCopy, HeroSlide } from "@/lib/hero-slides-shared"
import { DEFAULT_HERO_COPY, MAX_HERO_SLIDES } from "@/lib/hero-slides-shared"

type HeroSlideshowManagerProps = {
  compact?: boolean
}

export function HeroSlideshowManager({ compact = false }: HeroSlideshowManagerProps) {
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [copy, setCopy] = useState<HeroCopy>(DEFAULT_HERO_COPY)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savingCopy, setSavingCopy] = useState(false)
  const [copySaved, setCopySaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState("")
  const [mediaType, setMediaType] = useState<"image" | "video">("image")
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
      setCopy(data.copy ?? DEFAULT_HERO_COPY)
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
      setMediaType(data.mediaType === "video" ? "video" : "image")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setSaving(false)
    }
  }

  async function handleSaveCopy() {
    setSavingCopy(true)
    setError(null)
    setCopySaved(false)
    try {
      const res = await fetch("/api/admin/hero-slides", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(copy),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to save hero text")
      setCopy(data.copy ?? copy)
      setCopySaved(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save hero text")
    } finally {
      setSavingCopy(false)
    }
  }

  async function handleAddSlide() {
    if (!imageUrl.trim()) {
      setError("Upload a photo/video or paste a media URL first")
      return
    }
    if (slides.length >= MAX_HERO_SLIDES) {
      setError(`Maximum ${MAX_HERO_SLIDES} slides allowed`)
      return
    }

    setSaving(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/hero-slides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: imageUrl.trim(),
          alt: alt.trim(),
          mediaType,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to add slide")
      setImageUrl("")
      setAlt("")
      setMediaType("image")
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
    <div className={compact ? "space-y-4" : "space-y-5"}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className={`font-serif font-semibold text-[#2D1E17] ${compact ? "text-[20px]" : "text-[22px]"}`}>
            Homepage Hero Slideshow
          </h2>
          <p className="mt-1 text-[13px] text-[#9A8070]">
            Upload images or videos — up to {MAX_HERO_SLIDES} slides rotate every 6 seconds on the homepage.
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-[#F5EDE3] px-3 py-1 text-[12px] font-medium text-[#6B5344]">
          {slides.length}/{MAX_HERO_SLIDES} slides
        </span>
      </div>

      {error && (
        <div className="rounded-lg border border-[#F5C2C0] bg-[#FEF2F2] px-4 py-3 text-[13px] text-[#B42318]">
          {error}
        </div>
      )}

      <section className="rounded-xl border border-[#EDE5D8] bg-white p-5 shadow-sm">
        <h3 className="text-[14px] font-semibold text-[#2B1B12]">Hero Text</h3>
        <p className="mt-1 text-[12px] text-[#9A8070]">
          Tagline and headline shown over the homepage hero slideshow.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="text-[12px] font-semibold tracking-wide text-[#6B5344] uppercase">
              Tagline
            </span>
            <input
              type="text"
              value={copy.tagline}
              onChange={(e) => {
                setCopy((prev) => ({ ...prev, tagline: e.target.value }))
                setCopySaved(false)
              }}
              placeholder="From Our World, For Yours"
              className="mt-2 w-full rounded-lg border border-[#EDE5D8] px-3 py-2.5 text-[13px] outline-none focus:border-[#6B5344]"
            />
          </label>

          <label className="block">
            <span className="text-[12px] font-semibold tracking-wide text-[#6B5344] uppercase">
              Headline line 1
            </span>
            <input
              type="text"
              value={copy.titleLine1}
              onChange={(e) => {
                setCopy((prev) => ({ ...prev, titleLine1: e.target.value }))
                setCopySaved(false)
              }}
              placeholder="Discover Stories"
              className="mt-2 w-full rounded-lg border border-[#EDE5D8] px-3 py-2.5 text-[13px] outline-none focus:border-[#6B5344]"
            />
          </label>

          <label className="block">
            <span className="text-[12px] font-semibold tracking-wide text-[#6B5344] uppercase">
              Headline line 2
            </span>
            <input
              type="text"
              value={copy.titleLine2}
              onChange={(e) => {
                setCopy((prev) => ({ ...prev, titleLine2: e.target.value }))
                setCopySaved(false)
              }}
              placeholder="Crafted by Hand"
              className="mt-2 w-full rounded-lg border border-[#EDE5D8] px-3 py-2.5 text-[13px] outline-none focus:border-[#6B5344]"
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="text-[12px] font-semibold tracking-wide text-[#6B5344] uppercase">
              Subtitle
            </span>
            <textarea
              value={copy.subtitle}
              onChange={(e) => {
                setCopy((prev) => ({ ...prev, subtitle: e.target.value }))
                setCopySaved(false)
              }}
              rows={3}
              placeholder="Timeless treasures, thoughtfully made..."
              className="mt-2 w-full resize-y rounded-lg border border-[#EDE5D8] px-3 py-2.5 text-[13px] leading-relaxed outline-none focus:border-[#6B5344]"
            />
          </label>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            disabled={savingCopy}
            onClick={() => void handleSaveCopy()}
            className="inline-flex items-center gap-2 rounded-xl bg-[#2D1E17] px-4 py-2.5 text-[13px] font-medium text-white hover:bg-[#3D2B21] disabled:opacity-50"
          >
            {savingCopy ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Save Hero Text
          </button>
          {copySaved ? (
            <span className="text-[12px] font-medium text-[#2E7D32]">Saved</span>
          ) : null}
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
        <section className="rounded-xl border border-[#EDE5D8] bg-white p-5 shadow-sm">
          <h3 className="text-[14px] font-semibold text-[#2B1B12]">Upload Media</h3>
          <p className="mt-1 text-[12px] text-[#9A8070]">
            Drag in a photo or short video, or paste a URL.
          </p>

          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleUpload(file)
              e.target.value = ""
            }}
          />

          <button
            type="button"
            disabled={saving || slides.length >= MAX_HERO_SLIDES}
            onClick={() => fileRef.current?.click()}
            className="mt-4 flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#D4C4A8] py-8 hover:bg-[#FAF7F2] disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="mb-2 size-7 animate-spin text-[#9A8070]" />
            ) : (
              <Upload className="mb-2 size-7 text-[#9A8070]" />
            )}
            <span className="text-[12px] font-medium text-[#6B5344]">
              Click to upload image or video
            </span>
            <span className="mt-1 text-[11px] text-[#9A8070]">
              JPG, PNG, WebP, GIF · MP4, WebM · max 5MB images / 25MB video
            </span>
          </button>

          <div className="my-4 text-center text-[11px] text-[#9A8070]">or paste URL</div>

          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://... or /uploads/hero/..."
            className="w-full rounded-lg border border-[#EDE5D8] px-3 py-2.5 text-[13px] outline-none focus:border-[#6B5344]"
          />

          <div className="mt-3 flex gap-2">
            {(["image", "video"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setMediaType(type)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-[12px] font-medium transition-colors ${
                  mediaType === type
                    ? "border-[#2D1E17] bg-[#2D1E17] text-white"
                    : "border-[#EDE5D8] text-[#6B5344] hover:bg-[#FAF7F2]"
                }`}
              >
                {type === "image" ? <ImageIcon className="size-3.5" /> : <Video className="size-3.5" />}
                {type === "image" ? "Image" : "Video"}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            placeholder="Alt text / description (optional)"
            className="mt-3 w-full rounded-lg border border-[#EDE5D8] px-3 py-2.5 text-[13px] outline-none focus:border-[#6B5344]"
          />

          {imageUrl && (
            <div className="relative mt-4 aspect-[16/9] overflow-hidden rounded-lg bg-[#FAF7F2]">
              {mediaType === "video" ? (
                <video
                  src={imageUrl}
                  className="size-full object-cover"
                  controls
                  muted
                  playsInline
                />
              ) : (
                <Image src={imageUrl} alt="Preview" fill className="object-cover" />
              )}
            </div>
          )}

          <button
            type="button"
            disabled={saving || slides.length >= MAX_HERO_SLIDES || !imageUrl}
            onClick={handleAddSlide}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#2D1E17] px-4 py-2.5 text-[13px] font-medium text-white hover:bg-[#3D2B21] disabled:opacity-50"
          >
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
            Add to Slideshow
          </button>
        </section>

        <section className="rounded-xl border border-[#EDE5D8] bg-white p-5 shadow-sm">
          <h3 className="text-[14px] font-semibold text-[#2B1B12]">Current Slides</h3>
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
              <p className="mt-3 text-[13px] text-[#9A8070]">No slides yet. Upload your first image or video.</p>
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
                    {slide.mediaType === "video" ? (
                      <video
                        src={slide.imageUrl}
                        className="size-full object-cover"
                        muted
                        playsInline
                      />
                    ) : (
                      <Image
                        src={slide.imageUrl}
                        alt={slide.alt}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-[#2D1E17]">
                      Slide {index + 1}
                      <span className="ml-2 text-[10px] font-normal uppercase tracking-wide text-[#9A8070]">
                        {slide.mediaType === "video" ? "Video" : "Image"}
                      </span>
                    </p>
                    <p className="truncate text-[11px] text-[#9A8070]">{slide.alt || slide.imageUrl}</p>
                    <button
                      type="button"
                      onClick={() => handleToggle(slide)}
                      className={`mt-1 text-[11px] font-medium ${
                        slide.isActive ? "text-[#2E7D32]" : "text-[#9A8070]"
                      }`}
                    >
                      {slide.isActive ? "Active on homepage" : "Hidden"} — click to toggle
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
    </div>
  )
}
