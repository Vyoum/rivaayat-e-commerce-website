"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ExternalLink, Loader2, Save, Upload } from "lucide-react"

import type { HomepageStoryContent, HomepageStoryImageKey } from "@/lib/homepage-story-shared"

type HomepageStoryManagerProps = {
  compact?: boolean
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[12px] font-semibold tracking-wide text-[#6B5344] uppercase">
      {children}
    </label>
  )
}

export function HomepageStoryManager({ compact = false }: HomepageStoryManagerProps) {
  const [content, setContent] = useState<HomepageStoryContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingId, setUploadingId] = useState<HomepageStoryImageKey | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const fileRefs = useRef<Partial<Record<HomepageStoryImageKey, HTMLInputElement | null>>>({})

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/homepage-story")
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to load homepage story")
      setContent(data.content)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load homepage story")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function handleUpload(id: HomepageStoryImageKey, file: File) {
    if (!content) return
    setUploadingId(id)
    setError(null)
    setSaved(false)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const uploadRes = await fetch("/api/admin/homepage-story/upload", {
        method: "POST",
        body: formData,
      })
      const uploadData = await uploadRes.json()
      if (!uploadRes.ok) throw new Error(uploadData.error || "Upload failed")

      const images = content.images.map((img) =>
        img.id === id ? { ...img, src: uploadData.imageUrl } : img,
      ) as HomepageStoryContent["images"]

      setContent({ ...content, images })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploadingId(null)
    }
  }

  async function handleSave() {
    if (!content) return
    setSaving(true)
    setError(null)
    setSaved(false)
    try {
      const res = await fetch("/api/admin/homepage-story", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
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
      <div className="flex justify-center py-16">
        <Loader2 className="size-6 animate-spin text-[#9A8070]" />
      </div>
    )
  }

  if (!content) return null

  return (
    <div className={compact ? "space-y-4" : "space-y-5"}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2
            className={`font-serif font-semibold text-[#2D1E17] ${compact ? "text-[20px]" : "text-[22px]"}`}
          >
            Homepage Our Story Snippet
          </h2>
          <p className="mt-1 text-[13px] text-[#9A8070]">
            The story block shown on the homepage right after the hero slideshow.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 rounded-lg border border-[#EDE5D8] px-3 py-2 text-[12px] font-medium text-[#6B5344] hover:bg-[#FAF7F2]"
          >
            <ExternalLink className="size-3.5" />
            Preview
          </Link>
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="flex items-center gap-1.5 rounded-lg bg-[#2D1E17] px-4 py-2 text-[12px] font-medium text-white hover:bg-[#3D2B21] disabled:opacity-50"
          >
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Save Changes
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-[#F5C2C0] bg-[#FEF2F2] px-4 py-3 text-[13px] text-[#B42318]">
          {error}
        </div>
      )}

      {saved && (
        <div className="rounded-lg border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3 text-[13px] text-[#166534]">
          Homepage story snippet saved successfully.
        </div>
      )}

      <div className="grid gap-4 rounded-xl border border-[#EDE5D8] bg-white p-5 shadow-sm lg:grid-cols-2">
        <div>
          <FieldLabel>Eyebrow label</FieldLabel>
          <input
            type="text"
            value={content.eyebrow}
            onChange={(e) => setContent({ ...content, eyebrow: e.target.value })}
            className="mt-1.5 w-full rounded-lg border border-[#EDE5D8] px-3 py-2.5 text-[13px] outline-none focus:border-[#6B5344]"
          />
        </div>
        <div>
          <FieldLabel>Headline (italic line)</FieldLabel>
          <input
            type="text"
            value={content.headline}
            onChange={(e) => setContent({ ...content, headline: e.target.value })}
            className="mt-1.5 w-full rounded-lg border border-[#EDE5D8] px-3 py-2.5 text-[13px] outline-none focus:border-[#6B5344]"
          />
        </div>
        <div>
          <FieldLabel>Body paragraph 1</FieldLabel>
          <textarea
            value={content.bodyParagraphs[0]}
            onChange={(e) =>
              setContent({
                ...content,
                bodyParagraphs: [e.target.value, content.bodyParagraphs[1]],
              })
            }
            rows={4}
            className="mt-1.5 w-full resize-y rounded-lg border border-[#EDE5D8] px-3 py-2.5 text-[13px] leading-relaxed outline-none focus:border-[#6B5344]"
          />
        </div>
        <div>
          <FieldLabel>Body paragraph 2</FieldLabel>
          <textarea
            value={content.bodyParagraphs[1]}
            onChange={(e) =>
              setContent({
                ...content,
                bodyParagraphs: [content.bodyParagraphs[0], e.target.value],
              })
            }
            rows={4}
            className="mt-1.5 w-full resize-y rounded-lg border border-[#EDE5D8] px-3 py-2.5 text-[13px] leading-relaxed outline-none focus:border-[#6B5344]"
          />
        </div>
        <div className="lg:col-span-2">
          <FieldLabel>Highlighted quote</FieldLabel>
          <textarea
            value={content.quote}
            onChange={(e) => setContent({ ...content, quote: e.target.value })}
            rows={3}
            className="mt-1.5 w-full resize-y rounded-lg border border-[#EDE5D8] px-3 py-2.5 text-[13px] leading-relaxed outline-none focus:border-[#6B5344]"
          />
        </div>
        <div>
          <FieldLabel>Link label</FieldLabel>
          <input
            type="text"
            value={content.ctaLabel}
            onChange={(e) => setContent({ ...content, ctaLabel: e.target.value })}
            className="mt-1.5 w-full rounded-lg border border-[#EDE5D8] px-3 py-2.5 text-[13px] outline-none focus:border-[#6B5344]"
          />
        </div>
        <div>
          <FieldLabel>Link URL</FieldLabel>
          <input
            type="text"
            value={content.ctaHref}
            onChange={(e) => setContent({ ...content, ctaHref: e.target.value })}
            placeholder="/ourstory"
            className="mt-1.5 w-full rounded-lg border border-[#EDE5D8] px-3 py-2.5 text-[13px] outline-none focus:border-[#6B5344]"
          />
        </div>
      </div>

      <div className="rounded-xl border border-[#EDE5D8] bg-white p-5 shadow-sm">
        <h3 className="text-[14px] font-semibold text-[#2B1B12]">Story photo grid</h3>
        <p className="mt-1 text-[12px] text-[#9A8070]">
          Four stamp-style images on the left of the homepage story section.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {content.images.map((img) => {
            const isUploading = uploadingId === img.id
            return (
              <article key={img.id} className="rounded-lg border border-[#EDE5D8] p-4">
                <p className="text-[12px] font-semibold text-[#6B5344]">Photo {img.id}</p>
                <div className="relative mt-2 aspect-[4/5] overflow-hidden rounded-lg bg-[#FAF7F2]">
                  <Image src={img.src} alt={img.alt} fill className="object-cover" />
                </div>
                <div className="mt-3">
                  <FieldLabel>Alt text</FieldLabel>
                  <input
                    type="text"
                    value={img.alt}
                    onChange={(e) => {
                      const images = content.images.map((item) =>
                        item.id === img.id ? { ...item, alt: e.target.value } : item,
                      ) as HomepageStoryContent["images"]
                      setContent({ ...content, images })
                    }}
                    className="mt-1.5 w-full rounded-lg border border-[#EDE5D8] px-3 py-2 text-[12px] outline-none focus:border-[#6B5344]"
                  />
                </div>
                <input
                  ref={(el) => {
                    fileRefs.current[img.id] = el
                  }}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleUpload(img.id, file)
                    e.target.value = ""
                  }}
                />
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => fileRefs.current[img.id]?.click()}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-[#EDE5D8] px-3 py-2 text-[12px] font-medium text-[#6B5344] hover:bg-[#FAF7F2] disabled:opacity-50"
                >
                  {isUploading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Upload className="size-4" />
                  )}
                  {isUploading ? "Uploading…" : "Replace Photo"}
                </button>
              </article>
            )
          })}
        </div>
      </div>
    </div>
  )
}
