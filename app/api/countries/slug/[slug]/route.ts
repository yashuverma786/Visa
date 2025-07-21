import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import type { Country } from "@/lib/types"

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const { db } = await connectToDatabase()

    // Find country by slug
    const country = await db.collection<Country>("countries").findOne({ slug: slug })

    if (!country) {
      return NextResponse.json({ error: "Country not found" }, { status: 404 })
    }

    // Convert MongoDB _id to string
    const processedCountry = {
      ...country,
      _id: country._id?.toString(),
    }

    return NextResponse.json(processedCountry)
  } catch (error) {
    console.error("Error fetching country by slug:", error)
    return NextResponse.json({ error: "Failed to fetch country" }, { status: 500 })
  }
}
