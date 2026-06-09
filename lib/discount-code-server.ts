import type { DiscountType as PrismaDiscountType } from "@prisma/client"

import { getPrisma } from "@/lib/prisma"
import type {
  AdminDiscountCode,
  AppliedPromo,
  CreateDiscountCodeInput,
  DiscountType,
  UpdateDiscountCodeInput,
} from "@/types/discount-code"

function normalizeCode(code: string) {
  return code.trim().toUpperCase()
}

function mapDiscountCode(row: {
  id: string
  code: string
  type: PrismaDiscountType
  value: unknown
  minOrderAmount: unknown
  maxUses: number | null
  usedCount: number
  isActive: boolean
  expiresAt: Date | null
  createdAt: Date
  updatedAt: Date
}): AdminDiscountCode {
  return {
    id: row.id,
    code: row.code,
    type: row.type,
    value: Number(row.value),
    minOrderAmount: row.minOrderAmount != null ? Number(row.minOrderAmount) : null,
    maxUses: row.maxUses,
    usedCount: row.usedCount,
    isActive: row.isActive,
    expiresAt: row.expiresAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}

export function calculateDiscountAmount(
  type: DiscountType,
  value: number,
  subtotal: number,
): number {
  if (subtotal <= 0 || value <= 0) return 0

  const amount =
    type === "percentage"
      ? Math.round((subtotal * value) / 100)
      : Math.round(value)

  return Math.min(subtotal, Math.max(0, amount))
}

function formatPromoLabel(type: DiscountType, value: number) {
  return type === "percentage" ? `${value}% off` : `₹${value.toLocaleString("en-IN")} off`
}

type DiscountRow = {
  id: string
  code: string
  type: PrismaDiscountType
  value: unknown
  minOrderAmount: unknown
  maxUses: number | null
  usedCount: number
  isActive: boolean
  expiresAt: Date | null
}

function getValidationError(code: DiscountRow, subtotal: number): string | null {
  if (!code.isActive) return "This promo code is no longer active."
  if (code.expiresAt && code.expiresAt.getTime() < Date.now()) {
    return "This promo code has expired."
  }
  if (code.maxUses != null && code.usedCount >= code.maxUses) {
    return "This promo code has reached its usage limit."
  }
  const minOrder = code.minOrderAmount != null ? Number(code.minOrderAmount) : null
  if (minOrder != null && subtotal < minOrder) {
    return `Minimum order of ₹${minOrder.toLocaleString("en-IN")} required for this code.`
  }
  return null
}

export async function validatePromoCode(
  codeInput: string,
  subtotal: number,
): Promise<{ valid: true; promo: AppliedPromo } | { valid: false; error: string }> {
  const prisma = getPrisma()
  if (!prisma) {
    return { valid: false, error: "Promo codes are unavailable right now." }
  }

  const code = normalizeCode(codeInput)
  if (!code) {
    return { valid: false, error: "Enter a promo code." }
  }

  if (!Number.isFinite(subtotal) || subtotal <= 0) {
    return { valid: false, error: "Add items to your cart before applying a code." }
  }

  const record = await prisma.discountCode.findUnique({ where: { code } })
  if (!record) {
    return { valid: false, error: "Invalid promo code." }
  }

  const validationError = getValidationError(record, subtotal)
  if (validationError) {
    return { valid: false, error: validationError }
  }

  const discountAmount = calculateDiscountAmount(
    record.type,
    Number(record.value),
    subtotal,
  )

  if (discountAmount <= 0) {
    return { valid: false, error: "This promo code does not apply to your cart." }
  }

  return {
    valid: true,
    promo: {
      code: record.code,
      type: record.type,
      value: Number(record.value),
      discountAmount,
      label: formatPromoLabel(record.type, Number(record.value)),
    },
  }
}

export async function incrementPromoUsage(code: string) {
  const prisma = getPrisma()
  if (!prisma) return

  await prisma.discountCode.updateMany({
    where: { code: normalizeCode(code) },
    data: { usedCount: { increment: 1 } },
  })
}

export async function loadAdminDiscountCodes(): Promise<AdminDiscountCode[]> {
  const prisma = getPrisma()
  if (!prisma) return []

  const rows = await prisma.discountCode.findMany({
    orderBy: { createdAt: "desc" },
  })

  return rows.map(mapDiscountCode)
}

export async function createAdminDiscountCode(
  input: CreateDiscountCodeInput,
): Promise<AdminDiscountCode> {
  const prisma = getPrisma()
  if (!prisma) throw new Error("Database is unavailable.")

  const code = normalizeCode(input.code)
  if (!code || code.length < 3) {
    throw new Error("Code must be at least 3 characters.")
  }

  if (!["percentage", "fixed"].includes(input.type)) {
    throw new Error("Invalid discount type.")
  }

  if (!Number.isFinite(input.value) || input.value <= 0) {
    throw new Error("Discount value must be greater than zero.")
  }

  if (input.type === "percentage" && input.value > 100) {
    throw new Error("Percentage discount cannot exceed 100%.")
  }

  const row = await prisma.discountCode.create({
    data: {
      code,
      type: input.type,
      value: input.value,
      minOrderAmount: input.minOrderAmount ?? null,
      maxUses: input.maxUses ?? null,
      isActive: input.isActive ?? true,
      expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
    },
  })

  return mapDiscountCode(row)
}

export async function updateAdminDiscountCode(
  id: string,
  input: UpdateDiscountCodeInput,
): Promise<AdminDiscountCode | null> {
  const prisma = getPrisma()
  if (!prisma) return null

  const data: {
    code?: string
    type?: PrismaDiscountType
    value?: number
    minOrderAmount?: number | null
    maxUses?: number | null
    isActive?: boolean
    expiresAt?: Date | null
  } = {}

  if (input.code !== undefined) data.code = normalizeCode(input.code)
  if (input.type !== undefined) data.type = input.type
  if (input.value !== undefined) data.value = input.value
  if (input.minOrderAmount !== undefined) data.minOrderAmount = input.minOrderAmount
  if (input.maxUses !== undefined) data.maxUses = input.maxUses
  if (input.isActive !== undefined) data.isActive = input.isActive
  if (input.expiresAt !== undefined) {
    data.expiresAt = input.expiresAt ? new Date(input.expiresAt) : null
  }

  const row = await prisma.discountCode.update({
    where: { id },
    data,
  })

  return mapDiscountCode(row)
}

export async function deleteAdminDiscountCode(id: string): Promise<boolean> {
  const prisma = getPrisma()
  if (!prisma) return false

  await prisma.discountCode.delete({ where: { id } })
  return true
}
