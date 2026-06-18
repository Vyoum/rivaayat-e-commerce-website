"use client"

import Link from "next/link"

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
  href: string
  artisanName?: string
  className?: string
  backgroundColor?: string
  foregroundColor?: string
}

export function ProductBarcodeButton({
  productId,
  href,
  artisanName,
  className,
  backgroundColor = "#FDF9F3",
  foregroundColor = "#000000",
}: ProductBarcodeButtonProps) {
  const bars = getBarcodeBars(productId)

  return (
    <Link
      href={href}
      onClick={(event) => event.stopPropagation()}
      aria-label={
        artisanName ? `View ${artisanName}'s artisan profile` : "View artisan profile"
      }
      className={cn(
        "inline-flex items-end gap-[2px] rounded-sm border px-1 py-0.5 opacity-[0.55] shadow-[0_1px_4px_rgba(61,46,36,0.08)] transition-opacity hover:border-[#846246]/40 hover:bg-white hover:opacity-90 focus-visible:opacity-100 focus-visible:outline-none",
        className,
      )}
      style={{
        backgroundColor: `${backgroundColor}f2`,
        borderColor: `${foregroundColor}26`,
      }}
    >
      {bars.map((width, index) => (
        <span
          key={index}
          className="block rounded-[0.5px]"
          style={{
            width: `${width}px`,
            height: "24px",
            backgroundColor: `${foregroundColor}b3`,
          }}
        />
      ))}
    </Link>
  )
}
