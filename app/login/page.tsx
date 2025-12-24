"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Eye, EyeOff, ArrowRight } from "lucide-react"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    console.log("Login attempt:", { email, password })
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="relative min-h-screen pt-24 pb-16">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="relative h-full w-full">
            <img
              src="/indian-artisan-weaving-handloom-fabric.jpg"
              alt="Artisan at work"
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
              <div className="space-y-8 text-center lg:text-left">
                <div className="space-y-4">
                  <h1 className="font-serif text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl text-balance">
                    Welcome back to Rivaayat
                  </h1>
                  <p className="font-serif text-xl text-muted-foreground italic lg:text-2xl">
                    रिवायत में वापसी पर स्वागत है
                  </p>
                  <p className="font-sans text-lg text-muted-foreground mt-6 leading-relaxed">
                    Sign in to continue your journey with handcrafted stories.
                  </p>
                </div>

                <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-accent flex-shrink-0" />
                    <p className="font-sans text-base text-foreground/90 leading-relaxed text-pretty">
                      Log in to view your saved favourites, track orders, and discover recommendations tailored to your
                      style and taste.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-accent flex-shrink-0" />
                    <p className="font-sans text-base text-foreground/90 leading-relaxed text-pretty">
                      New here? Create an account to explore curated collections, customise your food orders, and stay
                      updated on fresh drops and craft stories.
                    </p>
                  </div>
                </div>

                {/* Decorative Element */}
                <div className="hidden lg:block">
                  <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                    <span className="font-serif text-sm text-muted-foreground italic">
                      Every login is a return to tradition
                    </span>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                  </div>
                </div>
              </div>

              {/* Right Column - Login Form */}
              <div className="flex items-center justify-center">
                <Card className="w-full max-w-md border-border/50 bg-card/80 backdrop-blur-sm shadow-2xl">
                  <CardHeader className="space-y-3 pb-8">
                    <CardTitle className="font-serif text-3xl text-center">Sign In</CardTitle>
                    <CardDescription className="font-sans text-center text-base">
                      Enter your credentials to access your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="font-sans text-sm font-medium">
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="name@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="font-sans h-11"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password" className="font-sans text-sm font-medium">
                            Password
                          </Label>
                          <Link
                            href="/forgot-password"
                            className="font-sans text-sm text-primary hover:text-primary/80 transition-colors"
                          >
                            Forgot password?
                          </Link>
                        </div>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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

                      <Button type="submit" className="w-full h-11 font-sans text-base group" size="lg">
                        Sign In
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-card px-2 text-muted-foreground font-sans">Or continue with</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" type="button" className="font-sans h-11 bg-transparent">
                          Google
                        </Button>
                        <Button variant="outline" type="button" className="font-sans h-11 bg-transparent">
                          Facebook
                        </Button>
                      </div>

                      <div className="text-center text-sm font-sans">
                        <span className="text-muted-foreground">Don't have an account? </span>
                        <Link
                          href="/signup"
                          className="text-primary font-medium hover:text-primary/80 transition-colors"
                        >
                          Sign up
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

      <Footer />
    </main>
  )
}
