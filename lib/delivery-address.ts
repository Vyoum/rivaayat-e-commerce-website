export type DeliveryAddress = {
  fullName: string
  email: string
  whatsapp: string
  addressLine1: string
  addressLine2: string
  city: string
  pinCode: string
  state: string
}

export const INITIAL_DELIVERY_ADDRESS: DeliveryAddress = {
  fullName: "",
  email: "",
  whatsapp: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  pinCode: "",
  state: "",
}

export function isDeliveryAddressComplete(address: DeliveryAddress) {
  return (
    address.fullName.trim().length > 0 &&
    address.email.trim().length > 0 &&
    address.whatsapp.trim().length > 0 &&
    address.addressLine1.trim().length > 0 &&
    address.city.trim().length > 0 &&
    address.pinCode.trim().length > 0 &&
    address.state.trim().length > 0
  )
}

export function serializeDeliveryAddress(address: DeliveryAddress) {
  return JSON.stringify(address)
}

export function parseDeliveryAddress(value: string | null | undefined): DeliveryAddress | null {
  if (!value?.trim()) return null

  try {
    const parsed = JSON.parse(value) as Partial<DeliveryAddress>
    if (
      typeof parsed.fullName === "string" &&
      typeof parsed.email === "string" &&
      typeof parsed.whatsapp === "string" &&
      typeof parsed.addressLine1 === "string" &&
      typeof parsed.city === "string" &&
      typeof parsed.pinCode === "string" &&
      typeof parsed.state === "string"
    ) {
      return {
        fullName: parsed.fullName,
        email: parsed.email,
        whatsapp: parsed.whatsapp,
        addressLine1: parsed.addressLine1,
        addressLine2: parsed.addressLine2 ?? "",
        city: parsed.city,
        pinCode: parsed.pinCode,
        state: parsed.state,
      }
    }
  } catch {
    return null
  }

  return null
}
