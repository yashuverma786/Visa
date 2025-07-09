import { type NextRequest, NextResponse } from "next/server"
import { checkAdminAuth } from "@/lib/auth"
import { updateVisaApplicationStatus } from "@/lib/database"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { status, notes } = await request.json()

    const success = await updateVisaApplicationStatus(id, status, notes)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }
  } catch (error) {
    console.error("Error updating application:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Add your get application logic here
    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error("Error fetching application:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
