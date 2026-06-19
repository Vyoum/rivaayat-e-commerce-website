"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { ExternalLink, Loader2 } from "lucide-react"

import type { OurStoryContent } from "@/lib/our-story-content-shared"
import { OurStoryFrameCarouselManager } from "@/components/admin/our-story-frame-carousel-manager"

export function OurStoryPhotosManager() {
  const [content, setContent] = useState<OurStoryContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/our-story-content")
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to load")
      setContent(data.content)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function persistContent(nextContent: OurStoryContent) {
    setSaving(true)
    setError(null)
    setSaved(false)
    try {
      const res = await fetch("/api/admin/our-story-content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextContent),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Save failed")
      setContent(data.content)
      setSaved(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="size-6 animate-spin text-[#9A8070]" />
      </div>
    )
  }

  if (!content) return null

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[13px] text-[#9A8070]">
            Upload photos for the three frames on{" "}
            <Link href="/outerboxdesign" target="_blank" className="text-[#6B5344] underline">
              Our Story
            </Link>
            . Changes save automatically after each upload.
          </p>
        </div>
        <Link
          href="/outerboxdesign"
          target="_blank"
          className="flex items-center gap-1.5 rounded-lg border border-[#EDE5D8] px-3 py-2 text-[12px] font-medium text-[#6B5344] hover:bg-[#FAF7F2]"
        >
          <ExternalLink className="size-3.5" />
          Preview page
        </Link>
      </div>

      {saved && (
        <div className="rounded-lg border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3 text-[13px] text-[#166534]">
          Photo saved successfully.
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-[#F5C2C0] bg-[#FEF2F2] px-4 py-3 text-[13px] text-[#B42318]">
          {error}
        </div>
      )}

      {saving ? (
        <div className="flex items-center gap-2 text-[12px] text-[#9A8070]">
          <Loader2 className="size-3.5 animate-spin" />
          Saving…
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <OurStoryFrameCarouselManager
          title="Frame 1 — Hero Carousel"
          description="Upload multiple photos for the top of Our Story. They rotate automatically on the page"
          slides={content.heroCarouselSlides}
          fallbackImageUrl={content.heroImageUrl}
          fallbackAlt="Our Story hero"
          slideIdPrefix="story-hero"
          saving={saving}
          onPersist={async (slides) => {
            await persistContent({
              ...content,
              heroCarouselSlides: slides,
              heroImageUrl: slides[0]?.imageUrl ?? content.heroImageUrl,
            })
          }}
        />
        <OurStoryFrameCarouselManager
          title="Frame 2 — Why House of Indika Exists"
          description="Upload multiple photos for the Why We Exist section. They rotate automatically on the page"
          slides={content.whyExistsCarouselSlides}
          fallbackImageUrl={content.whyExistsImageUrl}
          fallbackAlt="Why House of Indika Exists"
          slideIdPrefix="story-why"
          saving={saving}
          onPersist={async (slides) => {
            await persistContent({
              ...content,
              whyExistsCarouselSlides: slides,
              whyExistsImageUrl: slides[0]?.imageUrl ?? content.whyExistsImageUrl,
            })
          }}
        />
        <OurStoryFrameCarouselManager
          title="Frame 3 — Meet Our Founders"
          description="Upload multiple photos for the Meet Our Founders section. They rotate automatically on the page"
          slides={content.foundersCarouselSlides}
          fallbackImageUrl={content.foundersImageUrl}
          fallbackAlt="Meet Our Founders"
          slideIdPrefix="story-founders"
          saving={saving}
          onPersist={async (slides) => {
            await persistContent({
              ...content,
              foundersCarouselSlides: slides,
              foundersImageUrl: slides[0]?.imageUrl ?? content.foundersImageUrl,
            })
          }}
        />
      </div>
    </div>
  )
}
