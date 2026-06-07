"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { getSupabaseBrowser } from "@/lib/supabase/browser"
import type { ProfileData } from "@/types/profile"

type UseProfileOptions = {
  enabled?: boolean
}

export function useProfile({ enabled = true }: UseProfileOptions = {}) {
  const router = useRouter()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(enabled)
  const [error, setError] = useState<string | null>(null)

  const loadProfile = useCallback(async () => {
    setLoading(true)
    setError(null)

    const supabase = getSupabaseBrowser()
    if (!supabase) {
      setError("Authentication is not configured.")
      setLoading(false)
      return
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      router.replace("/login?next=/profile")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/profile", {
        credentials: "include",
      })

      if (res.status === 401) {
        router.replace("/login?next=/profile")
        return
      }

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to load profile")
      }

      setProfile(data as ProfileData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile")
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    if (!enabled) {
      setLoading(false)
      return
    }

    loadProfile()
  }, [enabled, loadProfile])

  const signOut = useCallback(async () => {
    const supabase = getSupabaseBrowser()
    if (supabase) {
      await supabase.auth.signOut()
    }
    router.replace("/login")
  }, [router])

  return { profile, loading, error, reload: loadProfile, signOut }
}
