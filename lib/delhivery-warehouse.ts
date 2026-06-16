import type { DelhiveryConfig } from "@/lib/delhivery"

type WarehouseEnsureResult = {
  ok: boolean
  error?: string
  created?: boolean
}

let warehouseReady = false

function getWarehousePayload(config: DelhiveryConfig) {
  const name = config.pickupLocation
  const phone = process.env.DELHIVERY_PICKUP_PHONE?.trim()
  const email = process.env.DELHIVERY_PICKUP_EMAIL?.trim()
  const address = process.env.DELHIVERY_PICKUP_ADDRESS?.trim()
  const city = process.env.DELHIVERY_PICKUP_CITY?.trim()
  const pin = process.env.DELHIVERY_ORIGIN_PINCODE?.trim()
  const state = process.env.DELHIVERY_PICKUP_STATE?.trim()
  const registeredName =
    process.env.DELHIVERY_REGISTERED_NAME?.trim() || name

  if (!phone || !email || !address || !city || !pin || !state) {
    return null
  }

  return {
    name,
    phone: phone.replace(/\D/g, "").slice(-10),
    email,
    address,
    city,
    pin,
    country: "India",
    registered_name: registeredName,
    return_address: address,
    return_pin: pin,
    return_city: city,
    return_state: state,
    return_country: "India",
  }
}

export async function ensureDelhiveryPickupWarehouse(
  config: DelhiveryConfig,
): Promise<WarehouseEnsureResult> {
  if (warehouseReady) {
    return { ok: true }
  }

  const payload = getWarehousePayload(config)
  if (!payload) {
    // Warehouse may already exist in Delhivery (registered manually or earlier).
    return { ok: true, created: false }
  }

  try {
    const response = await fetch(`${config.apiBaseUrl}/api/backend/clientwarehouse/create/`, {
      method: "POST",
      headers: {
        Authorization: `Token ${config.apiToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    const raw = (await response.json()) as {
      success?: boolean
      error?: string
      data?: { message?: string; name?: string }
    }

    const message = `${raw.error ?? ""} ${raw.data?.message ?? ""}`.toLowerCase()

    if (response.ok && raw.success !== false) {
      warehouseReady = true
      return { ok: true, created: true }
    }

    if (
      message.includes("already") ||
      message.includes("exists") ||
      message.includes("duplicate")
    ) {
      warehouseReady = true
      return { ok: true, created: false }
    }

    return {
      ok: false,
      error: raw.error || raw.data?.message || `Warehouse registration failed (${response.status})`,
    }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Warehouse registration request failed.",
    }
  }
}

export function markDelhiveryWarehouseReady() {
  warehouseReady = true
}
