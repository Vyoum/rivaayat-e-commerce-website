import { NextResponse, type NextRequest } from "next/server"

import { getPrisma } from "@/lib/prisma"
import { uploadSitePageImage } from "@/lib/site-page-media-upload"
import { createSupabaseApiClient } from "@/lib/supabase/server"

async function resolveDbUserId(request: NextRequest) {
  const prisma = getPrisma()
  if (!prisma) return null

  const response = NextResponse.next()
  const supabase = createSupabaseApiClient(request, response)
  if (!supabase) return null

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) return null

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email },
    select: { id: true },
  })

  return dbUser?.id ?? null
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const response = NextResponse.next()

  try {
    const prisma = getPrisma()
    if (!prisma) {
      return NextResponse.json({ error: "Database is unavailable." }, { status: 503 })
    }

    const userId = await resolveDbUserId(request)
    if (!userId) {
      return NextResponse.json({ error: "Sign in to upload photos." }, { status: 401 })
    }

    const { slug } = await params
    const product = await prisma.product.findFirst({
      where: { slug, isPublished: true },
      select: { id: true },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const formData = await request.formData()
    const file = formData.get("file")

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const imageUrl = await uploadSitePageImage(`review-photos/${slug}`, file)
    const jsonResponse = NextResponse.json({ imageUrl })
    response.cookies.getAll().forEach((cookie) => {
      jsonResponse.cookies.set(cookie)
    })
    return jsonResponse
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 400 },
    )
  }
}
