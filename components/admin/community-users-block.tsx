"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Loader2, Users } from "lucide-react"

import { getInitials } from "@/lib/profile-utils"
import type { AdminUsersSummary } from "@/types/admin-user"

type CommunityUsersBlockProps = {
  href?: string
}

export function CommunityUsersBlock({ href = "/admin/community/users" }: CommunityUsersBlockProps) {
  const [summary, setSummary] = useState<AdminUsersSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/users?summary=1")
        const data = await res.json()
        if (res.ok) setSummary(data.summary)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <Link
      href={href}
      className="group block rounded-xl border border-[#EDE5D8] bg-white p-5 shadow-sm transition-all hover:border-[#C4A882] hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-[#E8F0FE]">
          <Users className="size-5 text-[#3B5998]" strokeWidth={1.75} />
        </div>
        <ChevronRight className="size-4 text-[#9A8070] transition-transform group-hover:translate-x-0.5 group-hover:text-[#2B1B12]" />
      </div>

      <h3 className="mt-4 font-serif text-[18px] font-semibold text-[#2D1E17]">
        Registered Users
      </h3>
      <p className="mt-1 text-[12px] leading-relaxed text-[#9A8070]">
        View everyone who has signed in — Google, email, and checkout accounts.
      </p>

      {loading ? (
        <div className="mt-4 flex items-center gap-2 text-[12px] text-[#9A8070]">
          <Loader2 className="size-4 animate-spin" />
          Loading users…
        </div>
      ) : (
        <>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <p className="text-[28px] font-semibold leading-none text-[#2D1E17]">
                {summary?.total ?? 0}
              </p>
              <p className="mt-1 text-[11px] text-[#9A8070]">total accounts</p>
            </div>
            {(summary?.recentlyActive ?? 0) > 0 && (
              <span className="rounded-full bg-[#E6F4EA] px-2.5 py-1 text-[11px] font-semibold text-[#1E7E34]">
                {summary?.recentlyActive} active today
              </span>
            )}
          </div>

          {summary && summary.preview.length > 0 && (
            <div className="mt-4 flex items-center gap-2 border-t border-[#F5EDE3] pt-4">
              <div className="flex -space-x-2">
                {summary.preview.map((user) => (
                  <span
                    key={user.id}
                    className="relative inline-flex size-8 overflow-hidden rounded-full ring-2 ring-white"
                  >
                    {user.avatarUrl ? (
                      <Image
                        src={user.avatarUrl}
                        alt=""
                        width={32}
                        height={32}
                        className="size-full object-cover"
                      />
                    ) : (
                      <span className="flex size-full items-center justify-center bg-[#E8D8C3] text-[10px] font-semibold text-[#6B5344]">
                        {getInitials(user.name)}
                      </span>
                    )}
                  </span>
                ))}
              </div>
              <span className="text-[11px] text-[#9A8070]">Click to view all users</span>
            </div>
          )}
        </>
      )}
    </Link>
  )
}
