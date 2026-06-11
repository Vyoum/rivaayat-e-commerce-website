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
