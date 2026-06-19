"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { Loader2, Plus, Trash2, Upload } from "lucide-react"

import {
  MAX_STORY_FRAME_SLIDES,
  normalizeStoryFrameSlides,
  type StoryHeroSlide,
} from "@/lib/our-story-content-shared"

type OurStoryFrameCarouselManagerProps = {
  title: string
  description: string
  slides: StoryHeroSlide[]
  fallbackImageUrl: string
  fallbackAlt: string
  slideIdPrefix: string
  saving: boolean
  onPersist: (slides: StoryHeroSlide[]) => Promise<void>
  className?: string
}

function createSlideId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function OurStoryFrameCarouselManager({
  title,
  description,
  slides: rawSlides,
  fallbackImageUrl,
  fallbackAlt,
  slideIdPrefix,
  saving,
  onPersist,
  className,
}: OurStoryFrameCarouselManagerProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const slides = normalizeStoryFrameSlides(
    rawSlides,
    fallbackImageUrl,
    fallbackAlt,
    `${slideIdPrefix}-fallback`,
  )

  async function persistSlides(nextSlides: StoryHeroSlide[]) {
    const normalized = normalizeStoryFrameSlides(
      nextSlides,
      fallbackImageUrl,
      fallbackAlt,
      `${slideIdPrefix}-fallback`,
    )
    await onPersist(normalized)
  }

  async function handleUpload(file: File) {
    if (slides.length >= MAX_STORY_FRAME_SLIDES) {
      setError(`Maximum ${MAX_STORY_FRAME_SLIDES} slides allowed`)
      return
    }

    setUploading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/admin/our-story-content/upload", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Upload failed")

      const nextSlide: StoryHeroSlide = {
        id: createSlideId(slideIdPrefix),
        imageUrl: data.imageUrl as string,
        alt: "",
        sortOrder: slides.length,
        isActive: true,
        mediaType: "image",
      }

      await persistSlides([...slides, nextSlide])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  async function handleRemove(slideId: string) {
    if (slides.length <= 1) {
      setError("At least one slide is required")
      return
    }

    setError(null)
    await persistSlides(slides.filter((slide) => slide.id !== slideId))
  }

  return (
    <div
      className={`rounded-xl border border-[#EDE5D8] bg-white p-5 shadow-sm md:col-span-2 xl:col-span-3 ${className ?? ""}`}
    >
      <h3 className="font-serif text-[16px] font-semibold text-[#2D1E17]">{title}</h3>
      <p className="mt-1 text-[12px] leading-relaxed text-[#9A8070]">
        {description} (up to {MAX_STORY_FRAME_SLIDES} slides).
      </p>

      {error ? (
        <div className="mt-3 rounded-lg border border-[#F5C2C0] bg-[#FEF2F2] px-3 py-2 text-[12px] text-[#B42318]">
          {error}
        </div>
      ) : null}

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) void handleUpload(file)
          event.target.value = ""
        }}
      />

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={uploading || saving || slides.length >= MAX_STORY_FRAME_SLIDES}
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-lg border border-[#EDE5D8] bg-[#FAF7F2] px-4 py-2.5 text-[12px] font-medium text-[#6B5344] transition-colors hover:border-[#C4A882] hover:bg-white disabled:opacity-50"
        >
          {uploading ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
          {uploading ? "Uploading…" : "Add slide"}
        </button>
        <span className="text-[11px] text-[#9A8070]">
          {slides.length}/{MAX_STORY_FRAME_SLIDES} slides
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className="overflow-hidden rounded-lg border border-[#EDE5D8] bg-[#FAF7F2]"
          >
            <div className="relative aspect-[16/9]">
              <Image src={slide.imageUrl} alt={slide.alt || `Slide ${index + 1}`} fill className="object-cover" />
              {index === 0 ? (
                <span className="absolute top-2 left-2 rounded bg-[#2B1B12]/85 px-2 py-0.5 text-[9px] font-semibold tracking-wide text-white uppercase">
                  First
                </span>
              ) : null}
            </div>
            <div className="flex items-center justify-between gap-2 px-3 py-2">
              <span className="font-sans text-[11px] text-[#6B5344]">Slide {index + 1}</span>
              <button
                type="button"
                disabled={saving || slides.length <= 1}
                onClick={() => void handleRemove(slide.id)}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-[#B42318] transition-colors hover:bg-[#FEE2E2] disabled:opacity-40"
              >
                <Trash2 className="size-3.5" />
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {slides.length === 0 ? (
        <div className="mt-4 flex aspect-[16/9] max-w-xl items-center justify-center rounded-lg border border-dashed border-[#D9CFC0] bg-[#FAF7F2] text-[12px] text-[#9A8070]">
          <Upload className="mr-2 size-4" />
          No slides yet
        </div>
      ) : null}
    </div>
  )
}
