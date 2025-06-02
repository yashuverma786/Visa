import { type NextRequest, NextResponse } from "next/server"
import { createLead } from "@/lib/database"
import { sendLeadNotificationEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.email || !data.phone || !data.visaType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create lead in database
    const lead = await createLead(data)

    // Send notification email
    try {
      await sendLeadNotificationEmail(lead)
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({ success: true, lead })
  } catch (error) {
    console.error("Error creating lead:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
