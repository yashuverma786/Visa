import { type NextRequest, NextResponse } from "next/server"
import { isDatabaseAvailable, getCustomers, getCountries } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Testing MongoDB connection...")

    const dbAvailable = await isDatabaseAvailable()

    if (!dbAvailable) {
      return NextResponse.json({
        status: "error",
        message: "Database connection failed",
        timestamp: new Date().toISOString(),
      })
    }

    // Test collections
    const customers = await getCustomers()
    const countries = await getCountries()

    return NextResponse.json({
      status: "success",
      message: "Database connection successful",
      data: {
        customersCount: customers.length,
        countriesCount: countries.length,
        collections: ["customers", "countries", "visa_applications", "testimonials"],
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Database test failed:", error)
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
