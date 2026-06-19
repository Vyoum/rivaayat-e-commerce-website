"use client"

import {
  DEFAULT_TEXTILE_COLOR_OPTIONS,
  getTextileColorSwatch,
} from "@/lib/textile-color-options"
import { cn } from "@/lib/utils"

type ProductColorSelectorProps = {
  colors?: string[]
  value: string | null
  onChange: (color: string) => void
}

export function ProductColorSelector({
  colors = [...DEFAULT_TEXTILE_COLOR_OPTIONS],
  value,
  onChange,
}: ProductColorSelectorProps) {
  return (
    <div className="mt-6 rounded-2xl border border-[#E8E0D4] bg-[#FDF9F3] px-5 py-4">
      <div>
        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-[#3D2E24]">
          Select Colour
        </p>
        <p className="mt-1 font-sans text-[11px] leading-relaxed text-[#9A8070]">
          Choose the shade or colourway for this piece.
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        {colors.map((color) => {
          const isSelected = value?.toLowerCase() === color.toLowerCase()
          const swatch = getTextileColorSwatch(color)
          const isLight =
            color.toLowerCase() === "cream" ||
            color.toLowerCase() === "natural" ||
            color.toLowerCase() === "white"

          return (
            <button
              key={color}
              type="button"
              onClick={() => onChange(color)}
              aria-pressed={isSelected}
              aria-label={`Colour ${color}`}
              title={color}
              className={cn(
                "group flex flex-col items-center gap-2 rounded-xl border px-3 py-2.5 transition-colors",
                isSelected
                  ? "border-[#846246] bg-white"
                  : "border-transparent bg-transparent hover:border-[#D9CFC0] hover:bg-white/80",
              )}
            >
              <span
                className={cn(
                  "size-9 rounded-full border shadow-sm transition-transform group-hover:scale-105",
                  isSelected ? "ring-2 ring-[#846246] ring-offset-2" : "border-[#D9CFC0]",
                  isLight && "border-[#C4B5A5]",
                )}
                style={{ backgroundColor: swatch }}
              />
              <span className="font-sans text-[11px] font-medium text-[#6B5344]">{color}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
