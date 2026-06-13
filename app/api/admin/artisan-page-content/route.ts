import { NextResponse } from "next/server"

import { requireAdminApi } from "@/lib/admin-auth-server"
import {
  getAllArtisanProfiles,
  MAX_ARTISAN_PROFILES,
} from "@/lib/artisan-page-content"

export async function GET() {
  const auth = await requireAdminApi()
  if (!auth.ok) return auth.response

  try {
    const profiles = await getAllArtisanProfiles()
    return NextResponse.json({ profiles, max: MAX_ARTISAN_PROFILES })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load artisan page content" },
      { status: 500 },
    )
  }
}
