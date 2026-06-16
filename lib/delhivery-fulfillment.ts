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
    console.error("[delhivery/fulfillment]", input.orderReference, shipment.error, shipment.raw)
    return { ok: false as const, error: shipment.error ?? "Shipment creation failed." }
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
