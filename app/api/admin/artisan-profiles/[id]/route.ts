import { NextResponse } from "next/server"

import { requireAdminApi } from "@/lib/admin-auth-server"
import {
  deleteArtisanProfile,
  updateArtisanProfile,
} from "@/lib/artisan-page-content"

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireAdminApi()
  if (!auth.ok) return auth.response

  try {
    const { id } = await context.params
    const body = await request.json()
    const profile = await updateArtisanProfile(id, body)
    return NextResponse.json({ profile })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update artisan profile" },
      { status: 400 },
    )
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireAdminApi()
  if (!auth.ok) return auth.response

  try {
    const { id } = await context.params
    await deleteArtisanProfile(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete artisan profile" },
      { status: 400 },
    )
  }
}
