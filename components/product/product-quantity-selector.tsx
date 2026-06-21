"use client"

import { DEFAULT_FOOD_QUANTITY_OPTIONS } from "@/lib/food-quantity-options"
import type { FoodQuantityPrices } from "@/lib/food-quantity-prices"
import { getFoodBoxPrice } from "@/lib/food-quantity-prices"

import { ProductOptionSelector } from "@/components/product/product-option-selector"

type ProductQuantitySelectorProps = {
  quantities?: string[]
  quantityPrices?: FoodQuantityPrices
  value: string | null
  onChange: (quantity: string) => void
}

export function ProductQuantitySelector({
  quantities = [...DEFAULT_FOOD_QUANTITY_OPTIONS],
  quantityPrices = {},
  value,
  onChange,
}: ProductQuantitySelectorProps) {
  const options = quantities.map((label) => ({
    label,
    price: getFoodBoxPrice(quantityPrices, label),
  }))

  return (
    <ProductOptionSelector
      label="Select Pack Size"
      helperText="Choose the weight or size of one box or pack."
      options={options}
      value={value}
      onChange={onChange}
    />
  )
}
