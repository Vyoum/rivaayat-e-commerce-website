"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ExternalLink,
  Loader2,
  Plus,
  Save,
  Trash2,
  Upload,
} from "lucide-react"

import type { ArtisanPageContent } from "@/lib/artisan-page-content-shared"
import { MAX_ARTISAN_PROFILES } from "@/lib/artisan-page-content-shared"

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
      {imageUrl ? (
        <div className="relative mt-3 aspect-[16/9] max-w-sm overflow-hidden rounded-lg bg-[#FAF7F2]">
          <Image src={imageUrl} alt="" fill className="object-cover" unoptimized />
        </div>
      ) : null}
    </div>
  )
}

function ArtisanProfileEditor({
  profile,
  onChange,
  onSave,
  onDelete,
  saving,
  deleting,
}: {
  profile: ArtisanPageContent
  onChange: (profile: ArtisanPageContent) => void
  onSave: () => void
  onDelete: () => void
  saving: boolean
  deleting: boolean
}) {
  const [uploadingHero, setUploadingHero] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleUpload(
    file: File,
    field: "heroImageUrl" | "videoThumbnailUrl",
    setUploading: (value: boolean) => void,
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
      onChange({ ...profile, [field]: data.imageUrl })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-[#EDE5D8] p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold tracking-wide text-[#9A8070] uppercase">
              Edit Profile
            </p>
            <h2 className="font-serif text-[20px] font-semibold text-[#2B1B12]">{profile.name}</h2>
            <p className="mt-1 text-[12px] text-[#9A8070]">/artisans/{profile.slug}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/artisans/${profile.slug}`}
              target="_blank"
              className="flex items-center gap-1.5 rounded-lg border border-[#EDE5D8] px-3 py-2 text-[12px] font-medium text-[#6B5344] hover:bg-[#FAF7F2]"
            >
              <ExternalLink className="size-3.5" />
              Preview
            </Link>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-5">
        {error ? (
          <div className="rounded-lg border border-[#F5C2C0] bg-[#FEF2F2] px-4 py-3 text-[13px] text-[#B42318]">
            {error}
          </div>
        ) : null}

        <section className="rounded-xl border border-[#EDE5D8] bg-[#FAF7F2]/40 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[13px] font-medium text-[#2B1B12]">Public profile</p>
              <p className="text-[11px] text-[#9A8070]">
                Published profiles appear in the shuffle on the storefront.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onChange({ ...profile, isPublished: !profile.isPublished })}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                profile.isPublished ? "bg-[#3B82F6]" : "bg-[#D8CFC4]"
              }`}
            >
              <span
                className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-transform ${
                  profile.isPublished ? "left-[22px]" : "left-0.5"
                }`}
              />
            </button>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-[14px] font-semibold text-[#2B1B12]">Basics</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel>Artisan name</FieldLabel>
              <TextInput value={profile.name} onChange={(name) => onChange({ ...profile, name })} />
            </div>
            <div>
              <FieldLabel>URL slug</FieldLabel>
              <TextInput
                value={profile.slug}
                onChange={(slug) => onChange({ ...profile, slug })}
                placeholder="devendra-khatri"
              />
            </div>
          </div>
          <div>
            <FieldLabel>Eyebrow</FieldLabel>
            <TextInput
              value={profile.eyebrow}
              onChange={(eyebrow) => onChange({ ...profile, eyebrow })}
            />
          </div>
          <div>
            <FieldLabel>Tagline</FieldLabel>
            <TextInput
              value={profile.tagline}
              onChange={(tagline) => onChange({ ...profile, tagline })}
            />
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-[14px] font-semibold text-[#2B1B12]">Hero</h3>
          <ImageUploadField
            label="Hero image"
            imageUrl={profile.heroImageUrl}
            uploading={uploadingHero}
            onUpload={(file) => handleUpload(file, "heroImageUrl", setUploadingHero)}
            onUrlChange={(heroImageUrl) => onChange({ ...profile, heroImageUrl })}
          />
        </section>

        <section className="space-y-4">
          <h3 className="text-[14px] font-semibold text-[#2B1B12]">Biography</h3>
          <div>
            <FieldLabel>Section title</FieldLabel>
            <TextInput
              value={profile.biographyTitle}
              onChange={(biographyTitle) => onChange({ ...profile, biographyTitle })}
            />
          </div>
          {[0, 1, 2].map((index) => (
            <div key={index}>
              <FieldLabel>Paragraph {index + 1}</FieldLabel>
              <TextArea
                value={profile.biographyParagraphs[index]}
                onChange={(value) => {
                  const biographyParagraphs = [...profile.biographyParagraphs] as [
                    string,
                    string,
                    string,
                  ]
                  biographyParagraphs[index] = value
                  onChange({ ...profile, biographyParagraphs })
                }}
                rows={4}
              />
            </div>
          ))}
          <div>
            <FieldLabel>Quote</FieldLabel>
            <TextArea
              value={profile.quote}
              onChange={(quote) => onChange({ ...profile, quote })}
              rows={3}
            />
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-[14px] font-semibold text-[#2B1B12]">Credentials</h3>
          {profile.credentials.map((credential, index) => (
            <div key={index} className="grid gap-3 rounded-lg bg-[#FAF7F2]/60 p-4 sm:grid-cols-2">
              <div>
                <FieldLabel>Credential {index + 1} title</FieldLabel>
                <TextInput
                  value={credential.title}
                  onChange={(title) => {
                    const credentials = [...profile.credentials] as ArtisanPageContent["credentials"]
                    credentials[index] = { ...credentials[index], title }
                    onChange({ ...profile, credentials })
                  }}
                />
              </div>
              <div>
                <FieldLabel>Credential {index + 1} description</FieldLabel>
                <TextInput
                  value={credential.description}
                  onChange={(description) => {
                    const credentials = [...profile.credentials] as ArtisanPageContent["credentials"]
                    credentials[index] = { ...credentials[index], description }
                    onChange({ ...profile, credentials })
                  }}
                />
              </div>
            </div>
          ))}
        </section>

        <section className="space-y-4">
          <h3 className="text-[14px] font-semibold text-[#2B1B12]">Video section</h3>
          <ImageUploadField
            label="Video thumbnail"
            imageUrl={profile.videoThumbnailUrl}
            uploading={uploadingVideo}
            onUpload={(file) => handleUpload(file, "videoThumbnailUrl", setUploadingVideo)}
            onUrlChange={(videoThumbnailUrl) => onChange({ ...profile, videoThumbnailUrl })}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel>Video title</FieldLabel>
              <TextInput
                value={profile.videoTitle}
                onChange={(videoTitle) => onChange({ ...profile, videoTitle })}
              />
            </div>
            <div>
              <FieldLabel>Play button label</FieldLabel>
              <TextInput
                value={profile.videoCtaLabel}
                onChange={(videoCtaLabel) => onChange({ ...profile, videoCtaLabel })}
              />
            </div>
          </div>
          <div>
            <FieldLabel>Video subtitle</FieldLabel>
            <TextInput
              value={profile.videoSubtitle}
              onChange={(videoSubtitle) => onChange({ ...profile, videoSubtitle })}
            />
          </div>
          <div>
            <FieldLabel>Video URL</FieldLabel>
            <TextInput
              value={profile.videoUrl}
              onChange={(videoUrl) => onChange({ ...profile, videoUrl })}
              placeholder="https://..."
            />
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-[14px] font-semibold text-[#2B1B12]">Handpicked section</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel>Section title</FieldLabel>
              <TextInput
                value={profile.handpickedTitle}
                onChange={(handpickedTitle) => onChange({ ...profile, handpickedTitle })}
              />
            </div>
            <div>
              <FieldLabel>Section subtitle</FieldLabel>
              <TextInput
                value={profile.handpickedSubtitle}
                onChange={(handpickedSubtitle) => onChange({ ...profile, handpickedSubtitle })}
              />
            </div>
          </div>
        </section>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-[#EDE5D8] p-5">
        <button
          type="button"
          disabled={deleting}
          onClick={onDelete}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#B42318] disabled:opacity-50"
        >
          {deleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
          Delete profile
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={onSave}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#2B1B12] px-5 py-2 text-[13px] font-medium text-white disabled:opacity-50"
        >
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Save profile
        </button>
      </div>
    </div>
  )
}

export function ArtisanProfilesManager() {
  const [profiles, setProfiles] = useState<ArtisanPageContent[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [draft, setDraft] = useState<ArtisanPageContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const publishedCount = profiles.filter((profile) => profile.isPublished).length

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/artisan-profiles")
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to load profiles")
      setProfiles(data.profiles)
      setSelectedId((current) => {
        if (current && data.profiles.some((profile: ArtisanPageContent) => profile.id === current)) {
          return current
        }
        return data.profiles[0]?.id ?? null
      })
      setDraft((current) => {
        if (current && data.profiles.some((profile: ArtisanPageContent) => profile.id === current.id)) {
          return data.profiles.find((profile: ArtisanPageContent) => profile.id === current.id) ?? current
        }
        return data.profiles[0] ?? null
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profiles")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    if (!selectedId) return
    const profile = profiles.find((item) => item.id === selectedId)
    if (profile) setDraft(profile)
  }, [selectedId, profiles])

  function selectProfile(profile: ArtisanPageContent) {
    setSelectedId(profile.id)
    setDraft(profile)
    setSaved(false)
  }

  async function handleCreate() {
    setCreating(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/artisan-profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "New Artisan" }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to create profile")
      setProfiles((prev) => [...prev, data.profile])
      selectProfile(data.profile)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create profile")
    } finally {
      setCreating(false)
    }
  }

  async function handleSave() {
    if (!draft) return
    setSaving(true)
    setError(null)
    setSaved(false)
    try {
      const res = await fetch(`/api/admin/artisan-profiles/${draft.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to save profile")
      setProfiles((prev) => prev.map((item) => (item.id === data.profile.id ? data.profile : item)))
      setDraft(data.profile)
      setSaved(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!draft) return
    if (!window.confirm(`Delete profile for ${draft.name}?`)) return

    setDeleting(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/artisan-profiles/${draft.id}`, {
        method: "DELETE",
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to delete profile")

      const nextProfiles = profiles.filter((item) => item.id !== draft.id)
      setProfiles(nextProfiles)
      setSelectedId(nextProfiles[0]?.id ?? null)
      setDraft(nextProfiles[0] ?? null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete profile")
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-6 animate-spin text-[#9A8070]" />
      </div>
    )
  }

  return (
    <div className="flex min-h-[640px] overflow-hidden rounded-xl border border-[#EDE5D8] bg-white shadow-sm">
      <div className="flex min-w-0 flex-1 flex-col border-r border-[#EDE5D8]">
        <div className="border-b border-[#EDE5D8] p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-serif text-[20px] font-semibold text-[#2B1B12]">
                Artisan Profiles
              </h2>
              <p className="mt-1 text-[13px] text-[#9A8070]">
                Add up to {MAX_ARTISAN_PROFILES} profiles. Published artisans shuffle when
                customers visit{" "}
                <Link href="/artisans" target="_blank" className="underline">
                  /artisans
                </Link>
                . Match the profile name to each product&apos;s artisan field so the barcode
                opens the right maker.
              </p>
            </div>
            <button
              type="button"
              disabled={creating || profiles.length >= MAX_ARTISAN_PROFILES}
              onClick={() => void handleCreate()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#2B1B12] px-4 py-2 text-[12px] font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {creating ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
              Add artisan
            </button>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-[#FAF7F2] px-4 py-3">
              <p className="text-[11px] text-[#9A8070]">Total profiles</p>
              <p className="text-[22px] font-semibold text-[#2B1B12]">
                {profiles.length}/{MAX_ARTISAN_PROFILES}
              </p>
            </div>
            <div className="rounded-lg bg-[#FAF7F2] px-4 py-3">
              <p className="text-[11px] text-[#9A8070]">Published</p>
              <p className="text-[22px] font-semibold text-[#2B1B12]">{publishedCount}</p>
            </div>
            <div className="rounded-lg bg-[#FAF7F2] px-4 py-3">
              <p className="text-[11px] text-[#9A8070]">Shuffle pool</p>
              <p className="text-[22px] font-semibold text-[#2B1B12]">
                {publishedCount > 0 ? "Active" : "Empty"}
              </p>
            </div>
          </div>
        </div>

        {error ? (
          <div className="mx-5 mt-5 rounded-lg border border-[#F5C2C0] bg-[#FEF2F2] px-4 py-3 text-[13px] text-[#B42318]">
            {error}
          </div>
        ) : null}

        {saved ? (
          <div className="mx-5 mt-5 rounded-lg border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3 text-[13px] text-[#166534]">
            Artisan profile saved.
          </div>
        ) : null}

        <div className="grid flex-1 gap-4 overflow-y-auto p-5 sm:grid-cols-2 xl:grid-cols-3">
          {profiles.length === 0 ? (
            <div className="col-span-full flex min-h-[240px] flex-col items-center justify-center rounded-xl border border-dashed border-[#D8CFC4] bg-[#FAF7F2]/50 text-center">
              <p className="font-serif text-[18px] text-[#3D2E24]">No artisan profiles yet</p>
              <p className="mt-2 max-w-sm text-[13px] text-[#9A8070]">
                Add your first artisan to start the shuffle experience on the storefront.
              </p>
            </div>
          ) : (
            profiles.map((profile) => {
              const selected = profile.id === selectedId
              return (
                <button
                  key={profile.id}
                  type="button"
                  onClick={() => selectProfile(profile)}
                  className={`rounded-xl border p-4 text-left transition-colors ${
                    selected
                      ? "border-[#2B1B12] bg-[#FAF7F2]"
                      : "border-[#EDE5D8] bg-white hover:border-[#C4A882]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                        profile.isPublished
                          ? "bg-[#E6F4EA] text-[#1E7E34]"
                          : "bg-[#F5EDE3] text-[#9A8070]"
                      }`}
                    >
                      {profile.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                  <div className="relative mx-auto mt-4 aspect-[4/3] max-w-[180px] overflow-hidden rounded-t-[999px] rounded-b-md bg-[#EDE8DC]">
                    {profile.heroImageUrl ? (
                      <Image
                        src={profile.heroImageUrl}
                        alt={profile.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : null}
                  </div>
                  <h3 className="mt-4 text-center font-serif text-[17px] text-[#2B1B12]">
                    {profile.name}
                  </h3>
                  <p className="mt-1 text-center text-[12px] text-[#9A8070]">{profile.eyebrow}</p>
                </button>
              )
            })
          )}
        </div>
      </div>

      {draft ? (
        <div className="flex w-[420px] shrink-0 flex-col bg-white">
          <ArtisanProfileEditor
            profile={draft}
            onChange={setDraft}
            onSave={() => void handleSave()}
            onDelete={() => void handleDelete()}
            saving={saving}
            deleting={deleting}
          />
        </div>
      ) : (
        <div className="flex w-[420px] shrink-0 items-center justify-center bg-[#FAF7F2] p-8 text-center text-[13px] text-[#9A8070]">
          Select a profile to edit, or add a new artisan.
        </div>
      )}
    </div>
  )
}
