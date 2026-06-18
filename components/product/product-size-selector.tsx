"use client"

import { TEXTILE_SIZE_OPTIONS } from "@/lib/clothing-size-guide"
import { cn } from "@/lib/utils"

type ProductSizeSelectorProps = {
  sizes?: string[]
  value: string | null
  onChange: (size: string) => void
}

export function ProductSizeSelector({
  sizes = TEXTILE_SIZE_OPTIONS,
  value,
  onChange,
}: ProductSizeSelectorProps) {
  return (
    <div className="mt-6 rounded-2xl border border-[#E8E0D4] bg-[#FDF9F3] px-5 py-4">
      <div className="flex items-center justify-between gap-3">
        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-[#3D2E24]">
          Select Size
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {sizes.map((size) => {
          const isSelected = value === size
          return (
            <button
              key={size}
              type="button"
              onClick={() => onChange(size)}
              aria-pressed={isSelected}
              className={cn(
                "min-w-[52px] rounded-lg border px-4 py-2.5 font-sans text-[13px] font-medium transition-colors",
                isSelected
                  ? "border-[#846246] bg-[#846246] text-white"
                  : "border-[#D9CFC0] bg-white text-[#3D2E24] hover:border-[#846246]",
              )}
            >
              {size}
            </button>
          )
        })}
      </div>
    </div>
  )
}
