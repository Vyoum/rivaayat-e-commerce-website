"use client"

import { useEffect, useRef } from "react"

import { useAuth } from "@/hooks/use-auth"

export function AuthUserSync() {
  const { user, loading } = useAuth()
  const syncedUserId = useRef<string | null>(null)

  useEffect(() => {
    if (loading || !user?.id) return
    if (syncedUserId.current === user.id) return

    syncedUserId.current = user.id
    void fetch("/api/auth/sync-user", { method: "POST", credentials: "include" })
  }, [user?.id, loading])

  return null
}
