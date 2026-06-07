"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ImageIcon, Loader2, Upload } from "lucide-react"

import type { CategoryCard, CategoryCardKey } from "@/lib/category-cards-shared"
import { CATEGORY_CARD_LABELS } from "@/lib/category-cards-shared"

type CategoryCardsManagerProps = {
  compact?: boolean
}

export function CategoryCardsManager({ compact = false }: CategoryCardsManagerProps) {
  const [cards, setCards] = useState<CategoryCard[]>([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<CategoryCardKey | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileRefs = useRef<Partial<Record<CategoryCardKey, HTMLInputElement | null>>>({})

  const loadCards = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/category-cards")
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to load category cards")
      setCards(data.cards ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load category cards")
    } finally {
      setLoading(false)
    }
  }, [])

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

  return (
    <div className={compact ? "space-y-4" : "space-y-5"}>
      <div>
        <h2 className={`font-serif font-semibold text-[#2D1E17] ${compact ? "text-[20px]" : "text-[22px]"}`}>
          Homepage Category Photos
        </h2>
        <p className="mt-1 text-[13px] text-[#9A8070]">
          Update the four category images shown in &ldquo;A Heritage of Four Worlds&rdquo; on the homepage.
        </p>
      </div>

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
            const isSaving = savingId === card.id
            return (
              <article
                key={card.id}
                className="overflow-hidden rounded-xl border border-[#EDE5D8] bg-white shadow-sm"
              >
                <div className="relative aspect-[458/178] bg-[#FAF7F2]">
                  <Image
                    src={card.imageUrl}
                    alt={card.title}
                    fill
                    className="object-cover object-center"
                  />
                </div>
                <div className="space-y-3 p-4">
                  <div>
                    <p className="text-[13px] font-semibold text-[#2D1E17]">
                      {CATEGORY_CARD_LABELS[card.id]}
                    </p>
                    <p className="mt-0.5 text-[11px] text-[#9A8070]">{card.href}</p>
                  </div>

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
                    disabled={isSaving}
                    onClick={() => fileRefs.current[card.id]?.click()}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#EDE5D8] px-3 py-2.5 text-[12px] font-medium text-[#6B5344] hover:bg-[#FAF7F2] disabled:opacity-50"
                  >
                    {isSaving ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Upload className="size-4" />
                    )}
                    {isSaving ? "Uploading…" : "Replace Photo"}
                  </button>
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
