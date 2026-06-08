import type { OrderStatus } from "@prisma/client"

import {
  categoryTagColor,
  formatCustomOrderDisplayId,
  formatCustomOrderSummary,
  parseCustomOrderDescription,
} from "@/lib/custom-order-utils"
import { getPrisma } from "@/lib/prisma"

export type CustomOrderKanbanColumnKey = "new" | "assigned" | "ready" | "delivered"

export type CustomOrderKanbanCard = {
  id: string
  displayId: string
  category: string
  tagColor: string
  dueLabel: string
  dueColor: string
  customerName: string
  customerEmail: string
  whatsapp: string
  summary: string
  description: string
  weight: string
  quantity: string
  selections: Record<string, string>
  notes: string
  status: OrderStatus
  artisanId: string | null
  artisanName: string | null
  showAssign: boolean
  createdAt: string
}

export type CustomOrderKanbanColumn = {
  key: CustomOrderKanbanColumnKey
  title: string
  headerBg: string
  badgeBg: string
  cards: CustomOrderKanbanCard[]
}

export type CustomOrderKanbanBoard = {
  columns: CustomOrderKanbanColumn[]
  artisans: { id: string; name: string }[]
}

const columnMeta: Record<
  CustomOrderKanbanColumnKey,
  Pick<CustomOrderKanbanColumn, "title" | "headerBg" | "badgeBg">
> = {
  new: {
    title: "NEW REQUESTS",
    headerBg: "bg-[#E8D5C0]",
    badgeBg: "bg-[#2B1B12] text-white",
  },
  assigned: {
    title: "ARTISAN ASSIGNED",
    headerBg: "bg-[#D4C4A8]",
    badgeBg: "bg-[#6B5344] text-white",
  },
  ready: {
    title: "READY TO SHIP",
    headerBg: "bg-[#C8D5BC]",
    badgeBg: "bg-[#4A6741] text-white",
  },
  delivered: {
    title: "DELIVERED",
    headerBg: "bg-[#D5C4C0]",
    badgeBg: "bg-[#6B5344] text-white",
  },
}

function getKanbanColumn(status: OrderStatus, artisanId: string | null): CustomOrderKanbanColumnKey {
  if (status === "delivered") return "delivered"
  if (status === "shipped") return "ready"
  if (status === "confirmed" || status === "processing") return "assigned"
  if (status === "pending" && artisanId) return "assigned"
  return "new"
}

function formatDueLabel(estimatedDelivery: string | null, status: OrderStatus) {
  if (status === "delivered") return "Completed"
  if (status === "shipped") return "Ready to ship"
  if (estimatedDelivery) return `Est. ${estimatedDelivery}`
  return "New request"
}

function dueColorForStatus(status: OrderStatus) {
  if (status === "pending") return "text-[#C5221F]"
  if (status === "confirmed" || status === "processing") return "text-[#B95000]"
  return "text-[#6B5344]"
}

function mapOrderToCard(order: {
  id: string
  description: string
  status: OrderStatus
  estimatedDelivery: string | null
  createdAt: Date
  artisanId: string | null
  artisan: { name: string } | null
}): CustomOrderKanbanCard {
  const parsed = parseCustomOrderDescription(order.description)
  const category = parsed.category || "Custom Order"
  const column = getKanbanColumn(order.status, order.artisanId)

  return {
    id: order.id,
    displayId: formatCustomOrderDisplayId(order.id),
    category,
    tagColor: categoryTagColor(category),
    dueLabel: formatDueLabel(order.estimatedDelivery, order.status),
    dueColor: dueColorForStatus(order.status),
    customerName: parsed.contactName || "Guest customer",
    customerEmail: parsed.email,
    whatsapp: parsed.whatsapp,
    summary: formatCustomOrderSummary(parsed),
    description: order.description,
    weight: parsed.weight,
    quantity: parsed.quantity,
    selections: parsed.selections,
    notes: parsed.notes,
    status: order.status,
    artisanId: order.artisanId,
    artisanName: order.artisan?.name ?? null,
    showAssign: column === "new" && !order.artisanId,
    createdAt: order.createdAt.toISOString(),
  }
}

export async function loadCustomOrderKanbanBoard(): Promise<CustomOrderKanbanBoard> {
  const prisma = getPrisma()
  const emptyColumns = (Object.keys(columnMeta) as CustomOrderKanbanColumnKey[]).map((key) => ({
    key,
    ...columnMeta[key],
    cards: [] as CustomOrderKanbanCard[],
  }))

  if (!prisma) {
    return { columns: emptyColumns, artisans: [] }
  }

  const [orders, artisans] = await Promise.all([
    prisma.customOrder.findMany({
      where: { status: { not: "cancelled" } },
      orderBy: { createdAt: "desc" },
      include: { artisan: true },
    }),
    prisma.artisan.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ])

  const grouped: Record<CustomOrderKanbanColumnKey, CustomOrderKanbanCard[]> = {
    new: [],
    assigned: [],
    ready: [],
    delivered: [],
  }

  for (const order of orders) {
    const card = mapOrderToCard(order)
    const column = getKanbanColumn(order.status, order.artisanId)
    grouped[column].push(card)
  }

  const columns = (Object.keys(columnMeta) as CustomOrderKanbanColumnKey[]).map((key) => ({
    key,
    ...columnMeta[key],
    cards: grouped[key],
  }))

  return { columns, artisans }
}

export async function updateAdminCustomOrder(
  id: string,
  data: { status?: OrderStatus; artisanId?: string | null },
) {
  const prisma = getPrisma()
  if (!prisma) return null

  const existing = await prisma.customOrder.findUnique({ where: { id } })
  if (!existing) return null

  const updateData: { status?: OrderStatus; artisanId?: string | null } = {}

  if (data.artisanId !== undefined) {
    updateData.artisanId = data.artisanId
    if (data.artisanId && existing.status === "pending") {
      updateData.status = "confirmed"
    }
  }

  if (data.status) {
    updateData.status = data.status
  }

  const order = await prisma.customOrder.update({
    where: { id },
    data: updateData,
    include: { artisan: true },
  })

  return mapOrderToCard(order)
}
