import { type NextRequest, NextResponse } from "next/server"
import { createVisaApplication } from "@/lib/database"
import { sendVisaApplicationEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.applicantName || !data.email || !data.phone || !data.country || !data.visaType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create visa application in database
    const application = await createVisaApplication(data)

    // Send notification email
    try {
      await sendVisaApplicationEmail(application)
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({ success: true, application })
  } catch (error) {
    console.error("Error creating visa application:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
