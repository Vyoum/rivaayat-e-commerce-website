import type { DeliveryAddress } from "@/lib/delivery-address"

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

function buildShipmentAddress(delivery: DeliveryAddress) {
  const line2 = delivery.addressLine2.trim()
  return line2
    ? `${delivery.addressLine1.trim()}, ${line2}`
    : delivery.addressLine1.trim()
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

  const payload = {
    shipments: [
      {
        name: input.delivery.fullName.trim(),
        add: buildShipmentAddress(input.delivery),
        pin: input.delivery.pinCode.trim(),
        city: input.delivery.city.trim(),
        state: input.delivery.state.trim(),
        country: "India",
        phone,
        order: input.orderId,
        payment_mode: "Prepaid",
        products_desc: input.productsDesc.slice(0, 240),
        quantity: "1",
        total_amount: String(Math.max(1, Math.round(input.totalAmount))),
        weight: String(input.weightKg ?? 0.5),
        seller_gst_tin: config.sellerGstTin,
        hsn_code: config.hsnCode,
        shipping_mode: "Surface",
        address_type: "home",
      },
    ],
    pickup_location: {
      name: config.pickupLocation,
    },
  }

  const body = `format=json&data=${JSON.stringify(payload)}`

  try {
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
      error?: string
      rmk?: string
      packages?: Array<{ waybill?: string; status?: string; remarks?: string[] }>
    }

    if (!response.ok) {
      return {
        ok: false,
        error: raw.error ?? raw.rmk ?? `Delhivery API error (${response.status})`,
        raw,
      }
    }

    const firstPackage = raw.packages?.[0]
    const waybill = firstPackage?.waybill?.trim()

    if (!waybill) {
      return {
        ok: false,
        error:
          firstPackage?.remarks?.join(", ") ??
          raw.rmk ??
          raw.error ??
          "Delhivery did not return a waybill.",
        raw,
      }
    }

    return {
      ok: true,
      waybill,
      status: firstPackage?.status ?? "created",
      raw,
    }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Delhivery request failed.",
    }
  }
}

function deliveryPhone(value: string) {
  const digits = value.replace(/\D/g, "")
  if (digits.length === 10) return digits
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2)
  return digits.length >= 10 ? digits.slice(-10) : ""
}
