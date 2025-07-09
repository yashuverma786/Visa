import { type NextRequest, NextResponse } from "next/server"
import { createLead } from "@/lib/database"
import { sendLeadNotificationEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    console.log("📧 Processing lead submission...")

    const data = await request.json()
    console.log("Lead data received:", {
      name: data.name,
      email: data.email,
      phone: data.phone,
      source: data.source || "hero",
    })

    // Validate required fields
    if (!data.name || !data.email || !data.phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create lead in database
    const leadData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      placeToVisit: data.country || data.placeToVisit || "Not specified",
      message: data.message || "",
      visaType: data.visaType || "",
      country: data.country || "",
      source: (data.source || "hero") as const,
    }

    const lead = await createLead(leadData)
    console.log("✅ Lead created successfully:", lead._id)

    // Send notification email
    try {
      const emailResult = await sendLeadNotificationEmail(lead)
      if (emailResult.success) {
        console.log("✅ Email notification sent successfully")
      } else {
        console.log("⚠️ Email notification failed:", emailResult.error)
      }
    } catch (emailError) {
      console.error("❌ Failed to send email notification:", emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({ success: true, lead: { _id: lead._id, name: lead.name } })
  } catch (error) {
    console.error("❌ Error creating lead:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
