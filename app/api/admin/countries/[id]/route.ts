import { type NextRequest, NextResponse } from "next/server"
import { checkAdminAuth } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"
import type { Country } from "@/lib/types"

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    console.log("Attempting to delete country with ID:", id)

    const { db } = await connectToDatabase()
    const { ObjectId } = require("mongodb")

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid country ID format" }, { status: 400 })
    }

    const result = await db.collection("countries").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount > 0) {
      console.log("Country deleted successfully:", id)
      return NextResponse.json({ success: true })
    } else {
      console.log("Country not found:", id)
      return NextResponse.json({ error: "Country not found" }, { status: 404 })
    }
  } catch (error) {
    console.error("Error deleting country:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const countryData: Partial<Country> = await request.json()

    const { db } = await connectToDatabase()
    const { ObjectId } = require("mongodb")

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid country ID format" }, { status: 400 })
    }

    // Prepare update data (exclude _id from update)
    const { _id, ...updateData } = countryData
    const finalUpdateData = {
      ...updateData,
      updatedAt: new Date(),
    }

    if (countryData.code) {
      finalUpdateData.code = countryData.code.toUpperCase()
    }

    if (countryData.slug) {
      finalUpdateData.slug = countryData.slug.toLowerCase()
    }

    const result = await db.collection("countries").updateOne({ _id: new ObjectId(id) }, { $set: finalUpdateData })

    if (result.modifiedCount > 0) {
      const updatedCountry = await db.collection("countries").findOne({ _id: new ObjectId(id) })
      return NextResponse.json({
        ...updatedCountry,
        _id: updatedCountry?._id?.toString(),
      })
    } else {
      return NextResponse.json({ error: "Country not found or no changes made" }, { status: 404 })
    }
  } catch (error) {
    console.error("Error updating country:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
