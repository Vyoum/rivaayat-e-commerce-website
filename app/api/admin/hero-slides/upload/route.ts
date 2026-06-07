import { NextResponse } from "next/server"

import { uploadHeroMedia } from "@/lib/hero-media-upload"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file")

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const uploaded = await uploadHeroMedia(file)

    return NextResponse.json({
      imageUrl: uploaded.url,
      mediaType: uploaded.mediaType,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 400 },
    )
  }
}
