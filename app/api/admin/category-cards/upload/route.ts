import { NextResponse } from "next/server"

import { requireAdminApi } from "@/lib/admin-auth-server"
import { uploadCategoryCardImage } from "@/lib/category-card-media-upload"

export async function POST(request: Request) {
  const auth = await requireAdminApi()
  if (!auth.ok) return auth.response

  try {
    const formData = await request.formData()
    const file = formData.get("file")

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const imageUrl = await uploadCategoryCardImage(file)
    return NextResponse.json({ imageUrl })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 400 },
    )
  }
}
