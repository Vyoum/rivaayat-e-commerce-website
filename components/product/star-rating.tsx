import { Star } from "lucide-react"

import { cn } from "@/lib/utils"

type StarRatingProps = {
  rating: number
  size?: "sm" | "md"
  className?: string
}

export function StarRating({ rating, size = "sm", className }: StarRatingProps) {
  const starSize = size === "sm" ? "size-[14px]" : "size-[18px]"

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = Math.min(Math.max(rating - i, 0), 1)
        return (
          <div key={i} className={cn("relative", starSize)}>
            <Star className={cn("absolute inset-0 fill-[#E8E0D4] text-[#E8E0D4]", starSize)} />
            {fill > 0 && (
              <div className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star className={cn("fill-[#C4A035] text-[#C4A035]", starSize)} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

type InteractiveStarRatingProps = {
  rating: number
  onChange: (rating: number) => void
  size?: "sm" | "md"
}

export function InteractiveStarRating({
  rating,
  onChange,
  size = "md",
}: InteractiveStarRatingProps) {
  const starSize = size === "sm" ? "size-5" : "size-7"

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => {
        const value = index + 1
        const filled = value <= rating
        return (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            className="transition-transform hover:scale-110"
            aria-label={`Rate ${value} stars`}
          >
            <Star
              className={cn(
                starSize,
                filled ? "fill-[#C4A035] text-[#C4A035]" : "fill-[#E8E0D4] text-[#E8E0D4]",
              )}
            />
          </button>
        )
      })}
    </div>
  )
}
