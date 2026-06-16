import type { DeliveryAddress } from "@/lib/delivery-address"
import { createDelhiveryShipment } from "@/lib/delhivery"
import { getPrisma } from "@/lib/prisma"

export type FulfillOrderWithDelhiveryInput = {
  orderId: string
  orderReference: string
  delivery: DeliveryAddress
  productsDesc: string
  totalAmount: number
  kind: "store" | "custom"
}

function truncateStatus(value: string) {
  return value.slice(0, 240)
}

async function saveDelhiveryFailure(
  kind: "store" | "custom",
  orderId: string,
  error: string,
) {
  const prisma = getPrisma()
  if (!prisma) return

  const status = truncateStatus(`failed: ${error}`)

  if (kind === "store") {
    await prisma.order.update({
      where: { id: orderId },
      data: { delhiveryStatus: status },
    })
  } else {
    await prisma.customOrder.update({
      where: { id: orderId },
      data: { delhiveryStatus: status },
    })
  }
}

export async function fulfillOrderWithDelhivery(input: FulfillOrderWithDelhiveryInput) {
  const prisma = getPrisma()
  if (!prisma) {
    return { ok: false as const, error: "Database unavailable." }
  }

  const shipment = await createDelhiveryShipment({
    orderId: input.orderReference,
    delivery: input.delivery,
    productsDesc: input.productsDesc,
    totalAmount: input.totalAmount,
  })

  if (!shipment.ok || !shipment.waybill) {
    const error = shipment.error ?? "Shipment creation failed."
    console.error("[delhivery/fulfillment]", input.orderReference, error, shipment.raw)
    await saveDelhiveryFailure(input.kind, input.orderId, error)
    return { ok: false as const, error }
  }

  if (input.kind === "store") {
    await prisma.order.update({
      where: { id: input.orderId },
      data: {
        status: "processing",
        delhiveryWaybill: shipment.waybill,
        delhiveryStatus: shipment.status ?? "created",
      },
    })
  } else {
    await prisma.customOrder.update({
      where: { id: input.orderId },
      data: {
        status: "processing",
        delhiveryWaybill: shipment.waybill,
        delhiveryStatus: shipment.status ?? "created",
      },
    })
  }

  return {
    ok: true as const,
    waybill: shipment.waybill,
    status: shipment.status,
  }
}
