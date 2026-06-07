"use client"

import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"

import { getSupabaseBrowser } from "@/lib/supabase/browser"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = getSupabaseBrowser()
    if (!supabase) {
      setLoading(false)
      return
    }

    let active = true

    async function syncUser() {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser()

      if (!active) return
      setUser(currentUser ?? null)
      setLoading(false)
    }

    syncUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  return {
    user,
    userId: user?.id ?? null,
    isLoggedIn: !!user,
    loading,
  }
}
