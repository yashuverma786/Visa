import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import type { Country } from "@/lib/types"

export async function GET() {
  try {
    const { db } = await connectToDatabase()

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

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.slug || !body.description) {
      return NextResponse.json({ error: "Missing required fields: name, slug, description" }, { status: 400 })
    }

    // Check if slug already exists
    const existingCountry = await db.collection("countries").findOne({ slug: body.slug })
    if (existingCountry) {
      return NextResponse.json({ error: "A country with this slug already exists" }, { status: 400 })
    }

    // Validate visa categories
    if (!body.visaCategories || !Array.isArray(body.visaCategories) || body.visaCategories.length === 0) {
      return NextResponse.json({ error: "At least one visa category is required" }, { status: 400 })
    }

    const countryData = {
      name: body.name.trim(),
      slug: body.slug.trim().toLowerCase(),
      description: body.description.trim(),
      image: body.image || "",
      currency: body.currency || "INR",
      visaCategories: body.visaCategories,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("countries").insertOne(countryData)

    return NextResponse.json({
      _id: result.insertedId.toString(),
      ...countryData,
    })
  } catch (error) {
    console.error("Error creating country:", error)
    return NextResponse.json({ error: "Failed to create country" }, { status: 500 })
  }
}
