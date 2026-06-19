"use client"

import { useRef, useState } from "react"
import { Loader2, Trash2, Upload } from "lucide-react"
import { toast } from "sonner"

import {
  MAX_COLOR_GALLERY_IMAGES,
  type ProductColorImages,
} from "@/lib/textile-color-images"
import { getTextileColorSwatch } from "@/lib/textile-color-options"
import { cn } from "@/lib/utils"

type ProductColorImagesManagerProps = {
  colors: string[]
  colorImages: ProductColorImages
  onChange: (next: ProductColorImages) => void
  onUpload: (file: File) => Promise<string>
}

export function ProductColorImagesManager({
  colors,
  colorImages,
  onChange,
  onUpload,
}: ProductColorImagesManagerProps) {
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({})
  const [uploadingColor, setUploadingColor] = useState<string | null>(null)

  if (colors.length === 0) return null

  async function handleUpload(color: string, file: File) {
    const current = colorImages[color] ?? []
    if (current.length >= MAX_COLOR_GALLERY_IMAGES) {
      toast.error(`Maximum ${MAX_COLOR_GALLERY_IMAGES} images per colour`)
      return
    }

    setUploadingColor(color)
    try {
      const imageUrl = await onUpload(file)
      onChange({
        ...colorImages,
        [color]: [...current, imageUrl],
      })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed")
    } finally {
      setUploadingColor(null)
    }
  }

  function removeImage(color: string, index: number) {
    const current = colorImages[color] ?? []
    const next = current.filter((_, i) => i !== index)
    const updated = { ...colorImages }
    if (next.length === 0) {
      delete updated[color]
    } else {
      updated[color] = next
    }
    onChange(updated)
  }

  function moveImagePrimary(color: string, index: number) {
    const current = colorImages[color] ?? []
    if (index <= 0) return
    const next = [...current]
    const [item] = next.splice(index, 1)
    next.unshift(item)
    onChange({ ...colorImages, [color]: next })
  }

  return (
    <section className="rounded-xl border border-[#EDE5D8] bg-white p-5">
      <div className="mb-4">
        <h2 className="text-[14px] font-semibold text-[#2B1B12]">Colour Gallery Images</h2>
        <p className="mt-1 text-[11px] leading-relaxed text-[#9A8070]">
          Upload photos for each colour. Shoppers see these when they pick a colour on the product
          page. Up to {MAX_COLOR_GALLERY_IMAGES} images per colour. If none are set, the main
          product gallery is used.
        </p>
      </div>

      <div className="space-y-5">
        {colors.map((color) => {
          const images = colorImages[color] ?? []
          const swatch = getTextileColorSwatch(color)
          const isUploading = uploadingColor === color

          return (
            <div key={color} className="rounded-lg border border-[#F5EDE3] bg-[#FAF7F2] p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className="size-5 rounded-full border border-black/10"
                    style={{ backgroundColor: swatch }}
                  />
                  <p className="text-[13px] font-medium text-[#2B1B12]">{color}</p>
                </div>
                <span className="text-[11px] text-[#9A8070]">
                  {images.length}/{MAX_COLOR_GALLERY_IMAGES}
                </span>
              </div>

              <input
                ref={(node) => {
                  fileRefs.current[color] = node
                }}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (file) void handleUpload(color, file)
                  event.target.value = ""
                }}
              />

              <div className="flex flex-wrap gap-2">
                {images.map((url, index) => (
                  <div key={url} className="relative overflow-hidden rounded-lg">
                    <img src={url} alt="" className="size-20 object-cover" />
                    {index === 0 ? (
                      <span className="absolute bottom-1 left-1 rounded bg-[#2B1B12] px-1.5 py-0.5 text-[9px] font-bold text-white">
                        PRIMARY
                      </span>
                    ) : null}
                    <div className="absolute top-1 right-1 flex gap-1">
                      {index > 0 ? (
                        <button
                          type="button"
                          onClick={() => moveImagePrimary(color, index)}
                          className="rounded bg-white/90 px-1.5 py-0.5 text-[9px] font-medium"
                        >
                          Primary
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => removeImage(color, index)}
                        className="rounded bg-white/90 p-1 text-[#C5221F]"
                        aria-label={`Remove ${color} image ${index + 1}`}
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  disabled={isUploading || images.length >= MAX_COLOR_GALLERY_IMAGES}
                  onClick={() => fileRefs.current[color]?.click()}
                  className={cn(
                    "flex size-20 flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#D4C4A8] text-[#9A8070] transition-colors hover:border-[#C4A882] disabled:opacity-50",
                  )}
                >
                  {isUploading ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <Upload className="size-5" />
                  )}
                  <span className="mt-1 text-[9px]">Add</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
