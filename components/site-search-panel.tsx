"use client"

import { useEffect, useId, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Search, X } from "lucide-react"

import { cn } from "@/lib/utils"

type SiteSearchPanelProps = {
  open: boolean
  onClose: () => void
}

export function SiteSearchPanel({ open, onClose }: SiteSearchPanelProps) {
  const router = useRouter()
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState("")

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const timer = window.setTimeout(() => inputRef.current?.focus(), 50)

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.clearTimeout(timer)
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [open, onClose])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return

    onClose()
    setQuery("")
    router.push(`/collections?q=${encodeURIComponent(trimmed)}`)
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-[70]",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Close search"
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-[#2D1A12]/40 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
      />

      <div
        className={cn(
          "absolute inset-x-0 top-0 border-b border-[#E8E0D4] bg-[#FCF8F4] px-5 py-5 shadow-lg transition-transform duration-300 sm:px-8",
          open ? "translate-y-0" : "-translate-y-full",
        )}
      >
        <form onSubmit={handleSubmit} className="mx-auto flex max-w-[720px] items-center gap-3">
          <label htmlFor={inputId} className="sr-only">
            Search products
          </label>
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#9A8070]" />
            <input
              ref={inputRef}
              id={inputId}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search jewellery, clothing, décor, artisans..."
              className="h-11 w-full rounded-full border border-[#D9CFC0] bg-white pr-4 pl-10 font-sans text-[14px] text-[#3D2E24] outline-none placeholder:text-[#9A8070] focus:border-[#785D44]"
            />
          </div>
          <button
            type="submit"
            className="hidden h-11 shrink-0 rounded-full bg-[#785D44] px-5 font-sans text-[12px] font-semibold tracking-[0.12em] text-white uppercase transition-colors hover:bg-[#6B5344] sm:inline-flex sm:items-center sm:justify-center"
          >
            Search
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-[#D9CFC0] text-[#6B5344] transition-colors hover:border-[#785D44] hover:text-[#3D2E24]"
          >
            <X className="size-4" />
          </button>
        </form>
      </div>
    </div>
  )
}
