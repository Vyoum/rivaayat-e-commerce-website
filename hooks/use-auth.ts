"use client"

import { useEffect, useState } from "react"
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js"

import { getSupabaseBrowser } from "@/lib/supabase/browser"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const client = getSupabaseBrowser()
    if (!client) {
      setLoading(false)
      return
    }

    let active = true

    void (async () => {
      const {
        data: { user: currentUser },
      } = await client.auth.getUser()

      if (!active) return
      setUser(currentUser ?? null)
      setLoading(false)
    })()

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
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
