"use client"

import { Minus, Plus } from "lucide-react"

import { cn } from "@/lib/utils"

type ProductUnitsStepperProps = {
  label: string
  helperText?: string
  quantity: number
  onChange: (quantity: number) => void
  min?: number
  max?: number
  unitSingular?: string
  unitPlural?: string
  className?: string
}

export function ProductUnitsStepper({
  label,
  helperText,
  quantity,
  onChange,
  min = 1,
  max = 99,
  unitSingular = "item",
  unitPlural = "items",
  className,
}: ProductUnitsStepperProps) {
  const unitLabel = quantity === 1 ? unitSingular : unitPlural

  return (
    <div
      className={cn(
        "rounded-2xl border border-[#E8E0D4] bg-[#FDF9F3] px-5 py-4",
        className,
      )}
    >
      <div>
        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-[#3D2E24]">
          {label}
        </p>
        {helperText ? (
          <p className="mt-1 font-sans text-[11px] leading-relaxed text-[#9A8070]">{helperText}</p>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center rounded-sm border border-[#D9CFC0] bg-white">
          <button
            type="button"
            onClick={() => onChange(Math.max(min, quantity - 1))}
            disabled={quantity <= min}
            className="flex size-10 items-center justify-center text-[#6B5344] transition-colors hover:bg-[#EDE8DC] disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={`Decrease ${unitPlural}`}
          >
            <Minus className="size-4" />
          </button>
          <span className="flex w-10 items-center justify-center font-sans text-[14px] text-[#3D2E24]">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => onChange(Math.min(max, quantity + 1))}
            disabled={quantity >= max}
            className="flex size-10 items-center justify-center text-[#6B5344] transition-colors hover:bg-[#EDE8DC] disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={`Increase ${unitPlural}`}
          >
            <Plus className="size-4" />
          </button>
        </div>
        <p className="font-sans text-[13px] text-[#6B5344]">
          {quantity} {unitLabel}
        </p>
      </div>
    </div>
  )
}
