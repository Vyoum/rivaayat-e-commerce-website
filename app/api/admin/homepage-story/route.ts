import { NextResponse } from "next/server"

import { requireAdminApi } from "@/lib/admin-auth-server"
import { getHomepageStory, updateHomepageStory } from "@/lib/homepage-story"

export async function GET() {
  const auth = await requireAdminApi()
  if (!auth.ok) return auth.response

  try {
    const content = await getHomepageStory()
    return NextResponse.json({ content })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load homepage story" },
      { status: 500 },
    )
  }
}

export async function PATCH(request: Request) {
  const auth = await requireAdminApi()
  if (!auth.ok) return auth.response

  try {
    const body = await request.json()
    const content = await updateHomepageStory(body)
    return NextResponse.json({ content })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update homepage story" },
      { status: 400 },
    )
  }
}
