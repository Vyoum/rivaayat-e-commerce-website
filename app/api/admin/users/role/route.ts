import { NextResponse } from "next/server"
import type { UserRole } from "@prisma/client"

import { requireAdminApi, setUserRoleByEmail } from "@/lib/admin-auth-server"

export async function PATCH(request: Request) {
  const auth = await requireAdminApi()
  if (!auth.ok) return auth.response

  try {
    const body = (await request.json()) as { email?: string; role?: UserRole }
    const email = body.email?.trim()
    const role = body.role

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    if (role !== "admin" && role !== "customer") {
      return NextResponse.json({ error: "Role must be admin or customer" }, { status: 400 })
    }

    if (email.toLowerCase() === auth.access.email?.toLowerCase() && role === "customer") {
      return NextResponse.json(
        { error: "You cannot remove your own admin access" },
        { status: 400 },
      )
    }

    const user = await setUserRoleByEmail(email, role)
    return NextResponse.json({ user })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update role" },
      { status: 500 },
    )
  }
}
