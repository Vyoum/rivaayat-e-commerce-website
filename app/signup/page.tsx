"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { Eye, EyeOff, ArrowRight } from "lucide-react"
import { getSupabaseBrowser } from "@/lib/supabase/browser"
import { signInWithOAuth } from "@/lib/supabase/oauth"
import { HOUSE_OF_INDIKA } from "@/lib/brand"

export default function SignupPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<"google" | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.")
      setLoading(false)
      return
    }

    const supabase = getSupabaseBrowser()
    if (!supabase) {
      setError("Authentication is not configured.")
      setLoading(false)
      return
    }

    const fullName = `${formData.firstName} ${formData.lastName}`.trim()
    const { error: signUpError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: { full_name: fullName },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    router.push("/profile")
  }

  const handleGoogleSignUp = async () => {
    setOauthLoading("google")
    setError(null)

    const { error: oauthError } = await signInWithOAuth("google", "/profile")
    if (oauthError) {
      setError(oauthError.message)
      setOauthLoading(null)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="relative min-h-screen pt-24 pb-16">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="relative h-full w-full">
            <img
              src="/realistic-indian-woman-crafting-jewelry.jpg"
              alt="Artisan crafting jewelry"
              className="h-full w-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/95" />
          </div>
        </div>

        {/* Content */}
        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
              {/* Left Column - Hero Text */}
              <div className="space-y-8 text-center lg:text-left lg:order-2">
                <div className="space-y-4">
                  <h1 className="font-serif text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl text-balance">
                    Begin Your Journey
                  </h1>
                  <p className="font-serif text-xl text-muted-foreground italic lg:text-2xl">अपनी यात्रा शुरू करें</p>
                  <p className="font-sans text-lg text-muted-foreground mt-6 leading-relaxed">
                    Create an account to explore handcrafted stories and artisan treasures.
                  </p>
                </div>

                <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-accent flex-shrink-0" />
                    <p className="font-sans text-base text-foreground/90 leading-relaxed text-pretty">
                      New here? Create an account to explore curated collections, customise your food orders, and stay
                      updated on fresh drops and craft stories.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-accent flex-shrink-0" />
                    <p className="font-sans text-base text-foreground/90 leading-relaxed text-pretty">
                      Join our community of conscious buyers who believe every purchase can create positive change in an
                      artisan's life.
                    </p>
                  </div>
                </div>

                {/* Decorative Element */}
                <div className="hidden lg:block">
                  <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                    <span className="font-serif text-sm text-muted-foreground italic">
                      Where every signup begins a new story
                    </span>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                  </div>
                </div>
              </div>

              {/* Right Column - Signup Form */}
              <div className="flex items-center justify-center lg:order-1">
                <Card className="w-full max-w-md border-border/50 bg-card/80 backdrop-blur-sm shadow-2xl">
                  <CardHeader className="space-y-3 pb-8">
                    <CardTitle className="font-serif text-3xl text-center">Create Account</CardTitle>
                    <CardDescription className="font-sans text-center text-base">
                      Join the {HOUSE_OF_INDIKA} family today
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {error && (
                      <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 font-sans text-sm text-red-700">
                        {error}
                      </p>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="font-sans text-sm font-medium">
                            First Name
                          </Label>
                          <Input
                            id="firstName"
                            type="text"
                            placeholder="John"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            required
                            className="font-sans h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="font-sans text-sm font-medium">
                            Last Name
                          </Label>
                          <Input
                            id="lastName"
                            type="text"
                            placeholder="Doe"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            required
                            className="font-sans h-11"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="font-sans text-sm font-medium">
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="name@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          className="font-sans h-11"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password" className="font-sans text-sm font-medium">
                          Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            className="font-sans h-11 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="font-sans text-sm font-medium">
                          Confirm Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            required
                            className="font-sans h-11 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="terms"
                          checked={formData.agreeToTerms}
                          onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: checked as boolean })}
                          required
                        />
                        <label
                          htmlFor="terms"
                          className="font-sans text-sm text-muted-foreground leading-relaxed cursor-pointer"
                        >
                          I agree to the{" "}
                          <Link href="/terms" className="text-primary hover:text-primary/80 transition-colors">
                            Terms & Conditions
                          </Link>{" "}
                          and{" "}
                          <Link href="/privacy" className="text-primary hover:text-primary/80 transition-colors">
                            Privacy Policy
                          </Link>
                        </label>
                      </div>

                      <Button type="submit" disabled={loading} className="w-full h-11 font-sans text-base group" size="lg">
                        {loading ? "Creating account..." : "Create Account"}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-card px-2 text-muted-foreground font-sans">Or sign up with</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <Button
                          variant="outline"
                          type="button"
                          disabled={loading || oauthLoading !== null}
                          onClick={handleGoogleSignUp}
                          className="font-sans h-11 bg-transparent"
                        >
                          {oauthLoading === "google" ? "Redirecting..." : "Google"}
                        </Button>
                        <Button variant="outline" type="button" className="font-sans h-11 bg-transparent" disabled>
                          Facebook
                        </Button>
                      </div>

                      <div className="text-center text-sm font-sans">
                        <span className="text-muted-foreground">Already have an account? </span>
                        <Link
                          href="/login"
                          className="text-primary font-medium hover:text-primary/80 transition-colors"
                        >
                          Sign in
                        </Link>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

    </main>
  )
}
