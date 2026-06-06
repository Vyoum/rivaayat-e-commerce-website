"use client"

import { Heart, Play } from "lucide-react"

export function LandingNewsletter() {
  return (
    <section className="bg-[#8D4225] px-5 py-14 text-center lg:px-8 lg:py-16">
      <div className="mx-auto max-w-[560px]">
        <div className="mx-auto mb-5 flex size-9 items-center justify-center rounded border border-white/35">
          <Heart className="size-4 text-white/90" strokeWidth={1.5} />
        </div>

        <h2 className="font-sans text-[22px] font-light tracking-wide text-white sm:text-[26px]">
          Join Our <span className="font-serif text-[28px] font-normal sm:text-[32px]">परिवार</span>
        </h2>

        <p className="mt-4 font-sans text-[13px] leading-[1.7] text-white/82 sm:text-[14px]">
          Receive stories of hope, artisan updates, and early access to new collections.
          Every email is a window into the lives you&apos;re helping transform.
        </p>

        <form
          className="mt-8 flex flex-col gap-0 sm:flex-row sm:items-stretch"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            placeholder="Enter your email"
            className="h-11 flex-1 rounded-none bg-[#6B3418] px-4 font-sans text-[13px] text-white placeholder:text-white/45 outline-none sm:h-12"
          />
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center gap-2 bg-white px-6 font-sans text-[11px] font-semibold tracking-[0.14em] text-[#2D1A12] transition-colors hover:bg-white/92 sm:h-12"
          >
            SUBSCRIBE
            <Play className="size-2.5 fill-[#2D1A12] text-[#2D1A12]" />
          </button>
        </form>

        <p className="mt-4 font-sans text-[11px] text-white/55">
          We respect your inbox. Only meaningful stories, never spam.
        </p>
      </div>
    </section>
  )
}
