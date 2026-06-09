export type DiscountType = "percentage" | "fixed"

export type AdminDiscountCode = {
  id: string
  code: string
  type: DiscountType
  value: number
  minOrderAmount: number | null
  maxUses: number | null
  usedCount: number
  isActive: boolean
  expiresAt: string | null
  createdAt: string
  updatedAt: string
}

export type AppliedPromo = {
  code: string
  type: DiscountType
  value: number
  discountAmount: number
  label: string
}

export type CreateDiscountCodeInput = {
  code: string
  type: DiscountType
  value: number
  minOrderAmount?: number | null
  maxUses?: number | null
  expiresAt?: string | null
  isActive?: boolean
}

export type UpdateDiscountCodeInput = Partial<CreateDiscountCodeInput>
