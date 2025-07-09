import { type NextRequest, NextResponse } from "next/server"
import { isDatabaseAvailable, getLeads, getCountries, getVisaApplications, getTestimonials } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Testing database connection and collections...")

    const dbAvailable = await isDatabaseAvailable()

    if (!dbAvailable) {
      return NextResponse.json({
        status: "error",
        message: "Database connection failed",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        mongoUri: process.env.MONGODB_URI ? "Set" : "Not set",
      })
    }

    // Test all collections
    const [leads, countries, applications, testimonials] = await Promise.all([
      getLeads(),
      getCountries(),
      getVisaApplications(),
      getTestimonials(),
    ])

    return NextResponse.json({
      status: "success",
      message: "Database connection successful",
      data: {
        leads: {
          count: leads.length,
          sample: leads.slice(0, 2).map((l) => ({ name: l.name, source: l.source, createdAt: l.createdAt })),
        },
        countries: {
          count: countries.length,
          sample: countries.slice(0, 2).map((c) => ({ name: c.name, code: c.code })),
        },
        applications: {
          count: applications.length,
          sample: applications.slice(0, 2).map((a) => ({ name: a.applicantName, country: a.country })),
        },
        testimonials: {
          count: testimonials.length,
          sample: testimonials.slice(0, 2).map((t) => ({ name: t.name, rating: t.rating })),
        },
      },
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    })
  } catch (error) {
    console.error("❌ Database test failed:", error)
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
      },
      { status: 500 },
    )
  }
}
