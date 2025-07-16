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
    return NextResponse.json({ message: "Failed to fetch countries", error }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { db } = await connectToDatabase()
    const countryData: Country = await req.json()

    // Basic validation
    if (!countryData.name || !countryData.code) {
      return NextResponse.json({ message: "Country name and code are required" }, { status: 400 })
    }

    const result = await db.collection<Country>("countries").insertOne({
      ...countryData,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    if (result.acknowledged) {
      const newCountry = await db.collection<Country>("countries").findOne({ _id: result.insertedId })
      return NextResponse.json(newCountry, { status: 201 })
    } else {
      return NextResponse.json({ message: "Failed to add country" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error adding country:", error)
    return NextResponse.json({ message: "Failed to add country", error }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const { db } = await connectToDatabase()
    const { _id, ...countryData }: Country = await req.json()

    if (!_id) {
      return NextResponse.json({ message: "Country ID is required for update" }, { status: 400 })
    }

    const result = await db
      .collection<Country>("countries")
      .updateOne(
        { _id: new (await import("mongodb")).ObjectId(_id) },
        { $set: { ...countryData, updatedAt: new Date() } },
      )

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Country not found" }, { status: 404 })
    }

    const updatedCountry = await db
      .collection<Country>("countries")
      .findOne({ _id: new (await import("mongodb")).ObjectId(_id) })
    return NextResponse.json(updatedCountry, { status: 200 })
  } catch (error) {
    console.error("Error updating country:", error)
    return NextResponse.json({ message: "Failed to update country", error }, { status: 500 })
  }
}
