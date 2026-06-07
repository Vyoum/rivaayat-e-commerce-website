"use client"

import { createContext, useContext, type ReactNode } from "react"

import type { AdminProfile } from "@/lib/admin-profile-server"

const AdminSessionContext = createContext<AdminProfile | null>(null)

export function AdminSessionProvider({
  profile,
  children,
}: {
  profile: AdminProfile
  children: ReactNode
}) {
  return (
    <AdminSessionContext.Provider value={profile}>{children}</AdminSessionContext.Provider>
  )
}

export function useAdminProfile() {
  return useContext(AdminSessionContext)
}
