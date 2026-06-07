"use client"

import Link from "next/link"
import { User } from "lucide-react"

import { useAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"

type AccountIconLinkProps = {
  className?: string
  iconClassName?: string
}

export function AccountIconLink({
  className,
  iconClassName = "size-[17px] stroke-[1.5]",
}: AccountIconLinkProps) {
  const { isLoggedIn } = useAuth()
  const href = isLoggedIn ? "/profile" : "/login?next=/profile"

  return (
    <Link href={href} aria-label="Account" className={cn("inline-flex", className)}>
      <User className={iconClassName} />
    </Link>
  )
}
