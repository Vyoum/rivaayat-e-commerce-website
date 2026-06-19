"use client"

import { cn } from "@/lib/utils"

type ProductOptionSelectorProps = {
  label: string
  options: string[]
  value: string | null
  onChange: (value: string) => void
  helperText?: string
}

export function ProductOptionSelector({
  label,
  options,
  value,
  onChange,
  helperText,
}: ProductOptionSelectorProps) {
  return (
    <div className="mt-6 rounded-2xl border border-[#E8E0D4] bg-[#FDF9F3] px-5 py-4">
      <div>
        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-[#3D2E24]">
          {label}
        </p>
        {helperText ? (
          <p className="mt-1 font-sans text-[11px] leading-relaxed text-[#9A8070]">{helperText}</p>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = value === option
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              aria-pressed={isSelected}
              className={cn(
                "min-w-[52px] rounded-lg border px-4 py-2.5 font-sans text-[13px] font-medium transition-colors",
                isSelected
                  ? "border-[#846246] bg-[#846246] text-white"
                  : "border-[#D9CFC0] bg-white text-[#3D2E24] hover:border-[#846246]",
              )}
            >
              {option}
            </button>
          )
        })}
      </div>
    </div>
  )
}
