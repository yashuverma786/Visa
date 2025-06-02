import { type NextRequest, NextResponse } from "next/server"
import { checkAdminAuth } from "@/lib/auth"
import { getCountries, createCountry } from "@/lib/database"

export async function GET(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const countries = await getCountries()
    return NextResponse.json(countries)
  } catch (error) {
    console.error("Error fetching countries:", error)
    return NextResponse.json({ error: "Failed to fetch countries" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.code || !data.description || !data.visa) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const country = await createCountry(data)
    return NextResponse.json({ success: true, country })
  } catch (error) {
    console.error("Error creating country:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
