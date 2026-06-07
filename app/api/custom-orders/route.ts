import { NextResponse, type NextRequest } from "next/server"

import { getPrisma } from "@/lib/prisma"
import { createSupabaseApiClient } from "@/lib/supabase/server"

type CustomOrderPayload = {
  categoryId: string
  categoryLabel: string
  selections: Record<string, string>
  weight: string
  quantity: string
  notes?: string
  fullName: string
  whatsapp: string
  email: string
}

function buildDescription(payload: CustomOrderPayload) {
  const lines = [
    `Category: ${payload.categoryLabel}`,
    `Weight: ${payload.weight}`,
    `Quantity: ${payload.quantity} box(es)`,
    "",
    "Selections:",
    ...Object.entries(payload.selections).map(([key, value]) => `- ${key}: ${value}`),
  ]

  if (payload.notes?.trim()) {
    lines.push("", `Notes: ${payload.notes.trim()}`)
  }

  lines.push(
    "",
    "Contact:",
    `- Name: ${payload.fullName}`,
    `- WhatsApp: ${payload.whatsapp}`,
    `- Email: ${payload.email}`,
  )

  return lines.join("\n")
}

export async function POST(request: NextRequest) {
  const response = NextResponse.next()

  try {
    const body = (await request.json()) as CustomOrderPayload

    if (!body.fullName?.trim() || !body.whatsapp?.trim() || !body.email?.trim()) {
      return NextResponse.json({ error: "Contact information is required." }, { status: 400 })
    }

    if (!body.categoryLabel || !body.weight || !body.quantity) {
      return NextResponse.json({ error: "Order details are incomplete." }, { status: 400 })
    }

    const prisma = getPrisma()
    if (!prisma) {
      return NextResponse.json({ error: "Database is unavailable." }, { status: 503 })
    }

    let userId: string | null = null

    try {
      const supabase = createSupabaseApiClient(request, response)
      if (supabase) {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (user) {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email ?? "" },
            select: { id: true },
          })
          userId = dbUser?.id ?? null
        }
      }
    } catch {
      // guest checkout is allowed
    }

    const order = await prisma.customOrder.create({
      data: {
        userId,
        description: buildDescription(body),
        status: "pending",
        estimatedDelivery: "5-7 days",
      },
    })

    const jsonResponse = NextResponse.json({ id: order.id, success: true })
    response.cookies.getAll().forEach((cookie) => {
      jsonResponse.cookies.set(cookie)
    })
    return jsonResponse
  } catch (error) {
    console.error("[api/custom-orders]", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to submit custom order" },
      { status: 500 },
    )
  }
}
