"use client"

import {
  FOOD_BOX_SIZES,
  type FoodBoxSize,
} from "@/lib/food-quantity-prices"

export type FoodBoxSizePriceDraft = {
  label: FoodBoxSize
  price: string
}

type FoodBoxSizePricingEditorProps = {
  options: FoodBoxSizePriceDraft[]
  onChange: (next: FoodBoxSizePriceDraft[]) => void
}

export function createFoodBoxSizePriceDrafts(
  prices?: Partial<Record<FoodBoxSize, number>>,
): FoodBoxSizePriceDraft[] {
  return FOOD_BOX_SIZES.map((label) => ({
    label,
    price:
      typeof prices?.[label] === "number" && prices[label]! > 0
        ? String(prices[label])
        : "",
  }))
}

export function FoodBoxSizePricingEditor({
  options,
  onChange,
}: FoodBoxSizePricingEditorProps) {
  const rows =
    options.length > 0
      ? options
      : createFoodBoxSizePriceDrafts()

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-[120px_1fr] gap-2 px-0.5">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-[#9A8070]">
          Box size
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-[#9A8070]">
          Price (₹)
        </span>
      </div>

      {rows.map((option) => (
        <div key={option.label} className="grid grid-cols-[120px_1fr] gap-2">
          <div className="flex h-9 items-center rounded-lg border border-[#EDE5D8] bg-[#FAF7F2] px-3 font-sans text-[12px] font-medium text-[#2D1E17]">
            {option.label}
          </div>
          <div className="relative">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 font-sans text-[12px] text-[#9A8070]">
              ₹
            </span>
            <input
              value={option.price}
              onChange={(event) =>
                onChange(
                  rows.map((entry) =>
                    entry.label === option.label
                      ? { ...entry, price: event.target.value.replace(/[^\d]/g, "") }
                      : entry,
                  ),
                )
              }
              inputMode="numeric"
              placeholder="0"
              aria-label={`Price for ${option.label} box`}
              className="h-9 w-full rounded-lg border border-[#EDE5D8] bg-white pr-3 pl-7 font-sans text-[12px] text-[#2D1E17] outline-none focus:border-[#C4A882]"
            />
          </div>
        </div>
      ))}

      <p className="text-[10px] leading-relaxed text-[#B5A090]">
        Set the price for each box size. Leave blank for sizes you do not offer. At least one box
        size must have a price. Customers see these options on the product page.
      </p>
    </div>
  )
}
