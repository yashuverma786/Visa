import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import type { Country } from "@/lib/types"

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    // Fetch all published countries
    const countries = await db.collection<Country>("countries").find({}).sort({ name: 1 }).toArray()

    // Convert MongoDB _id to string and ensure proper structure
    const processedCountries = countries.map((country) => ({
      ...country,
      _id: country._id?.toString(),
      slug:
        country.slug ||
        country.name
          .toLowerCase()
          .replace(/[^a-z0-9 -]/g, "")
          .replace(/\s+/g, "-"),
    }))

    return NextResponse.json(processedCountries)
  } catch (error) {
    console.error("Error fetching countries:", error)
    return NextResponse.json({ error: "Failed to fetch countries" }, { status: 500 })
  }
}
