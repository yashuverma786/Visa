import { type NextRequest, NextResponse } from "next/server"
import { checkAdminAuth } from "@/lib/auth"
import { getCountries, createCountry } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Admin fetching countries...")

    if (!checkAdminAuth(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const countries = await getCountries()
    console.log(`✅ Returning ${countries.length} countries to admin`)

    return NextResponse.json(countries)
  } catch (error) {
    console.error("❌ Error fetching countries for admin:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("🆕 Admin creating new country...")

    if (!checkAdminAuth(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    console.log("Country data received:", {
      name: data.name,
      code: data.code,
      categoriesCount: data.visaCategories?.length,
    })

    // Validate required fields
    if (!data.name || !data.code) {
      return NextResponse.json({ error: "Name and code are required" }, { status: 400 })
    }

    if (!data.visaCategories || data.visaCategories.length === 0) {
      return NextResponse.json({ error: "At least one visa category is required" }, { status: 400 })
    }

    // Validate visa categories
    for (let i = 0; i < data.visaCategories.length; i++) {
      const category = data.visaCategories[i]
      if (!category.name || !category.type || category.price === undefined || !category.processingTime) {
        return NextResponse.json(
          {
            error: `Visa category ${i + 1} is missing required fields (name, type, price, processing time)`,
          },
          { status: 400 },
        )
      }
    }

    const country = await createCountry(data)
    console.log("✅ Country created successfully:", country._id)

    return NextResponse.json(country, { status: 201 })
  } catch (error) {
    console.error("❌ Error creating country:", error)

    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    const statusCode = errorMessage.includes("already exists") ? 409 : 500

    return NextResponse.json({ error: errorMessage }, { status: statusCode })
  }
}
