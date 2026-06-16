"use client"

import { useCallback, useEffect, useSyncExternalStore } from "react"
import { Truck } from "lucide-react"

import type { DeliveryEstimate } from "@/lib/delhivery-estimate"
import { cn } from "@/lib/utils"

const PIN_STORAGE_KEY = "hoi-delivery-pincode"

type SharedDeliveryState = {
  pinCode: string
  loading: boolean
  estimate: DeliveryEstimate | null
}

type ProductCardDeliveryEstimateProps = {
  variant?: "card" | "detail"
}

let sharedState: SharedDeliveryState = {
  pinCode: "",
  loading: false,
  estimate: null,
}

let fetchTimer: ReturnType<typeof setTimeout> | null = null
let fetchController: AbortController | null = null
const listeners = new Set<() => void>()

function readStoredPin() {
  if (typeof window === "undefined") return ""
  return window.localStorage.getItem(PIN_STORAGE_KEY) ?? ""
}

function emit() {
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return sharedState
}

function getServerSnapshot() {
  return sharedState
}

async function fetchEstimateForPin(pinCode: string) {
  fetchController?.abort()
  fetchController = new AbortController()

  sharedState = { ...sharedState, loading: true, estimate: null }
  emit()

  try {
    const response = await fetch(
      `/api/delivery/estimate?pinCode=${encodeURIComponent(pinCode)}`,
      { signal: fetchController.signal },
    )
    const data = (await response.json()) as { estimate?: DeliveryEstimate; error?: string }

    if (!response.ok) {
      throw new Error(data.error ?? "Could not estimate delivery")
    }

    sharedState = {
      pinCode,
      loading: false,
      estimate: data.estimate ?? null,
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") return
    sharedState = { pinCode, loading: false, estimate: null }
  }

  emit()
}

function scheduleEstimate(pinCode: string) {
  if (fetchTimer) window.clearTimeout(fetchTimer)

  const normalized = pinCode.replace(/\D/g, "").slice(0, 6)
  sharedState = { pinCode: normalized, loading: false, estimate: null }
  emit()

  if (normalized.length !== 6) return

  fetchTimer = window.setTimeout(() => {
    void fetchEstimateForPin(normalized)
  }, 400)
}

function setSharedPinCode(pinCode: string) {
  const normalized = pinCode.replace(/\D/g, "").slice(0, 6)
  if (typeof window !== "undefined") {
    window.localStorage.setItem(PIN_STORAGE_KEY, normalized)
  }
  scheduleEstimate(normalized)
}

function hydrateSharedPin() {
  const stored = readStoredPin()
  if (stored && stored !== sharedState.pinCode) {
    scheduleEstimate(stored)
  }
}

export function ProductCardDeliveryEstimate({
  variant = "card",
}: ProductCardDeliveryEstimateProps) {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const isDetail = variant === "detail"

  useEffect(() => {
    hydrateSharedPin()
  }, [])

  const handleChange = useCallback((value: string) => {
    setSharedPinCode(value)
  }, [])

  const showEstimate = state.pinCode.length === 6 && !state.loading && state.estimate

  return (
    <div
      className={cn(
        isDetail
          ? "mt-6 rounded-2xl border border-[#E8E0D4] bg-[#FDF9F3] px-5 py-4"
          : "mt-2.5 rounded-lg border border-[#E8E0D4]/80 bg-white/50 px-2 py-2 sm:mt-4 sm:px-3 sm:py-2.5",
      )}
    >
      <div className="flex items-center gap-2">
        <Truck
          className={cn(
            "shrink-0 text-[#846246]",
            isDetail ? "size-4" : "size-3 sm:size-3.5",
          )}
          strokeWidth={1.5}
        />
        <p
          className={cn(
            "font-medium uppercase tracking-[0.14em] text-[#3D2E24]",
            isDetail
              ? "font-sans text-[11px]"
              : "font-sans text-[9px] sm:text-[10px]",
          )}
        >
          Estimate Delivery
        </p>
      </div>

      <label className={cn("block", isDetail ? "mt-3" : "mt-2")}>
        <span className="sr-only">PIN code</span>
        <input
          type="text"
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={6}
          value={state.pinCode}
          placeholder="Enter your PIN code"
          onChange={(event) => handleChange(event.target.value)}
          className={cn(
            "w-full border-0 border-b bg-transparent py-1.5 outline-none transition-colors focus:border-[#846246]",
            isDetail
              ? "border-[#D9CFC0] font-sans text-[14px] text-[#3D2E24] placeholder:text-[#9A8070]"
              : "border-black/40 font-serif text-[11px] tracking-[0.04em] text-black placeholder:text-black/40 sm:text-[12px]",
          )}
        />
      </label>

      {state.loading ? (
        <p
          className={cn(
            "mt-2 font-light italic text-[#9A8070]",
            isDetail ? "font-sans text-[13px]" : "font-serif text-[10px] sm:text-[11px]",
          )}
        >
          Checking delivery…
        </p>
      ) : null}

      {showEstimate && state.estimate?.serviceable ? (
        <p
          className={cn(
            "mt-2 leading-snug text-[#3D2E24]",
            isDetail ? "font-sans text-[13px]" : "font-serif text-[10px] sm:text-[12px]",
          )}
        >
          Delivers by{" "}
          <span className="font-medium">{state.estimate.estimatedLabel}</span>
          {state.estimate.city ? (
            <span className="text-[#9A8070]"> · {state.estimate.city}</span>
          ) : null}
        </p>
      ) : null}

      {showEstimate && !state.estimate?.serviceable ? (
        <p
          className={cn(
            "mt-2 text-[#9A8070]",
            isDetail ? "font-sans text-[13px]" : "font-serif text-[10px] sm:text-[11px]",
          )}
        >
          Delivery unavailable for this PIN
        </p>
      ) : null}
    </div>
  )
}
