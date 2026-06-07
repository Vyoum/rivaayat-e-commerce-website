"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ExternalLink, Loader2, Save, Upload } from "lucide-react"

import type { OurStoryContent } from "@/lib/our-story-content-shared"
import type { ArtisanPageContent } from "@/lib/artisan-page-content-shared"

type EditorTab = "our-story" | "artisans"

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[12px] font-semibold tracking-wide text-[#6B5344] uppercase">
      {children}
    </label>
  )
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="mt-1.5 w-full rounded-lg border border-[#EDE5D8] px-3 py-2.5 text-[13px] outline-none focus:border-[#6B5344]"
    />
  )
}

function TextArea({
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  value: string
  onChange: (value: string) => void
  rows?: number
  placeholder?: string
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder}
      className="mt-1.5 w-full resize-y rounded-lg border border-[#EDE5D8] px-3 py-2.5 text-[13px] leading-relaxed outline-none focus:border-[#6B5344]"
    />
  )
}

function ImageUploadField({
  label,
  imageUrl,
  uploading,
  onUpload,
  onUrlChange,
}: {
  label: string
  imageUrl: string
  uploading: boolean
  onUpload: (file: File) => void
  onUrlChange: (url: string) => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)

  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="mt-1.5 flex gap-2">
        <input
          type="url"
          value={imageUrl}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="/path/to/image.jpg or https://..."
          className="min-w-0 flex-1 rounded-lg border border-[#EDE5D8] px-3 py-2.5 text-[13px] outline-none focus:border-[#6B5344]"
        />
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
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-[#EDE5D8] px-3 py-2.5 text-[12px] font-medium text-[#6B5344] hover:bg-[#FAF7F2] disabled:opacity-50"
        >
          {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
          Upload
        </button>
      </div>
      {imageUrl && (
        <div className="relative mt-3 aspect-[16/9] max-w-sm overflow-hidden rounded-lg bg-[#FAF7F2]">
          <Image src={imageUrl} alt="" fill className="object-cover" />
        </div>
      )}
    </div>
  )
}

function OurStoryEditor() {
  const [content, setContent] = useState<OurStoryContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingHero, setUploadingHero] = useState(false)
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

  async function handleHeroUpload(file: File) {
    setUploadingHero(true)
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
      setContent((prev) => (prev ? { ...prev, heroImageUrl: data.imageUrl } : prev))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploadingHero(false)
    }
  }

  async function handleSave() {
    if (!content) return
    setSaving(true)
    setError(null)
    setSaved(false)
    try {
      const res = await fetch("/api/admin/our-story-content", {
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
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-serif text-[20px] font-semibold text-[#2D1E17]">Our Story Page</h2>
          <p className="mt-1 text-[13px] text-[#9A8070]">
            Edits appear on{" "}
            <Link href="/outerboxdesign" target="_blank" className="text-[#6B5344] underline">
              /outerboxdesign
            </Link>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/outerboxdesign"
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

      {saved && (
        <div className="rounded-lg border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3 text-[13px] text-[#166534]">
          Our Story page saved successfully.
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-[#F5C2C0] bg-[#FEF2F2] px-4 py-3 text-[13px] text-[#B42318]">
          {error}
        </div>
      )}

      <div className="space-y-5">
        <div className="grid gap-4 rounded-xl border border-[#EDE5D8] bg-white p-5 shadow-sm lg:grid-cols-2">
          <ImageUploadField
            label="Hero background image"
            imageUrl={content.heroImageUrl}
            uploading={uploadingHero}
            onUpload={handleHeroUpload}
            onUrlChange={(heroImageUrl) => setContent({ ...content, heroImageUrl })}
          />

          <div className="space-y-4">
            <div>
              <FieldLabel>Hero title line 1</FieldLabel>
              <TextInput
                value={content.heroTitleLine1}
                onChange={(heroTitleLine1) => setContent({ ...content, heroTitleLine1 })}
                placeholder="From Craft"
              />
            </div>
            <div>
              <FieldLabel>Hero title line 2</FieldLabel>
              <TextInput
                value={content.heroTitleLine2}
                onChange={(heroTitleLine2) => setContent({ ...content, heroTitleLine2 })}
                placeholder="to Collection"
              />
            </div>
            <div>
              <FieldLabel>Craftsmanship intro</FieldLabel>
              <TextArea
                value={content.craftsmanshipIntro}
                onChange={(craftsmanshipIntro) => setContent({ ...content, craftsmanshipIntro })}
                rows={3}
              />
            </div>
            <div>
              <FieldLabel>Craftsmanship closing line</FieldLabel>
              <TextInput
                value={content.craftsmanshipClosing}
                onChange={(craftsmanshipClosing) => setContent({ ...content, craftsmanshipClosing })}
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#EDE5D8] bg-white p-5 shadow-sm">
          <h3 className="font-serif text-[16px] font-semibold text-[#2D1E17]">Heritage section</h3>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <ImageUploadField
              label="Heritage image"
              imageUrl={content.heritageImageUrl}
              uploading={false}
              onUpload={handleHeroUpload}
              onUrlChange={(heritageImageUrl) => setContent({ ...content, heritageImageUrl })}
            />
            <div className="space-y-4">
              <div>
                <FieldLabel>Title</FieldLabel>
                <TextInput
                  value={content.heritageTitle}
                  onChange={(heritageTitle) => setContent({ ...content, heritageTitle })}
                />
              </div>
              <div>
                <FieldLabel>Body</FieldLabel>
                <TextArea
                  value={content.heritageBody}
                  onChange={(heritageBody) => setContent({ ...content, heritageBody })}
                  rows={3}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <FieldLabel>CTA label</FieldLabel>
                  <TextInput
                    value={content.heritageCtaLabel}
                    onChange={(heritageCtaLabel) => setContent({ ...content, heritageCtaLabel })}
                  />
                </div>
                <div>
                  <FieldLabel>CTA link</FieldLabel>
                  <TextInput
                    value={content.heritageCtaHref}
                    onChange={(heritageCtaHref) => setContent({ ...content, heritageCtaHref })}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#EDE5D8] bg-white p-5 shadow-sm">
          <h3 className="font-serif text-[16px] font-semibold text-[#2D1E17]">Symphony section</h3>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <ImageUploadField
              label="Workshop background image"
              imageUrl={content.symphonyImageUrl}
              uploading={false}
              onUpload={handleHeroUpload}
              onUrlChange={(symphonyImageUrl) => setContent({ ...content, symphonyImageUrl })}
            />
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <FieldLabel>Title</FieldLabel>
                  <TextInput
                    value={content.symphonyTitle}
                    onChange={(symphonyTitle) => setContent({ ...content, symphonyTitle })}
                  />
                </div>
                <div>
                  <FieldLabel>Title accent (italic)</FieldLabel>
                  <TextInput
                    value={content.symphonyTitleAccent}
                    onChange={(symphonyTitleAccent) =>
                      setContent({ ...content, symphonyTitleAccent })
                    }
                  />
                </div>
              </div>
              <div>
                <FieldLabel>Body</FieldLabel>
                <TextArea
                  value={content.symphonyBody}
                  onChange={(symphonyBody) => setContent({ ...content, symphonyBody })}
                  rows={3}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <FieldLabel>CTA label</FieldLabel>
                  <TextInput
                    value={content.symphonyCtaLabel}
                    onChange={(symphonyCtaLabel) => setContent({ ...content, symphonyCtaLabel })}
                  />
                </div>
                <div>
                  <FieldLabel>CTA link</FieldLabel>
                  <TextInput
                    value={content.symphonyCtaHref}
                    onChange={(symphonyCtaHref) => setContent({ ...content, symphonyCtaHref })}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#EDE5D8] bg-white p-5 shadow-sm">
          <h3 className="font-serif text-[16px] font-semibold text-[#2D1E17]">Footer CTA</h3>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="space-y-4">
              <ImageUploadField
                label="Footer background"
                imageUrl={content.footerBackgroundUrl}
                uploading={false}
                onUpload={handleHeroUpload}
                onUrlChange={(footerBackgroundUrl) => setContent({ ...content, footerBackgroundUrl })}
              />
              <ImageUploadField
                label="Footer thumbnail left"
                imageUrl={content.footerThumbLeftUrl}
                uploading={false}
                onUpload={handleHeroUpload}
                onUrlChange={(footerThumbLeftUrl) => setContent({ ...content, footerThumbLeftUrl })}
              />
              <ImageUploadField
                label="Footer thumbnail right"
                imageUrl={content.footerThumbRightUrl}
                uploading={false}
                onUpload={handleHeroUpload}
                onUrlChange={(footerThumbRightUrl) => setContent({ ...content, footerThumbRightUrl })}
              />
            </div>
            <div className="space-y-4">
              <div>
                <FieldLabel>Footer text</FieldLabel>
                <TextArea
                  value={content.footerText}
                  onChange={(footerText) => setContent({ ...content, footerText })}
                  rows={3}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <FieldLabel>CTA label</FieldLabel>
                  <TextInput
                    value={content.footerCtaLabel}
                    onChange={(footerCtaLabel) => setContent({ ...content, footerCtaLabel })}
                  />
                </div>
                <div>
                  <FieldLabel>CTA link</FieldLabel>
                  <TextInput
                    value={content.footerCtaHref}
                    onChange={(footerCtaHref) => setContent({ ...content, footerCtaHref })}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ArtisanPageEditor() {
  const [content, setContent] = useState<ArtisanPageContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingHero, setUploadingHero] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/artisan-page-content")
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

  async function handleUpload(
    file: File,
    field: "heroImageUrl" | "videoThumbnailUrl",
    setUploading: (v: boolean) => void,
  ) {
    setUploading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/admin/artisan-page-content/upload", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Upload failed")
      setContent((prev) => (prev ? { ...prev, [field]: data.imageUrl } : prev))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  async function handleSave() {
    if (!content) return
    setSaving(true)
    setError(null)
    setSaved(false)
    try {
      const res = await fetch("/api/admin/artisan-page-content", {
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
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-serif text-[20px] font-semibold text-[#2D1E17]">Artisans Page</h2>
          <p className="mt-1 text-[13px] text-[#9A8070]">
            Edits appear on{" "}
            <Link
              href="/artisans/devendra-khatri"
              target="_blank"
              className="text-[#6B5344] underline"
            >
              /artisans/devendra-khatri
            </Link>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/artisans/devendra-khatri"
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

      {saved && (
        <div className="rounded-lg border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3 text-[13px] text-[#166534]">
          Artisans page saved successfully.
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-[#F5C2C0] bg-[#FEF2F2] px-4 py-3 text-[13px] text-[#B42318]">
          {error}
        </div>
      )}

      <div className="space-y-4 rounded-xl border border-[#EDE5D8] bg-white p-5 shadow-sm">
        <h3 className="text-[14px] font-semibold text-[#2B1B12]">Hero</h3>
        <div className="grid gap-4 lg:grid-cols-2">
          <ImageUploadField
            label="Hero image"
            imageUrl={content.heroImageUrl}
            uploading={uploadingHero}
            onUpload={(file) => handleUpload(file, "heroImageUrl", setUploadingHero)}
            onUrlChange={(heroImageUrl) => setContent({ ...content, heroImageUrl })}
          />
          <div className="space-y-4">
            <div>
              <FieldLabel>Eyebrow</FieldLabel>
              <TextInput
                value={content.eyebrow}
                onChange={(eyebrow) => setContent({ ...content, eyebrow })}
              />
            </div>
            <div>
              <FieldLabel>Artisan name</FieldLabel>
              <TextInput
                value={content.name}
                onChange={(name) => setContent({ ...content, name })}
              />
            </div>
            <div>
              <FieldLabel>Tagline</FieldLabel>
              <TextInput
                value={content.tagline}
                onChange={(tagline) => setContent({ ...content, tagline })}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 rounded-xl border border-[#EDE5D8] bg-white p-5 shadow-sm">
        <h3 className="text-[14px] font-semibold text-[#2B1B12]">Biography</h3>
        <div>
          <FieldLabel>Section title</FieldLabel>
          <TextInput
            value={content.biographyTitle}
            onChange={(biographyTitle) => setContent({ ...content, biographyTitle })}
          />
        </div>
        {[0, 1, 2].map((index) => (
          <div key={index}>
            <FieldLabel>Paragraph {index + 1}</FieldLabel>
            <TextArea
              value={content.biographyParagraphs[index]}
              onChange={(value) => {
                const biographyParagraphs = [...content.biographyParagraphs] as [
                  string,
                  string,
                  string,
                ]
                biographyParagraphs[index] = value
                setContent({ ...content, biographyParagraphs })
              }}
              rows={4}
            />
          </div>
        ))}
        <div>
          <FieldLabel>Quote</FieldLabel>
          <TextArea
            value={content.quote}
            onChange={(quote) => setContent({ ...content, quote })}
            rows={3}
          />
        </div>
      </div>

      <div className="space-y-4 rounded-xl border border-[#EDE5D8] bg-white p-5 shadow-sm">
        <h3 className="text-[14px] font-semibold text-[#2B1B12]">Credentials</h3>
        {content.credentials.map((credential, index) => (
          <div key={index} className="grid gap-3 rounded-lg bg-[#FAF7F2]/60 p-4 sm:grid-cols-2">
            <div>
              <FieldLabel>Credential {index + 1} title</FieldLabel>
              <TextInput
                value={credential.title}
                onChange={(title) => {
                  const credentials = [...content.credentials] as ArtisanPageContent["credentials"]
                  credentials[index] = { ...credentials[index], title }
                  setContent({ ...content, credentials })
                }}
              />
            </div>
            <div>
              <FieldLabel>Credential {index + 1} description</FieldLabel>
              <TextInput
                value={credential.description}
                onChange={(description) => {
                  const credentials = [...content.credentials] as ArtisanPageContent["credentials"]
                  credentials[index] = { ...credentials[index], description }
                  setContent({ ...content, credentials })
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4 rounded-xl border border-[#EDE5D8] bg-white p-5 shadow-sm">
        <h3 className="text-[14px] font-semibold text-[#2B1B12]">Video section</h3>
        <div className="grid gap-4 lg:grid-cols-2">
          <ImageUploadField
            label="Video thumbnail"
            imageUrl={content.videoThumbnailUrl}
            uploading={uploadingVideo}
            onUpload={(file) => handleUpload(file, "videoThumbnailUrl", setUploadingVideo)}
            onUrlChange={(videoThumbnailUrl) => setContent({ ...content, videoThumbnailUrl })}
          />
          <div className="space-y-4">
            <div>
              <FieldLabel>Video title</FieldLabel>
              <TextInput
                value={content.videoTitle}
                onChange={(videoTitle) => setContent({ ...content, videoTitle })}
              />
            </div>
            <div>
              <FieldLabel>Video subtitle</FieldLabel>
              <TextInput
                value={content.videoSubtitle}
                onChange={(videoSubtitle) => setContent({ ...content, videoSubtitle })}
              />
            </div>
            <div>
              <FieldLabel>Video URL (YouTube, Vimeo, or direct link)</FieldLabel>
              <TextInput
                value={content.videoUrl}
                onChange={(videoUrl) => setContent({ ...content, videoUrl })}
                placeholder="https://..."
              />
            </div>
            <div>
              <FieldLabel>Play button label</FieldLabel>
              <TextInput
                value={content.videoCtaLabel}
                onChange={(videoCtaLabel) => setContent({ ...content, videoCtaLabel })}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 rounded-xl border border-[#EDE5D8] bg-white p-5 shadow-sm">
        <h3 className="text-[14px] font-semibold text-[#2B1B12]">Handpicked section</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel>Section title</FieldLabel>
            <TextInput
              value={content.handpickedTitle}
              onChange={(handpickedTitle) => setContent({ ...content, handpickedTitle })}
            />
          </div>
          <div>
            <FieldLabel>Section subtitle</FieldLabel>
            <TextInput
              value={content.handpickedSubtitle}
              onChange={(handpickedSubtitle) => setContent({ ...content, handpickedSubtitle })}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export function OurStoryAdminEditors() {
  const [tab, setTab] = useState<EditorTab>("our-story")

  return (
    <div className="space-y-5">
      <div className="flex gap-2 rounded-xl border border-[#EDE5D8] bg-white p-1.5 shadow-sm">
        {(
          [
            { id: "our-story" as const, label: "Our Story Page" },
            { id: "artisans" as const, label: "Artisans Page" },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`flex-1 rounded-lg px-4 py-2.5 text-[13px] font-medium transition-colors ${
              tab === item.id
                ? "bg-[#2D1E17] text-white"
                : "text-[#6B5344] hover:bg-[#FAF7F2]"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "our-story" ? <OurStoryEditor /> : <ArtisanPageEditor />}
    </div>
  )
}
