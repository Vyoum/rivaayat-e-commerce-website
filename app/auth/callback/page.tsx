"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { getSupabaseBrowser } from "@/lib/supabase/browser"

export default function AuthCallbackPage() {
  const router = useRouter()
  const [message, setMessage] = useState("Signing you in...")

  useEffect(() => {
    async function completeSignIn() {
      const supabase = getSupabaseBrowser()
      if (!supabase) {
        router.replace("/login?error=Authentication+is+not+configured")
        return
      }

      const params = new URLSearchParams(window.location.search)
      const next = params.get("next") || "/profile"
      const code = params.get("code")
      const oauthError = params.get("error_description") || params.get("error")

      if (oauthError) {
        router.replace(`/login?error=${encodeURIComponent(oauthError)}`)
        return
      }

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
          router.replace(`/login?error=${encodeURIComponent(error.message)}`)
          return
        }
      } else {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          router.replace("/login?error=Sign-in+could+not+be+completed")
          return
        }
      }

      router.replace(next)
    }

    completeSignIn().catch(() => {
      setMessage("Something went wrong. Redirecting...")
      router.replace("/login?error=Sign-in+could+not+be+completed")
    })
  }, [router])

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#ede0d0] px-6">
      <div className="rounded-2xl border border-[#8A6A55]/20 bg-[#FAF6F0]/90 px-8 py-10 text-center shadow-xl">
        <p className="font-serif text-2xl text-[#2D1A12]">{message}</p>
        <p className="mt-2 font-sans text-sm text-[#7D5A44]">Please wait a moment.</p>
      </div>
    </main>
  )
}
