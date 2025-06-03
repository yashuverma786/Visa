import { NextResponse } from "next/server"
import { isDatabaseAvailable, getCountries } from "@/lib/database"
import { config } from "@/lib/config"

export async function GET() {
  try {
    const dbAvailable = await isDatabaseAvailable()
    const countries = await getCountries()

    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database: {
        available: dbAvailable,
        configured: config.mongodb.isAvailable,
        uri_exists: !!process.env.MONGODB_URI,
        uri_preview: process.env.MONGODB_URI ? `${process.env.MONGODB_URI.substring(0, 20)}...` : "Not set",
      },
      email: {
        configured: config.email.isAvailable,
        smtp_host: process.env.SMTP_HOST || "Not set",
        smtp_user_exists: !!process.env.SMTP_USER,
        smtp_pass_exists: !!process.env.SMTP_PASS,
      },
      countries: {
        count: countries.length,
        sample: countries
          .slice(0, 2)
          .map((c) => ({ name: c.name, code: c.code, categories: c.visaCategories?.length || 0 })),
      },
    }

    return NextResponse.json(debugInfo)
  } catch (error) {
    return NextResponse.json(
      {
        error: "Debug failed",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
