import { NextResponse } from "next/server"
import { getActiveHeroSlides } from "@/lib/hero-slides"

export async function GET() {
  try {
    const slides = await getActiveHeroSlides()
    return NextResponse.json({ slides })
  } catch {
    return NextResponse.json({ slides: [] }, { status: 500 })
  }
}
