"use client"

import { TEXTILE_SIZE_OPTIONS } from "@/lib/clothing-size-guide"

import { ProductOptionSelector } from "@/components/product/product-option-selector"

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
    <ProductOptionSelector
      label="Select Size"
      options={sizes}
      value={value}
      onChange={onChange}
    />
  )
}
