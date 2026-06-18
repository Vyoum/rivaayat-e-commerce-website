import type { DeliveryAddress } from "@/lib/delivery-address"
import { ensureDelhiveryPickupWarehouse, markDelhiveryWarehouseReady } from "@/lib/delhivery-warehouse"

export type DelhiveryConfig = {
  apiToken: string
  pickupLocation: string
  sellerGstTin: string
  sellerName: string
  sellerAddress: string
  hsnCode: string
  apiBaseUrl: string
  returnPin: string
  returnCity: string
  returnState: string
  returnPhone: string
  returnAddress: string
  defaultWeightGms: number
}

export type DelhiveryShipmentInput = {
  orderId: string
  delivery: DeliveryAddress
  productsDesc: string
  totalAmount: number
  weightKg?: number
}

export type DelhiveryShipmentResult = {
  ok: boolean
  waybill?: string
  status?: string
  error?: string
  raw?: unknown
}

const DEFAULT_WEIGHT_GMS = 500

export function getDelhiveryConfig(): DelhiveryConfig | null {
  const apiToken = process.env.DELHIVERY_API_TOKEN?.trim()
  const pickupLocation = process.env.DELHIVERY_PICKUP_NAME?.trim()

  if (!apiToken || !pickupLocation) {
    return null
  }

  const parsedWeight = Number(process.env.DELHIVERY_DEFAULT_WEIGHT_GMS?.trim())
  const defaultWeightGms =
    Number.isFinite(parsedWeight) && parsedWeight > 0
      ? Math.round(parsedWeight)
      : DEFAULT_WEIGHT_GMS

  return {
    apiToken,
    pickupLocation,
    sellerGstTin: process.env.DELHIVERY_SELLER_GST_TIN?.trim() ?? "",
    sellerName:
      process.env.DELHIVERY_SELLER_NAME?.trim() ||
      process.env.DELHIVERY_REGISTERED_NAME?.trim() ||
      pickupLocation,
    sellerAddress: process.env.DELHIVERY_PICKUP_ADDRESS?.trim() ?? "",
    hsnCode: process.env.DELHIVERY_HSN_CODE?.trim() || "7117",
    apiBaseUrl:
      process.env.DELHIVERY_API_BASE_URL?.trim().replace(/\/$/, "") ??
      "https://track.delhivery.com",
    returnPin: process.env.DELHIVERY_ORIGIN_PINCODE?.trim() ?? "",
    returnCity: process.env.DELHIVERY_PICKUP_CITY?.trim() ?? "",
    returnState: process.env.DELHIVERY_PICKUP_STATE?.trim() ?? "",
    returnPhone: process.env.DELHIVERY_PICKUP_PHONE?.trim().replace(/\D/g, "").slice(-10) ?? "",
    returnAddress: process.env.DELHIVERY_PICKUP_ADDRESS?.trim() ?? "",
    defaultWeightGms,
  }
}

