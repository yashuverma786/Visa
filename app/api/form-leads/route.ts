import { type NextRequest, NextResponse } from "next/server"
import { createLead } from "@/lib/database"
import { sendLeadNotificationEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.email || !data.phone) {
      return NextResponse.json({ error: "Missing required fields: name, email, phone" }, { status: 400 })
    }

    // Create lead in database with file information
    const leadData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      placeToVisit: data.placeToVisit || data.country || "Not specified",
      message: data.message || "",
      visaType: data.visaType || "",
      country: data.country || "",
      documents: data.documents || [], // File metadata
      source: "form" as const,
    }

    const lead = await createLead(leadData)

    // Send notification email
    try {
      await sendLeadNotificationEmail(lead)
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({ success: true, lead })
  } catch (error) {
    console.error("Error creating form lead:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
