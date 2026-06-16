import { getDelhiveryConfig } from "@/lib/delhivery"

export type DeliveryEstimate = {
  serviceable: boolean
  prepaid: boolean
  pinCode: string
  city: string | null
  stateCode: string | null
  zone: string | null
  minDays: number
  maxDays: number
  estimatedLabel: string
  message: string
}

const PROCESSING_DAYS = 2
const DEFAULT_WEIGHT_GRAMS = 500

const ZONE_TRANSIT_DAYS: Record<string, { min: number; max: number }> = {
  A: { min: 1, max: 2 },
  B: { min: 2, max: 3 },
  C: { min: 3, max: 5 },
  D: { min: 4, max: 7 },
  E: { min: 6, max: 10 },
  F: { min: 7, max: 11 },
}

type DelhiveryPincodeResponse = {
  delivery_codes?: Array<{
    postal_code?: {
      pin?: number | string
      city?: string
      state_code?: string
      pre_paid?: string
      cod?: string
      district?: string
    }
  }>
}

type DelhiveryChargeResponse = Array<{
  zone?: string
  total_amount?: number
}>

function normalizePinCode(value: string) {
  return value.replace(/\D/g, "").slice(0, 6)
}

function getOriginPinCode() {
  return process.env.DELHIVERY_ORIGIN_PINCODE?.trim() ?? ""
}

function formatDeliveryRange(minDays: number, maxDays: number) {
  const start = addCalendarDays(new Date(), minDays)
  const end = addCalendarDays(new Date(), maxDays)
  const formatter = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
  })

  if (minDays === maxDays) {
    return formatter.format(start)
  }

  return `${formatter.format(start)} – ${formatter.format(end)}`
}

function addCalendarDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function fallbackEstimate(pinCode: string): DeliveryEstimate {
  const minDays = 5
  const maxDays = 8
  return {
    serviceable: true,
    prepaid: true,
    pinCode,
    city: null,
    stateCode: null,
    zone: null,
    minDays,
    maxDays,
    estimatedLabel: formatDeliveryRange(minDays, maxDays),
    message: `Estimated delivery: ${formatDeliveryRange(minDays, maxDays)} (approx.)`,
  }
}

async function fetchPincodeDetails(pinCode: string, token: string, apiBaseUrl: string) {
  const url = `${apiBaseUrl}/c/api/pin-codes/json/?filter_codes=${encodeURIComponent(pinCode)}`
  const response = await fetch(url, {
    headers: {
      Authorization: `Token ${token}`,
      Accept: "application/json",
    },
    next: { revalidate: 3600 },
  })

  if (!response.ok) {
    throw new Error(`Delhivery pincode lookup failed (${response.status})`)
  }

  return (await response.json()) as DelhiveryPincodeResponse
}

async function fetchShippingZone(
  originPin: string,
  destinationPin: string,
  token: string,
  apiBaseUrl: string,
  weightGrams: number,
) {
  const params = new URLSearchParams({
    md: "S",
    cgm: String(weightGrams),
    o_pin: originPin,
    d_pin: destinationPin,
    ss: "Delivered",
    pt: "Pre-paid",
  })

  const url = `${apiBaseUrl}/api/kinko/v1/invoice/charges/.json?${params.toString()}`
  const response = await fetch(url, {
    headers: {
      Authorization: `Token ${token}`,
      Accept: "application/json",
    },
    next: { revalidate: 3600 },
  })

  if (!response.ok) {
    throw new Error(`Delhivery zone lookup failed (${response.status})`)
  }

  const data = (await response.json()) as DelhiveryChargeResponse
  return data[0]?.zone?.trim().toUpperCase() ?? null
}

export async function estimateDeliveryForPinCode(
  rawPinCode: string,
  weightGrams = DEFAULT_WEIGHT_GRAMS,
): Promise<DeliveryEstimate> {
  const pinCode = normalizePinCode(rawPinCode)

  if (pinCode.length !== 6) {
    return {
      serviceable: false,
      prepaid: false,
      pinCode,
      city: null,
      stateCode: null,
      zone: null,
      minDays: 0,
      maxDays: 0,
      estimatedLabel: "",
      message: "Enter a valid 6-digit PIN code.",
    }
  }

  const config = getDelhiveryConfig()
  if (!config) {
    return fallbackEstimate(pinCode)
  }

  try {
    const pincodeData = await fetchPincodeDetails(pinCode, config.apiToken, config.apiBaseUrl)
    const postal = pincodeData.delivery_codes?.[0]?.postal_code

    if (!postal) {
      return {
        serviceable: false,
        prepaid: false,
        pinCode,
        city: null,
        stateCode: null,
        zone: null,
        minDays: 0,
        maxDays: 0,
        estimatedLabel: "",
        message: "Sorry, we cannot deliver to this PIN code yet.",
      }
    }

    const prepaid = postal.pre_paid === "Y"
    const serviceable = prepaid

    if (!serviceable) {
      return {
        serviceable: false,
        prepaid,
        pinCode,
        city: postal.city ?? postal.district ?? null,
        stateCode: postal.state_code ?? null,
        zone: null,
        minDays: 0,
        maxDays: 0,
        estimatedLabel: "",
        message: "This PIN code is not serviceable for prepaid delivery.",
      }
    }

    const originPin = getOriginPinCode()
    let zone: string | null = null

    if (originPin.length === 6) {
      try {
        zone = await fetchShippingZone(
          originPin,
          pinCode,
          config.apiToken,
          config.apiBaseUrl,
          weightGrams,
        )
      } catch (error) {
        console.error("[delhivery/estimate] zone lookup failed", error)
      }
    }

    const transit = zone ? ZONE_TRANSIT_DAYS[zone] ?? ZONE_TRANSIT_DAYS.D : ZONE_TRANSIT_DAYS.D
    const minDays = transit.min + PROCESSING_DAYS
    const maxDays = transit.max + PROCESSING_DAYS
    const estimatedLabel = formatDeliveryRange(minDays, maxDays)
    const cityLabel = postal.city ?? postal.district

    return {
      serviceable: true,
      prepaid,
      pinCode,
      city: cityLabel ?? null,
      stateCode: postal.state_code ?? null,
      zone,
      minDays,
      maxDays,
      estimatedLabel,
      message: cityLabel
        ? `Estimated delivery to ${cityLabel}: ${estimatedLabel}`
        : `Estimated delivery: ${estimatedLabel}`,
    }
  } catch (error) {
    console.error("[delhivery/estimate]", error)
    return fallbackEstimate(pinCode)
  }
}
