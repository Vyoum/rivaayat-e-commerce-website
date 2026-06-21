"use client"

import { cn } from "@/lib/utils"

export type ProductPricedOption = {
  label: string
  price?: number | null
}

type ProductOptionSelectorProps = {
  label: string
  options: string[] | ProductPricedOption[]
  value: string | null
  onChange: (value: string) => void
  helperText?: string
}

function normalizeOptions(options: string[] | ProductPricedOption[]): ProductPricedOption[] {
  return options.map((option) =>
    typeof option === "string" ? { label: option, price: null } : option,
  )
}

export function ProductOptionSelector({
  label,
  options,
  value,
  onChange,
  helperText,
}: ProductOptionSelectorProps) {
  const normalized = normalizeOptions(options)

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
        {normalized.map((option) => {
          const isSelected = value === option.label
          return (
            <button
              key={option.label}
              type="button"
              onClick={() => onChange(option.label)}
              aria-pressed={isSelected}
              className={cn(
                "min-w-[52px] rounded-lg border px-4 py-2.5 font-sans text-[13px] font-medium transition-colors",
                isSelected
                  ? "border-[#846246] bg-[#846246] text-white"
                  : "border-[#D9CFC0] bg-white text-[#3D2E24] hover:border-[#846246]",
              )}
            >
              <span>{option.label}</span>
              {typeof option.price === "number" && option.price > 0 ? (
                <span className={cn("ml-1.5", isSelected ? "text-white/85" : "text-[#9A8070]")}>
                  ₹{option.price.toLocaleString("en-IN")}
                </span>
              ) : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}
