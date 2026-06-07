import { NextResponse } from "next/server"

import { requireAdminApi } from "@/lib/admin-auth-server"
import { getOurStoryContent, updateOurStoryContent } from "@/lib/our-story-content"

export async function GET() {
  const auth = await requireAdminApi()
  if (!auth.ok) return auth.response

  try {
    const content = await getOurStoryContent()
    return NextResponse.json({ content })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load Our Story content" },
      { status: 500 },
    )
  }
}

export async function PATCH(request: Request) {
  const auth = await requireAdminApi()
  if (!auth.ok) return auth.response

  try {
    const body = await request.json()
    const content = await updateOurStoryContent(body)
    return NextResponse.json({ content })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update Our Story content" },
      { status: 400 },
    )
  }
}
