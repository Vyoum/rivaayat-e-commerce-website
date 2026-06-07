export type AdminUserRecord = {
  id: string
  authUserId: string | null
  name: string
  email: string
  phone: string | null
  avatarUrl: string | null
  patronSince: string
  lastSignInAt: string | null
  createdAt: string
  orderCount: number
  provider: string | null
  recentlyActive: boolean
}

export type AdminUsersSummary = {
  total: number
  recentlyActive: number
  preview: AdminUserRecord[]
}
