"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Eye, EyeOff } from "lucide-react"

import { AuthHeader } from "@/components/auth/auth-header"
import { HOUSE_OF_INDIKA } from "@/lib/brand"
import { getSafeRedirectPath } from "@/lib/auth-redirect"
import { getSupabaseBrowser } from "@/lib/supabase/browser"
import { signInWithOAuth } from "@/lib/supabase/oauth"
import { syncUserAfterAuth } from "@/lib/sync-user-client"
import { cn } from "@/lib/utils"

function getLoginRedirectPath() {
  const params = new URLSearchParams(window.location.search)
  return getSafeRedirectPath(params.get("next"))
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const oauthError = params.get("error")
    if (oauthError === "admin_required") {
      setError("This account does not have admin access. Ask an existing admin to grant you access.")
    } else if (oauthError === "database_unavailable") {
      setError(
        "Could not reach the database on the server. Check that DATABASE_URL is set in Vercel environment variables.",
      )
    } else if (oauthError === "profile_sync_failed") {
      setError(
        "Your account is signed in but the profile could not be loaded. Try signing out and back in, or contact support.",
      )
    } else if (oauthError === "admin_unavailable") {
      setError("Admin is temporarily unavailable. Please try again in a moment.")
    } else if (oauthError) {
      setError(decodeURIComponent(oauthError.replace(/\+/g, " ")))
    }
  }, [])

  const handleGoogleSignIn = async () => {
    setOauthLoading(true)
    setError(null)

    const { error: oauthError } = await signInWithOAuth("google", getLoginRedirectPath())
    if (oauthError) {
      setError(oauthError.message)
      setOauthLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = getSupabaseBrowser()
    if (!supabase) {
      setError("Authentication is not configured.")
      setLoading(false)
      return
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    await syncUserAfterAuth()
    router.push(getLoginRedirectPath())
  }

  return (
    <main className="min-h-screen bg-[#F5F3E9]">
      <AuthHeader />

      <section className="relative overflow-hidden px-6 py-12 lg:px-10 lg:py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 top-10 size-[420px] rounded-full bg-[#EDE8DC]/80 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 bottom-0 size-[360px] rounded-full bg-[#8FA68E]/10 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-[#9A8070]">
                Welcome back
              </p>
              <h1 className="font-serif text-[42px] leading-[1.08] font-normal text-[#3D2E24] md:text-[52px]">
                Return to{" "}
                <span className="text-[#846246]">{HOUSE_OF_INDIKA}</span>
              </h1>
              <p className="font-serif text-[20px] italic text-[#9A8070]">
                Your wishlist, orders, and artisan favourites await.
              </p>
              <p className="max-w-md font-sans text-[15px] leading-relaxed text-[#6B5344]">
                Sign in to view your wishlist, track orders, and continue exploring handcrafted
                treasures from artisans across India.
              </p>
            </div>

            <div className="relative aspect-[5/4] max-w-md overflow-hidden rounded-[28px] shadow-[0_16px_50px_rgba(61,46,36,0.12)] [&_img]:rounded-[28px]">
              <Image
                src="/indian-artisan-weaving-handloom-fabric.jpg"
                alt="Artisan weaving at the loom"
                fill
                className="object-cover rounded-[28px]"
                sizes="(max-width: 1024px) 100vw, 420px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3D2E24]/55 via-transparent to-transparent rounded-[28px]" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="font-serif text-[18px] italic leading-snug text-[#F5F0E8]">
                  &ldquo;Every login is a return to tradition.&rdquo;
                </p>
              </div>
            </div>

            <ul className="grid gap-3 sm:grid-cols-2">
              {[
                "Saved favourites & wishlist",
                "Order tracking & history",
                "Personalised recommendations",
                "Artisan patronage rewards",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2.5 rounded-2xl border border-[#E8E0D4] bg-white/60 px-4 py-3 font-sans text-[13px] text-[#6B5344]"
                >
                  <span className="size-1.5 shrink-0 rounded-full bg-[#846246]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mx-auto w-full max-w-md lg:mx-0 lg:justify-self-end">
            <div className="rounded-[28px] border border-[#E8E0D4] bg-[#FDF9F3]/95 p-8 shadow-[0_20px_60px_rgba(61,46,36,0.08)] backdrop-blur-sm sm:p-10">
              <div className="mb-8 text-center">
                <h2 className="font-serif text-[32px] font-normal text-[#3D2E24]">Sign In</h2>
                <p className="mt-2 font-sans text-[14px] text-[#9A8070]">
                  Enter your details to access your account
                </p>
              </div>

              {error ? (
                <p className="mb-6 rounded-2xl border border-[#E8C4BC] bg-[#FFF5F3] px-4 py-3 font-sans text-[13px] leading-relaxed text-[#8B4D42]">
                  {error}
                </p>
              ) : null}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="email" className="font-sans text-[12px] font-medium uppercase tracking-[0.12em] text-[#9A8070]">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 w-full rounded-xl border border-[#D9CFC0] bg-white px-4 font-sans text-[14px] text-[#3D2E24] outline-none transition-colors placeholder:text-[#C4B5A5] focus:border-[#846246] focus:ring-2 focus:ring-[#846246]/15"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <label htmlFor="password" className="font-sans text-[12px] font-medium uppercase tracking-[0.12em] text-[#9A8070]">
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="font-sans text-[12px] text-[#846246] transition-colors hover:text-[#5C4332]"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-12 w-full rounded-xl border border-[#D9CFC0] bg-white px-4 pr-12 font-sans text-[14px] text-[#3D2E24] outline-none transition-colors placeholder:text-[#C4B5A5] focus:border-[#846246] focus:ring-2 focus:ring-[#846246]/15"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A8070] transition-colors hover:text-[#3D2E24]"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || oauthLoading}
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#5C4332] font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#4A3528] disabled:opacity-60"
                >
                  {loading ? "Signing in..." : "Sign In"}
                  {!loading ? (
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  ) : null}
                </button>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-[#E8E0D4]" />
                  </div>
                  <p className="relative mx-auto w-fit bg-[#FDF9F3] px-3 font-sans text-[11px] uppercase tracking-[0.14em] text-[#9A8070]">
                    Or continue with
                  </p>
                </div>

                <button
                  type="button"
                  disabled={loading || oauthLoading}
                  onClick={handleGoogleSignIn}
                  className={cn(
                    "flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-[#D9CFC0] bg-white font-sans text-[13px] font-medium text-[#3D2E24] transition-colors hover:border-[#846246]/40 hover:bg-[#FAF6F0]",
                    oauthLoading && "opacity-70",
                  )}
                >
                  <GoogleIcon />
                  {oauthLoading ? "Redirecting to Google..." : "Continue with Google"}
                </button>

                <p className="pt-2 text-center font-sans text-[14px] text-[#9A8070]">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/signup"
                    className="font-medium text-[#846246] underline-offset-4 transition-colors hover:text-[#5C4332] hover:underline"
                  >
                    Create one
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
