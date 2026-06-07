"use client"

import Link from "next/link"
import { ShoppingBag } from "lucide-react"

import { useCart } from "@/components/providers/cart-provider"
import { cn } from "@/lib/utils"

type CartIconLinkProps = {
  className?: string
  iconClassName?: string
  badgeClassName?: string
  showLabel?: boolean
  labelClassName?: string
}

export function CartIconLink({
  className,
  iconClassName = "size-[17px] stroke-[1.5]",
  badgeClassName,
  showLabel = false,
  labelClassName,
}: CartIconLinkProps) {
  const { itemCount } = useCart()

  return (
    <Link
      href="/cart"
      aria-label="Cart"
      className={cn("relative inline-flex items-center gap-1.5", className)}
    >
      {showLabel ? (
        <span className={cn("landing-label text-[10px]", labelClassName)}>
          Cart ({itemCount})
        </span>
      ) : null}
      <ShoppingBag className={iconClassName} />
      {!showLabel && itemCount > 0 ? (
        <span
          className={cn(
            "absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-[#785D44] font-sans text-[9px] font-medium leading-none text-white",
            badgeClassName,
          )}
        >
          {itemCount > 9 ? "9+" : itemCount}
        </span>
      ) : null}
    </Link>
  )
}
