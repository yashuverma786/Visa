import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import type { Country } from "@/lib/types"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const countries = await db.collection<Country>("countries").find({}).toArray()
    return NextResponse.json(countries)
  } catch (error) {
    console.error("Error fetching countries:", error)
    return NextResponse.json({ error: "Failed to fetch countries" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { db } = await connectToDatabase()
    const countryData: Omit<Country, "_id"> = await req.json()

    // Basic validation
    if (!countryData.name || !countryData.code) {
      return NextResponse.json({ error: "Country name and code are required" }, { status: 400 })
    }

    if (!countryData.description) {
      return NextResponse.json({ error: "Description is required" }, { status: 400 })
    }

    if (!countryData.visaCategories || countryData.visaCategories.length === 0) {
      return NextResponse.json({ error: "At least one visa category is required" }, { status: 400 })
    }

    // Check if country already exists
    const existingCountry = await db.collection<Country>("countries").findOne({
      $or: [{ code: countryData.code.toUpperCase() }, { slug: countryData.slug }],
    })

    if (existingCountry) {
      return NextResponse.json({ error: "Country with this code or slug already exists" }, { status: 400 })
    }

    const result = await db.collection<Country>("countries").insertOne({
      ...countryData,
      code: countryData.code.toUpperCase(),
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    if (result.acknowledged) {
      const newCountry = await db.collection<Country>("countries").findOne({ _id: result.insertedId })
      return NextResponse.json(newCountry, { status: 201 })
    } else {
      return NextResponse.json({ error: "Failed to add country" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error adding country:", error)
    return NextResponse.json({ error: "Failed to add country" }, { status: 500 })
  }
}
