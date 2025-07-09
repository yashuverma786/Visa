import { type NextRequest, NextResponse } from "next/server"
import { checkAdminAuth } from "@/lib/auth"
import { deleteTestimonial, updateTestimonial } from "@/lib/database"

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const success = await deleteTestimonial(id)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 })
    }
  } catch (error) {
    console.error("Error deleting testimonial:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const testimonialData = await request.json()

    const success = await updateTestimonial(id, testimonialData)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 })
    }
  } catch (error) {
    console.error("Error updating testimonial:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
