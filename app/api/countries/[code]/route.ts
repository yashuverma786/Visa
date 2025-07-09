import { NextResponse } from "next/server"
import { getCountryByCode } from "@/lib/database"

export async function GET(request: Request, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params
    const country = await getCountryByCode(code)

    if (!country) {
      return NextResponse.json({ error: "Country not found" }, { status: 404 })
    }

    return NextResponse.json(country)
  } catch (error) {
    console.error("Error fetching country:", error)
    return NextResponse.json({ error: "Failed to fetch country" }, { status: 500 })
  }
}
