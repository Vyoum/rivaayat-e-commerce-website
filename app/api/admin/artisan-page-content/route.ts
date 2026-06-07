import { NextResponse } from "next/server"

import { requireAdminApi } from "@/lib/admin-auth-server"
import { getArtisanPageContent, updateArtisanPageContent } from "@/lib/artisan-page-content"

export async function GET() {
  const auth = await requireAdminApi()
  if (!auth.ok) return auth.response

  try {
    const content = await getArtisanPageContent()
    return NextResponse.json({ content })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load artisan page content" },
      { status: 500 },
    )
  }
}

export async function PATCH(request: Request) {
  const auth = await requireAdminApi()
  if (!auth.ok) return auth.response

  try {
    const body = await request.json()
    const content = await updateArtisanPageContent(body)
    return NextResponse.json({ content })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update artisan page content" },
      { status: 400 },
    )
  }
}
