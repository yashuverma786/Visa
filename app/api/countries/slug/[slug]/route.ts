import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { sampleCountries } from "@/lib/seed-data"

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params

    // Try to fetch from database first
    try {
      const { db } = await connectToDatabase()
      const country = await db.collection("countries").findOne({ slug: slug })

      if (country) {
        return NextResponse.json({
          ...country,
          _id: country._id.toString(),
        })
      }
    } catch (dbError) {
      console.error("Database error, falling back to sample data:", dbError)
    }

    // Fallback to sample data
    const sampleCountry = sampleCountries.find((c) => c.slug === slug)
    if (sampleCountry) {
      return NextResponse.json({
        ...sampleCountry,
        _id: `sample_${slug}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }

    return NextResponse.json({ error: "Country not found" }, { status: 404 })
  } catch (error) {
    console.error("Error fetching country by slug:", error)
    return NextResponse.json({ error: "Failed to fetch country" }, { status: 500 })
  }
}
