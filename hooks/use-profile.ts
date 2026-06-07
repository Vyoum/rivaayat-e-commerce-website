"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseBrowser } from "@/lib/supabase/browser"
import type { ProfileData } from "@/types/profile"

export function useProfile() {
  const router = useRouter()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
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
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      router.replace("/login")
      return
    }

    try {
      const res = await fetch("/api/profile", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      })

      if (res.status === 401) {
        router.replace("/login")
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
    loadProfile()
  }, [loadProfile])

  const signOut = useCallback(async () => {
    const supabase = getSupabaseBrowser()
    if (supabase) {
      await supabase.auth.signOut()
    }
    router.replace("/login")
  }, [router])

  return { profile, loading, error, reload: loadProfile, signOut }
}
