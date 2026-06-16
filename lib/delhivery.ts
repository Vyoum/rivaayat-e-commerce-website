import type { DeliveryAddress } from "@/lib/delivery-address"
import { ensureDelhiveryPickupWarehouse, markDelhiveryWarehouseReady } from "@/lib/delhivery-warehouse"

export type DelhiveryConfig = {
  apiToken: string
  pickupLocation: string
  sellerGstTin: string
  hsnCode: string
  apiBaseUrl: string
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

export function getDelhiveryConfig(): DelhiveryConfig | null {
  const apiToken = process.env.DELHIVERY_API_TOKEN?.trim()
  const pickupLocation = process.env.DELHIVERY_PICKUP_NAME?.trim()

  if (!apiToken || !pickupLocation) {
    return null
  }

  return {
    apiToken,
    pickupLocation,
    sellerGstTin: process.env.DELHIVERY_SELLER_GST_TIN?.trim() ?? "",
    hsnCode: process.env.DELHIVERY_HSN_CODE?.trim() || "7117",
    apiBaseUrl:
      process.env.DELHIVERY_API_BASE_URL?.trim().replace(/\/$/, "") ??
      "https://track.delhivery.com",
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

function parseShipmentResponse(raw: {
  success?: boolean
  error?: boolean | string
  rmk?: string
  packages?: Array<{ waybill?: string; status?: string; remarks?: string[] }>
}) {
  const firstPackage = raw.packages?.[0]
  const waybill = firstPackage?.waybill?.trim()
  const remarks = firstPackage?.remarks?.filter(Boolean).join(", ")
  const failed =
    raw.success === false ||
    raw.error === true ||
    firstPackage?.status?.toLowerCase() === "fail"

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

async function postDelhiveryShipment(config: DelhiveryConfig, payload: object) {
  const body = `format=json&data=${JSON.stringify(payload)}`

  const response = await fetch(`${config.apiBaseUrl}/api/cmu/create.json`, {
    method: "POST",
    headers: {
      Authorization: `Token ${config.apiToken}`,
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  })

  const raw = (await response.json()) as {
    success?: boolean
    error?: boolean | string
    rmk?: string
    packages?: Array<{ waybill?: string; status?: string; remarks?: string[] }>
  }

  if (!response.ok) {
    const message =
      typeof raw.error === "string"
        ? raw.error
        : raw.rmk ?? `Delhivery API error (${response.status})`
    return { ok: false as const, error: message, raw }
  }

  const parsed = parseShipmentResponse(raw)
  if (parsed.ok) {
    return { ok: true as const, waybill: parsed.waybill, status: parsed.status, raw }
  }

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
    return { ok: false, error: warehouse.error ?? "Pickup warehouse is not registered." }
  }

  const payload = {
    shipments: [
      {
        name,
        add: address,
        pin,
        city,
        state,
        country: "India",
        phone,
        order: input.orderId,
        payment_mode: "Pre-paid",
        cod_amount: "0",
        products_desc: sanitizeDelhiveryText(input.productsDesc).slice(0, 240),
        quantity: "1",
        total_amount: String(Math.max(1, Math.round(input.totalAmount))),
        weight: String(input.weightKg ?? 0.5),
        seller_gst_tin: config.sellerGstTin || "URP",
        hsn_code: config.hsnCode,
        shipping_mode: "Surface",
        address_type: "home",
      },
    ],
    pickup_location: {
      name: config.pickupLocation,
    },
  }

  try {
    let result = await postDelhiveryShipment(config, payload)

    const warehouseMissing =
      !result.ok &&
      result.error?.toLowerCase().includes("clientwarehouse matching query does not exist")

    if (warehouseMissing) {
      const retryWarehouse = await ensureDelhiveryPickupWarehouse(config)
      if (retryWarehouse.ok) {
        result = await postDelhiveryShipment(config, payload)
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
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Delhivery request failed.",
    }
  }
}
