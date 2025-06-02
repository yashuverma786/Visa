import { type NextRequest, NextResponse } from "next/server"
import { checkAdminAuth } from "@/lib/auth"
import { updateCountry, deleteCountry } from "@/lib/database"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const data = await request.json()
    const success = await updateCountry(params.id, data)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Country not found" }, { status: 404 })
    }
  } catch (error) {
    console.error("Error updating country:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const success = await deleteCountry(params.id)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Country not found" }, { status: 404 })
    }
  } catch (error) {
    console.error("Error deleting country:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
