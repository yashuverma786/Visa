import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { connectToDatabase } from "@/lib/mongodb"
import type { Country as CountryBase } from "@/lib/types"

type Country = Omit<CountryBase, "_id"> & { _id: ObjectId | string }

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { db } = await connectToDatabase()

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid country ID" }, { status: 400 })
    }

    const country = await db.collection<Country>("countries").findOne({ _id: new ObjectId(id) })

    if (!country) {
      return NextResponse.json({ error: "Country not found" }, { status: 404 })
    }

    return NextResponse.json({
      ...country,
      _id: country._id?.toString(),
    })
  } catch (error) {
    console.error("Error fetching country:", error)
    return NextResponse.json({ error: "Failed to fetch country" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { db } = await connectToDatabase()
    const body = await request.json()

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid country ID" }, { status: 400 })
    }

    // Validate required fields
    if (!body.name || !body.slug || !body.description) {
      return NextResponse.json({ error: "Missing required fields: name, slug, description" }, { status: 400 })
    }

    // Check if slug already exists (excluding current country)
    const existingCountry = await db.collection("countries").findOne({
      slug: body.slug,
      _id: { $ne: new ObjectId(id) },
    })
    if (existingCountry) {
      return NextResponse.json({ error: "A country with this slug already exists" }, { status: 400 })
    }

    // Validate visa categories
    if (!body.visaCategories || !Array.isArray(body.visaCategories) || body.visaCategories.length === 0) {
      return NextResponse.json({ error: "At least one visa category is required" }, { status: 400 })
    }

    const updateData = {
      name: body.name.trim(),
      slug: body.slug.trim().toLowerCase(),
      description: body.description.trim(),
      image: body.image || "",
      currency: body.currency || "INR",
      visaCategories: body.visaCategories,
      updatedAt: new Date(),
    }

    const result = await db.collection("countries").updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Country not found" }, { status: 404 })
    }

    return NextResponse.json({
      _id: id,
      ...updateData,
    })
  } catch (error) {
    console.error("Error updating country:", error)
    return NextResponse.json({ error: "Failed to update country" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { db } = await connectToDatabase()

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid country ID" }, { status: 400 })
    }

    const result = await db.collection("countries").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Country not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Country deleted successfully" })
  } catch (error) {
    console.error("Error deleting country:", error)
    return NextResponse.json({ error: "Failed to delete country" }, { status: 500 })
  }
}
