import Image from "next/image"

import { getInitials } from "@/lib/profile-utils"
import type { AdminProfile } from "@/lib/admin-profile-server"

export function AdminUserAvatar({
  profile,
  size = "md",
}: {
  profile: AdminProfile
  size?: "sm" | "md"
}) {
  const dimension = size === "sm" ? "size-8" : "size-9"
  const textSize = size === "sm" ? "text-[11px]" : "text-[12px]"

  if (profile.avatarUrl) {
    return (
      <Image
        src={profile.avatarUrl}
        alt={profile.name}
        width={size === "sm" ? 32 : 36}
        height={size === "sm" ? 32 : 36}
        className={`${dimension} rounded-full object-cover`}
      />
    )
  }

  return (
    <span
      className={`${dimension} flex items-center justify-center rounded-full bg-[#C4A882] ${textSize} font-semibold text-[#2D1E17]`}
    >
      {getInitials(profile.name)}
    </span>
  )
}
