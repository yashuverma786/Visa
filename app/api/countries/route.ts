import { NextResponse } from "next/server"
import { getCountries } from "@/lib/database"

export async function GET() {
  try {
    console.log("🔍 Fetching countries for frontend...")

    const countries = await getCountries()
    console.log(`✅ Found ${countries.length} countries for frontend`)

    // Add cache headers to ensure fresh data
    const response = NextResponse.json(countries)
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")
    response.headers.set("Pragma", "no-cache")
    response.headers.set("Expires", "0")

    return response
  } catch (error) {
    console.error("❌ Error fetching countries:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
