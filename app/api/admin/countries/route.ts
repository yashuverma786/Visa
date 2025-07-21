import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import type { Country } from "@/lib/types"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const countries = await db.collection<Country>("countries").find({}).toArray()

    // Convert MongoDB _id to string for each country
    const processedCountries = countries.map((country) => ({
      ...country,
      _id: country._id?.toString(),
    }))

    return NextResponse.json(processedCountries)
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
    if (!countryData.name || !countryData.code || !countryData.slug) {
      return NextResponse.json({ error: "Country name, code, and slug are required" }, { status: 400 })
    }

    if (!countryData.description) {
      return NextResponse.json({ error: "Description is required" }, { status: 400 })
    }

    if (!countryData.visaCategories || countryData.visaCategories.length === 0) {
      return NextResponse.json({ error: "At least one visa category is required" }, { status: 400 })
    }

    // Check if country already exists
    const existingCountry = await db.collection<Country>("countries").findOne({
      $or: [{ code: countryData.code.toUpperCase() }, { slug: countryData.slug.toLowerCase() }],
    })

    if (existingCountry) {
      return NextResponse.json({ error: "Country with this code or slug already exists" }, { status: 400 })
    }

    // Prepare country data for insertion
    const newCountryData = {
      ...countryData,
      code: countryData.code.toUpperCase(),
      slug: countryData.slug.toLowerCase(),
      currency: countryData.currency || "INR",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection<Country>("countries").insertOne(newCountryData)

    if (result.acknowledged) {
      const newCountry = await db.collection<Country>("countries").findOne({ _id: result.insertedId })
      return NextResponse.json(
        {
          ...newCountry,
          _id: newCountry?._id?.toString(),
        },
        { status: 201 },
      )
    } else {
      return NextResponse.json({ error: "Failed to add country" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error adding country:", error)
    return NextResponse.json({ error: "Failed to add country" }, { status: 500 })
  }
}
