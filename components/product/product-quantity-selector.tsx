"use client"

import { DEFAULT_FOOD_QUANTITY_OPTIONS } from "@/lib/food-quantity-options"

import { ProductOptionSelector } from "@/components/product/product-option-selector"

type ProductQuantitySelectorProps = {
  quantities?: string[]
  value: string | null
  onChange: (quantity: string) => void
}

export function ProductQuantitySelector({
  quantities = [...DEFAULT_FOOD_QUANTITY_OPTIONS],
  value,
  onChange,
}: ProductQuantitySelectorProps) {
  return (
    <ProductOptionSelector
      label="Select Pack Size"
      helperText="Choose the weight or size of one box or pack."
      options={quantities}
      value={value}
      onChange={onChange}
    />
  )
}
