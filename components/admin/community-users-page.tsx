"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { Loader2, Search, Users, X } from "lucide-react"

import { AdminSidebar } from "./admin-sidebar"
import { AdminTopbar } from "./admin-topbar"
import { CommunitySubnav } from "./community-subnav"
import { getInitials } from "@/lib/profile-utils"
import type { AdminUserRecord } from "@/types/admin-user"

function formatDate(isoDate: string | null) {
  if (!isoDate) return "Never"
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(isoDate))
}

function formatPatronSince(isoDate: string) {
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    year: "numeric",
  }).format(new Date(isoDate))
}

export function CommunityUsersPage() {
  const [users, setUsers] = useState<AdminUserRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const loadUsers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/users")
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to load users")
      setUsers(data.users ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return users
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        (user.phone ?? "").includes(query),
    )
  }, [users, searchQuery])

  const selectedUser = useMemo(
    () => users.find((user) => user.id === selectedUserId) ?? null,
    [users, selectedUserId],
  )

  const recentlyActiveCount = users.filter((user) => user.recentlyActive).length

  function openUser(user: AdminUserRecord) {
    setSelectedUserId(user.id)
    setDrawerOpen(true)
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <div className="ml-[220px] flex min-h-screen flex-1 flex-col bg-[#F5F2ED]">
        <AdminTopbar />

        <main className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-5 flex items-center gap-2">
              <Users className="size-5 text-[#3B5998]" />
              <div>
                <h1 className="font-serif text-[24px] font-semibold text-[#2B1B12]">
                  Registered Users
                </h1>
                <p className="text-[12px] text-[#9A8070]">
                  All accounts that have signed in to the storefront.
                </p>
              </div>
            </div>

            <CommunitySubnav />

            <div className="mb-5 grid grid-cols-3 gap-4">
              <div className="rounded-xl border border-[#EDE5D8] bg-white p-4">
                <p className="text-[12px] text-[#9A8070]">Total Users</p>
                <p className="mt-1 text-[28px] font-semibold text-[#2B1B12]">{users.length}</p>
              </div>
              <div className="rounded-xl border border-[#EDE5D8] bg-white p-4">
                <p className="text-[12px] text-[#9A8070]">Active (24h)</p>
                <p className="mt-1 text-[28px] font-semibold text-[#2B1B12]">{recentlyActiveCount}</p>
              </div>
              <div className="rounded-xl border border-[#EDE5D8] bg-white p-4">
                <p className="text-[12px] text-[#9A8070]">With Orders</p>
                <p className="mt-1 text-[28px] font-semibold text-[#2B1B12]">
                  {users.filter((user) => user.orderCount > 0).length}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <div className="relative">
                <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#9A8070]" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, email, or phone…"
                  className="h-10 w-full rounded-xl border border-[#EDE5D8] bg-white pr-4 pl-10 text-[13px] outline-none focus:border-[#C4A882]"
                />
              </div>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-[#F5C2C0] bg-[#FEF2F2] px-4 py-3 text-[13px] text-[#B42318]">
                {error}
              </div>
            )}

            <div className="overflow-hidden rounded-xl border border-[#EDE5D8] bg-white">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#EDE5D8] bg-[#FAF7F2]">
                    {["User", "Email", "Last Sign In", "Orders", "Status"].map((header) => (
                      <th
                        key={header}
                        className="px-4 py-3 text-left text-[11px] font-semibold tracking-wide text-[#9A8070] uppercase"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-16 text-center">
                        <Loader2 className="mx-auto size-6 animate-spin text-[#9A8070]" />
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-16 text-center text-[13px] text-[#9A8070]">
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr
                        key={`${user.id}-${user.email}`}
                        onClick={() => openUser(user)}
                        className={`cursor-pointer border-b border-[#F5EDE3] transition-colors hover:bg-[#FAF7F2] ${
                          selectedUserId === user.id ? "bg-[#FAF7F2]" : ""
                        }`}
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2.5">
                            {user.avatarUrl ? (
                              <Image
                                src={user.avatarUrl}
                                alt=""
                                width={32}
                                height={32}
                                className="size-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="flex size-8 items-center justify-center rounded-full bg-[#E8D8C3] text-[11px] font-semibold text-[#6B5344]">
                                {getInitials(user.name)}
                              </div>
                            )}
                            <div>
                              <p className="text-[13px] font-medium text-[#2B1B12]">{user.name}</p>
                              {user.provider && (
                                <p className="text-[11px] text-[#9A8070]">via {user.provider}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-[13px] text-[#6B5344]">{user.email}</td>
                        <td className="px-4 py-4 text-[13px] text-[#9A8070]">
                          {formatDate(user.lastSignInAt)}
                        </td>
                        <td className="px-4 py-4 text-[13px] font-medium text-[#2B1B12]">
                          {user.orderCount}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                              user.recentlyActive
                                ? "bg-[#E6F4EA] text-[#1E7E34]"
                                : "bg-[#F0EDE8] text-[#6B5344]"
                            }`}
                          >
                            {user.recentlyActive ? "Active" : "Registered"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {drawerOpen && selectedUser && (
            <div className="flex w-[360px] shrink-0 flex-col border-l border-[#EDE5D8] bg-white shadow-xl">
              <div className="border-b border-[#EDE5D8] p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-bold tracking-wide text-[#9A8070] uppercase">
                      User Details
                    </p>
                    <h2 className="font-serif text-[20px] font-semibold text-[#2B1B12]">
                      {selectedUser.name}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(false)}
                    className="text-[#9A8070] hover:text-[#2B1B12]"
                  >
                    <X className="size-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto p-5">
                <div className="flex flex-col items-center text-center">
                  {selectedUser.avatarUrl ? (
                    <Image
                      src={selectedUser.avatarUrl}
                      alt=""
                      width={72}
                      height={72}
                      className="size-[72px] rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex size-[72px] items-center justify-center rounded-full bg-[#E8D8C3] text-[22px] font-semibold text-[#6B5344]">
                      {getInitials(selectedUser.name)}
                    </div>
                  )}
                  <p className="mt-3 text-[14px] font-medium text-[#2B1B12]">{selectedUser.email}</p>
                  {selectedUser.phone && (
                    <p className="text-[13px] text-[#9A8070]">{selectedUser.phone}</p>
                  )}
                </div>

                <section className="rounded-xl border border-[#EDE5D8] p-4 text-[13px]">
                  <dl className="space-y-3">
                    <div className="flex justify-between gap-4">
                      <dt className="text-[#9A8070]">Patron since</dt>
                      <dd className="font-medium text-[#2B1B12]">
                        {formatPatronSince(selectedUser.patronSince)}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-[#9A8070]">Last sign in</dt>
                      <dd className="text-right font-medium text-[#2B1B12]">
                        {formatDate(selectedUser.lastSignInAt)}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-[#9A8070]">Sign-in method</dt>
                      <dd className="font-medium text-[#2B1B12]">
                        {selectedUser.provider ?? "Email"}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-[#9A8070]">Orders placed</dt>
                      <dd className="font-medium text-[#2B1B12]">{selectedUser.orderCount}</dd>
                    </div>
                  </dl>
                </section>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
