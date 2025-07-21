import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import type { Country } from "@/lib/types"

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const { db } = await connectToDatabase()

    const country = await db.collection<Country>("countries").findOne({ slug: slug })

    if (!country) {
      return NextResponse.json({ error: "Country not found" }, { status: 404 })
    }

    return NextResponse.json(country)
  } catch (error) {
    console.error("Error fetching country by slug:", error)
    return NextResponse.json({ message: "Failed to fetch country", error }, { status: 500 })
  }
}
