import { NextResponse } from "next/server"

import { requireAdminApi } from "@/lib/admin-auth-server"
import { deleteHeroSlide, updateHeroSlide } from "@/lib/hero-slides"

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireAdminApi()
  if (!auth.ok) return auth.response

  try {
    const { id } = await context.params
    const body = await request.json()
    const slide = await updateHeroSlide(id, body)
    return NextResponse.json({ slide })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update slide" },
      { status: 400 },
    )
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireAdminApi()
  if (!auth.ok) return auth.response

  try {
    const { id } = await context.params
    await deleteHeroSlide(id)
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete slide" },
      { status: 400 },
    )
  }
}
