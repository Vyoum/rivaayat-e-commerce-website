"use client"

import Link from "next/link"
import { Heart } from "lucide-react"

import { useWishlist } from "@/components/providers/wishlist-provider"
import { cn } from "@/lib/utils"

type WishlistIconLinkProps = {
  className?: string
  iconClassName?: string
  badgeClassName?: string
}

export function WishlistIconLink({
  className,
  iconClassName = "size-[17px] stroke-[1.5]",
  badgeClassName,
}: WishlistIconLinkProps) {
  const { itemCount, isLoggedIn } = useWishlist()

  const href = isLoggedIn ? "/wishlist" : "/login?next=/wishlist"

  return (
    <Link
      href={href}
      aria-label="Wishlist"
      className={cn("relative inline-flex", className)}
    >
      <Heart className={iconClassName} />
      {isLoggedIn && itemCount > 0 ? (
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
