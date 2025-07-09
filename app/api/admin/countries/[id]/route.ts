import { type NextRequest, NextResponse } from "next/server"
import { checkAdminAuth } from "@/lib/auth"
import { deleteCountry, updateCountry } from "@/lib/database"

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    console.log("Attempting to delete country with ID:", id)

    const success = await deleteCountry(id)

    if (success) {
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
    const countryData = await request.json()

    const success = await updateCountry(id, countryData)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Country not found" }, { status: 404 })
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
