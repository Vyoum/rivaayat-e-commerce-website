"use client"

import { cn } from "@/lib/utils"

/** Decorative barcode bars — deterministic pattern from product id */
function getBarcodeBars(productId: string, count = 11) {
  let seed = 0
  for (let i = 0; i < productId.length; i++) {
    seed = (seed + productId.charCodeAt(i) * (i + 1)) % 997
  }

  return Array.from({ length: count }, (_, index) => {
    seed = (seed * 31 + index + 7) % 100
    if (seed % 3 === 0) return 3
    if (seed % 2 === 0) return 2.25
    return 1.5
  })
}

type ProductBarcodeButtonProps = {
  productId: string
  isActive?: boolean
  onClick: () => void
  className?: string
}

export function ProductBarcodeButton({
  productId,
  isActive = false,
  onClick,
  className,
}: ProductBarcodeButtonProps) {
  const bars = getBarcodeBars(productId)

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        onClick()
      }}
      aria-label={isActive ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={isActive}
      className={cn(
        "inline-flex items-end gap-[2px] border-0 bg-transparent p-0 opacity-[0.42] transition-opacity hover:opacity-80 focus-visible:opacity-100 focus-visible:outline-none",
        isActive && "opacity-70 hover:opacity-90",
        className,
      )}
    >
      {bars.map((width, index) => (
        <span
          key={index}
          className={cn(
            "block rounded-[0.5px] bg-black/70",
            isActive && "bg-[#B85A32]/85",
          )}
          style={{
            width: `${width}px`,
            height: "24px",
          }}
        />
      ))}
    </button>
  )
}
