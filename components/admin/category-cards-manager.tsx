"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ImageIcon, Loader2, Upload } from "lucide-react"

import type { CategoryCard, CategoryCardKey } from "@/lib/category-cards-shared"
import { DEFAULT_CATEGORY_SECTION_HEADING } from "@/lib/category-cards-shared"

type CategoryCardsManagerProps = {
  compact?: boolean
}

type CardDraft = {
  title: string
  description: string
}

export function CategoryCardsManager({ compact = false }: CategoryCardsManagerProps) {
  const [cards, setCards] = useState<CategoryCard[]>([])
  const [sectionHeading, setSectionHeading] = useState(DEFAULT_CATEGORY_SECTION_HEADING)
  const [sectionHeadingDraft, setSectionHeadingDraft] = useState(DEFAULT_CATEGORY_SECTION_HEADING)
  const [drafts, setDrafts] = useState<Partial<Record<CategoryCardKey, CardDraft>>>({})
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<CategoryCardKey | null>(null)
  const [savingTextId, setSavingTextId] = useState<CategoryCardKey | null>(null)
  const [savingSectionHeading, setSavingSectionHeading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRefs = useRef<Partial<Record<CategoryCardKey, HTMLInputElement | null>>>({})

  const syncDrafts = useCallback((nextCards: CategoryCard[]) => {
    setDrafts(
      Object.fromEntries(
        nextCards.map((card) => [
          card.id,
          { title: card.title, description: card.description },
        ]),
      ) as Partial<Record<CategoryCardKey, CardDraft>>,
    )
  }, [])

  const loadCards = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/category-cards")
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to load category cards")
      const nextCards = data.cards ?? []
      const nextHeading = data.sectionHeading ?? DEFAULT_CATEGORY_SECTION_HEADING
      setCards(nextCards)
      setSectionHeading(nextHeading)
      setSectionHeadingDraft(nextHeading)
      syncDrafts(nextCards)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load category cards")
    } finally {
      setLoading(false)
    }
  }, [syncDrafts])

  useEffect(() => {
    loadCards()
  }, [loadCards])

  async function handleUpload(id: CategoryCardKey, file: File) {
    setSavingId(id)
    setError(null)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const uploadRes = await fetch("/api/admin/category-cards/upload", {
        method: "POST",
        body: formData,
      })
      const uploadData = await uploadRes.json()
      if (!uploadRes.ok) throw new Error(uploadData.error || "Upload failed")

      const saveRes = await fetch("/api/admin/category-cards", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, imageUrl: uploadData.imageUrl }),
      })
      const saveData = await saveRes.json()
      if (!saveRes.ok) throw new Error(saveData.error || "Failed to save category image")

      setCards((prev) => prev.map((card) => (card.id === id ? saveData.card : card)))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setSavingId(null)
    }
  }

  async function handleSaveText(id: CategoryCardKey) {
    const draft = drafts[id]
    if (!draft) return

    setSavingTextId(id)
    setError(null)

    try {
      const saveRes = await fetch("/api/admin/category-cards", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          title: draft.title,
          description: draft.description,
        }),
      })
      const saveData = await saveRes.json()
      if (!saveRes.ok) throw new Error(saveData.error || "Failed to save category details")

      setCards((prev) => prev.map((card) => (card.id === id ? saveData.card : card)))
      syncDrafts([saveData.card])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save category details")
    } finally {
      setSavingTextId(null)
    }
  }

  function hasUnsavedChanges(card: CategoryCard) {
    const draft = drafts[card.id]
    if (!draft) return false
    return draft.title !== card.title || draft.description !== card.description
  }

  async function handleSaveSectionHeading() {
    setSavingSectionHeading(true)
    setError(null)

    try {
      const saveRes = await fetch("/api/admin/category-cards", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionHeading: sectionHeadingDraft }),
      })
      const saveData = await saveRes.json()
      if (!saveRes.ok) throw new Error(saveData.error || "Failed to save section heading")

      const nextHeading = saveData.sectionHeading ?? sectionHeadingDraft.trim()
      setSectionHeading(nextHeading)
      setSectionHeadingDraft(nextHeading)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save section heading")
    } finally {
      setSavingSectionHeading(false)
    }
  }

  const sectionHeadingDirty = sectionHeadingDraft.trim() !== sectionHeading

  return (
    <div className={compact ? "space-y-4" : "space-y-5"}>
      <div>
        <h2 className={`font-serif font-semibold text-[#2D1E17] ${compact ? "text-[20px]" : "text-[22px]"}`}>
          Homepage Categories
        </h2>
        <p className="mt-1 text-[13px] text-[#9A8070]">
          Update the section heading, category names, taglines, and photos on the homepage and collection pages.
        </p>
      </div>

      {!loading ? (
        <div className="rounded-xl border border-[#EDE5D8] bg-white p-4 shadow-sm">
          <label className="block">
            <span className="text-[11px] font-medium tracking-wide text-[#9A8070] uppercase">
              Section heading
            </span>
            <input
              value={sectionHeadingDraft}
              onChange={(event) => setSectionHeadingDraft(event.target.value)}
              maxLength={80}
              placeholder={DEFAULT_CATEGORY_SECTION_HEADING}
              className="mt-1 h-10 w-full rounded-lg border border-[#EDE5D8] px-3 font-serif text-[15px] text-[#2D1E17] outline-none focus:border-[#C4A882]"
            />
          </label>
          <p className="mt-1 text-[10px] text-[#C4B5A5]">
            {sectionHeadingDraft.length}/80 characters
          </p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-serif text-[18px] text-[#2D1E17]">
              {sectionHeadingDraft.trim() || DEFAULT_CATEGORY_SECTION_HEADING}
            </p>
            <button
              type="button"
              disabled={savingSectionHeading || !sectionHeadingDirty || !sectionHeadingDraft.trim()}
              onClick={() => void handleSaveSectionHeading()}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2B1B12] px-4 py-2.5 text-[12px] font-medium text-white hover:bg-[#3D2B21] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {savingSectionHeading ? <Loader2 className="size-4 animate-spin" /> : null}
              {savingSectionHeading ? "Saving…" : sectionHeadingDirty ? "Save Heading" : "Saved"}
            </button>
          </div>
        </div>
      ) : null}

      {error && (
        <div className="rounded-lg border border-[#F5C2C0] bg-[#FEF2F2] px-4 py-3 text-[13px] text-[#B42318]">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16 text-[#9A8070]">
          <Loader2 className="size-6 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {cards.map((card) => {
            const draft = drafts[card.id] ?? { title: card.title, description: card.description }
            const isUploading = savingId === card.id
            const isSavingText = savingTextId === card.id
            const dirty = hasUnsavedChanges(card)

            return (
              <article
                key={card.id}
                className="overflow-hidden rounded-xl border border-[#EDE5D8] bg-white shadow-sm"
              >
                <div className="relative aspect-[458/178] bg-[#FAF7F2]">
                  <Image
                    src={card.imageUrl}
                    alt={draft.title}
                    fill
                    className="object-cover object-center"
                  />
                </div>

                <div className="space-y-4 p-4">
                  <div>
                    <p className="text-[11px] font-medium tracking-wide text-[#9A8070] uppercase">
                      Route
                    </p>
                    <p className="mt-0.5 font-mono text-[11px] text-[#C4B5A5]">{card.href}</p>
                  </div>

                  <label className="block">
                    <span className="text-[11px] font-medium tracking-wide text-[#9A8070] uppercase">
                      Category name
                    </span>
                    <input
                      value={draft.title}
                      onChange={(event) =>
                        setDrafts((prev) => ({
                          ...prev,
                          [card.id]: { ...draft, title: event.target.value },
                        }))
                      }
                      maxLength={60}
                      placeholder="Jewellery"
                      className="mt-1 h-10 w-full rounded-lg border border-[#EDE5D8] px-3 font-serif text-[14px] text-[#2D1E17] outline-none focus:border-[#C4A882]"
                    />
                  </label>

                  <label className="block">
                    <span className="text-[11px] font-medium tracking-wide text-[#9A8070] uppercase">
                      Tagline
                    </span>
                    <textarea
                      value={draft.description}
                      onChange={(event) =>
                        setDrafts((prev) => ({
                          ...prev,
                          [card.id]: { ...draft, description: event.target.value },
                        }))
                      }
                      rows={2}
                      maxLength={120}
                      placeholder="Softness. Tradition. Woven with Purpose."
                      className="mt-1 w-full resize-y rounded-lg border border-[#EDE5D8] px-3 py-2 font-serif text-[13px] leading-relaxed text-[#2D1E17] outline-none focus:border-[#C4A882]"
                    />
                    <p className="mt-1 text-[10px] text-[#C4B5A5]">
                      {draft.description.length}/120 characters
                    </p>
                  </label>

                  <div className="rounded-lg border border-[#F5EDE3] bg-[#FAF7F2] px-3 py-3 text-center">
                    <p className="font-serif text-[16px] text-[#2D1E17]">{draft.title || "Category name"}</p>
                    <p className="mt-1 font-serif text-[12px] italic text-[#7D5A44]">
                      {draft.description || "Tagline preview"}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      disabled={isSavingText || !dirty}
                      onClick={() => void handleSaveText(card.id)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#2B1B12] px-3 py-2.5 text-[12px] font-medium text-white hover:bg-[#3D2B21] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isSavingText ? <Loader2 className="size-4 animate-spin" /> : null}
                      {isSavingText ? "Saving…" : dirty ? "Save Name & Tagline" : "Saved"}
                    </button>

                    <input
                      ref={(el) => {
                        fileRefs.current[card.id] = el
                      }}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleUpload(card.id, file)
                        e.target.value = ""
                      }}
                    />

                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={() => fileRefs.current[card.id]?.click()}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#EDE5D8] px-3 py-2.5 text-[12px] font-medium text-[#6B5344] hover:bg-[#FAF7F2] disabled:opacity-50"
                    >
                      {isUploading ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Upload className="size-4" />
                      )}
                      {isUploading ? "Uploading…" : "Replace Photo"}
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {!loading && cards.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <ImageIcon className="size-10 text-[#D4C4A8]" />
          <p className="mt-3 text-[13px] text-[#9A8070]">No category cards found.</p>
        </div>
      )}
    </div>
  )
}