function sanitizeDelhiveryText(value: string) {
  return value
    .replace(/\\/g, " ")
    .replace(/[&#%;]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function buildShipmentAddress(delivery: DeliveryAddress) {
  const parts = [delivery.addressLine1, delivery.addressLine2]
    .map((part) => sanitizeDelhiveryText(part))
    .filter(Boolean)
  return parts.join(", ")
}

function deliveryPhone(value: string) {
  const digits = value.replace(/\D/g, "")
  if (digits.length === 10) return digits
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2)
  return digits.length >= 10 ? digits.slice(-10) : ""
}

function weightInGrams(input: DelhiveryShipmentInput, config: DelhiveryConfig) {
  if (typeof input.weightKg === "number" && input.weightKg > 0) {
    return Math.max(100, Math.round(input.weightKg * 1000))
  }
  return config.defaultWeightGms
}

function summarizeDelhiveryRaw(raw: unknown) {
  try {
    const text = JSON.stringify(raw)
    return text.length > 1200 ? `${text.slice(0, 1200)}…` : text
  } catch {
    return String(raw)
  }
}

function logDelhivery(event: string, details: Record<string, unknown>) {
  console.info(`[delhivery] ${event}`, details)
}

function logDelhiveryError(event: string, details: Record<string, unknown>) {
  console.error(`[delhivery] ${event}`, details)
}

type DelhiveryPackage = {
  waybill?: string
  status?: string
  remarks?: string[]
}

type DelhiveryCreateResponse = {
  success?: boolean
  error?: boolean | string
  rmk?: string
  packages?: DelhiveryPackage[]
}

function parseShipmentResponse(raw: DelhiveryCreateResponse) {
  const firstPackage = raw.packages?.[0]
  const waybill = firstPackage?.waybill?.trim()
  const remarks = firstPackage?.remarks?.filter(Boolean).join(", ")
  const packageStatus = firstPackage?.status?.trim().toLowerCase()
  const failed =
    raw.success === false ||
    raw.error === true ||
    packageStatus === "fail" ||
    packageStatus === "failed"

  if (waybill && !failed) {
    return {
      ok: true as const,
      waybill,
      status: firstPackage?.status ?? "created",
    }
  }

  const error =
    remarks ||
    (typeof raw.error === "string" ? raw.error : undefined) ||
    raw.rmk ||
    "Delhivery did not return a waybill."

  return { ok: false as const, error, waybill: waybill || undefined }
}

function buildCreatePayload(config: DelhiveryConfig, input: DelhiveryShipmentInput) {
  const phone = deliveryPhone(input.delivery.whatsapp)
  const address = buildShipmentAddress(input.delivery)
  const city = sanitizeDelhiveryText(input.delivery.city)
  const state = sanitizeDelhiveryText(input.delivery.state)
  const pin = input.delivery.pinCode.replace(/\D/g, "").slice(0, 6)
  const name = sanitizeDelhiveryText(input.delivery.fullName)
  const weight = String(weightInGrams(input, config))

  return {
    shipments: [
      {
        name,
        add: address,
        pin,
        city,
        state,
        country: "India",
        phone,
        order: sanitizeDelhiveryText(input.orderId),
        payment_mode: "Prepaid",
        return_pin: config.returnPin,
        return_city: config.returnCity,
        return_phone: config.returnPhone,
        return_add: config.returnAddress,
        return_state: config.returnState,
        return_country: "India",
        products_desc: sanitizeDelhiveryText(input.productsDesc).slice(0, 240),
        hsn_code: config.hsnCode,
        cod_amount: "",
        order_date: null,
        total_amount: String(Math.max(1, Math.round(input.totalAmount))),
        seller_add: config.sellerAddress,
        seller_name: config.sellerName,
        seller_inv: "",
        quantity: "1",
        waybill: "",
        shipment_width: "100",
        shipment_height: "100",
        weight,
        shipping_mode: "Surface",
        address_type: "home",
        fragile_shipment: false,
        dangerous_good: false,
        plastic_packaging: false,
      },
    ],
    pickup_location: {
      name: config.pickupLocation,
    },
  }
}

async function postDelhiveryShipment(
  config: DelhiveryConfig,
  payload: ReturnType<typeof buildCreatePayload>,
  orderReference: string,
) {
  const body = `format=json&data=${encodeURIComponent(JSON.stringify(payload))}`

  const response = await fetch(`${config.apiBaseUrl}/api/cmu/create.json`, {
    method: "POST",
    headers: {
      Authorization: `Token ${config.apiToken}`,
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  })

  let raw: DelhiveryCreateResponse
  try {
    raw = (await response.json()) as DelhiveryCreateResponse
  } catch (error) {
    logDelhiveryError("create.invalid_json", {
      orderReference,
      httpStatus: response.status,
      message: error instanceof Error ? error.message : "Invalid JSON response",
    })
    return {
      ok: false as const,
      error: `Delhivery returned invalid JSON (${response.status}).`,
      raw: null,
    }
  }

  if (!response.ok) {
    const message =
      typeof raw.error === "string"
        ? raw.error
        : raw.rmk ?? `Delhivery API error (${response.status})`
    logDelhiveryError("create.http_error", {
      orderReference,
      httpStatus: response.status,
      error: message,
      raw: summarizeDelhiveryRaw(raw),
    })
    return { ok: false as const, error: message, raw }
  }

  const parsed = parseShipmentResponse(raw)
  if (parsed.ok) {
    logDelhivery("create.success", {
      orderReference,
      waybill: parsed.waybill,
      status: parsed.status,
      pickupLocation: config.pickupLocation,
    })
    return { ok: true as const, waybill: parsed.waybill, status: parsed.status, raw }
  }

  logDelhiveryError("create.manifest_failed", {
    orderReference,
    httpStatus: response.status,
    error: parsed.error,
    waybill: parsed.waybill ?? null,
    raw: summarizeDelhiveryRaw(raw),
  })

  return { ok: false as const, error: parsed.error, waybill: parsed.waybill, raw }
}

export async function createDelhiveryShipment(
  input: DelhiveryShipmentInput,
): Promise<DelhiveryShipmentResult> {
  const config = getDelhiveryConfig()
  if (!config) {
    return {
      ok: false,
      error: "Delhivery is not configured (missing DELHIVERY_API_TOKEN or DELHIVERY_PICKUP_NAME).",
    }
  }

  const orderReference = sanitizeDelhiveryText(input.orderId)
  if (!orderReference) {
    return { ok: false, error: "A unique order reference is required for Delhivery." }
  }

  const phone = deliveryPhone(input.delivery.whatsapp)
  if (!phone) {
    return { ok: false, error: "A valid customer phone number is required for shipping." }
  }

  const address = buildShipmentAddress(input.delivery)
  const city = sanitizeDelhiveryText(input.delivery.city)
  const state = sanitizeDelhiveryText(input.delivery.state)
  const pin = input.delivery.pinCode.replace(/\D/g, "").slice(0, 6)
  const name = sanitizeDelhiveryText(input.delivery.fullName)

  if (!address || !city || !state || pin.length !== 6 || !name) {
    return { ok: false, error: "Complete delivery address is required for shipping." }
  }

  const warehouse = await ensureDelhiveryPickupWarehouse(config)
  if (!warehouse.ok) {
    logDelhiveryError("warehouse.ensure_failed", {
      orderReference,
      error: warehouse.error ?? "Pickup warehouse is not registered.",
    })
    return { ok: false, error: warehouse.error ?? "Pickup warehouse is not registered." }
  }

  const payload = buildCreatePayload(config, { ...input, orderId: orderReference })
  const weightGms = weightInGrams(input, config)

  logDelhivery("create.request", {
    orderReference,
    pickupLocation: config.pickupLocation,
    paymentMode: "Prepaid",
    weightGms,
    destinationPin: pin,
    destinationCity: city,
  })

  try {
    let result = await postDelhiveryShipment(config, payload, orderReference)

    const warehouseMissing =
      !result.ok &&
      result.error?.toLowerCase().includes("clientwarehouse matching query does not exist")

    if (warehouseMissing) {
      logDelhiveryError("warehouse.missing_retry", { orderReference, pickupLocation: config.pickupLocation })
      const retryWarehouse = await ensureDelhiveryPickupWarehouse(config)
      if (retryWarehouse.ok) {
        result = await postDelhiveryShipment(config, payload, orderReference)
      }
    }

    if (result.ok && result.waybill) {
      markDelhiveryWarehouseReady()
      return {
        ok: true,
        waybill: result.waybill,
        status: result.status,
        raw: result.raw,
      }
    }

    return {
      ok: false,
      error: result.error ?? "Delhivery did not return a waybill.",
      raw: result.raw,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Delhivery request failed."
    logDelhiveryError("create.request_failed", { orderReference, error: message })
    return {
      ok: false,
      error: message,
    }
  }
}
