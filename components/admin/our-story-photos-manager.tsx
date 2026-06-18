"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ExternalLink, Loader2, Upload } from "lucide-react"

import type { OurStoryContent } from "@/lib/our-story-content-shared"

function PhotoUploadCard({
  title,
  description,
  imageUrl,
  uploading,
  onUpload,
}: {
  title: string
  description: string
  imageUrl: string
  uploading: boolean
  onUpload: (file: File) => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)

  return (
    <div className="rounded-xl border border-[#EDE5D8] bg-white p-5 shadow-sm">
      <h3 className="font-serif text-[16px] font-semibold text-[#2D1E17]">{title}</h3>
      <p className="mt-1 text-[12px] leading-relaxed text-[#9A8070]">{description}</p>

      <div className="mt-4">
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) onUpload(file)
            e.target.value = ""
          }}
        />
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-lg border border-[#EDE5D8] bg-[#FAF7F2] px-4 py-2.5 text-[12px] font-medium text-[#6B5344] transition-colors hover:border-[#C4A882] hover:bg-white disabled:opacity-50"
        >
          {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
          {uploading ? "Uploading…" : "Upload photo"}
        </button>
      </div>

      {imageUrl ? (
        <div className="relative mt-4 aspect-[16/9] max-w-md overflow-hidden rounded-lg bg-[#FAF7F2]">
          <Image src={imageUrl} alt="" fill className="object-cover" />
        </div>
      ) : (
        <div className="mt-4 flex aspect-[16/9] max-w-md items-center justify-center rounded-lg border border-dashed border-[#D9CFC0] bg-[#FAF7F2] text-[12px] text-[#9A8070]">
          No photo uploaded yet
        </div>
      )}
    </div>
  )
}

export function OurStoryPhotosManager() {
  const [content, setContent] = useState<OurStoryContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingHero, setUploadingHero] = useState(false)
  const [uploadingWhyExists, setUploadingWhyExists] = useState(false)
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

  async function handleImageUpload(
    file: File,
    field: "heroImageUrl" | "whyExistsImageUrl",
    setUploading: (value: boolean) => void,
  ) {
    if (!content) return

    setUploading(true)
    setError(null)
    setSaved(false)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/admin/our-story-content/upload", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Upload failed")

      const nextContent = { ...content, [field]: data.imageUrl }
      setContent(nextContent)
      await persistContent(nextContent)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
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
            Upload photos for the two frames on{" "}
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

      {saving && !uploadingHero && !uploadingWhyExists ? (
        <div className="flex items-center gap-2 text-[12px] text-[#9A8070]">
          <Loader2 className="size-3.5 animate-spin" />
          Saving…
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <PhotoUploadCard
          title="Frame 1 — From Craft to Collection"
          description="Background photo behind the hero headline at the top of Our Story."
          imageUrl={content.heroImageUrl}
          uploading={uploadingHero}
          onUpload={(file) => void handleImageUpload(file, "heroImageUrl", setUploadingHero)}
        />
        <PhotoUploadCard
          title='Frame 2 — Why House of Indika Exists'
          description="Photo shown beside the intro copy in the first content section."
          imageUrl={content.whyExistsImageUrl}
          uploading={uploadingWhyExists}
          onUpload={(file) => void handleImageUpload(file, "whyExistsImageUrl", setUploadingWhyExists)}
        />
      </div>
    </div>
  )
}
