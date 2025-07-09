import { type NextRequest, NextResponse } from "next/server"
import { createLead } from "@/lib/database"
import { sendPopupLeadEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    console.log("🎯 Processing popup lead submission...")

    const data = await request.json()
    console.log("Popup lead data received:", {
      name: data.name,
      email: data.email,
      phone: data.phone,
      placeToVisit: data.placeToVisit,
    })

    // Validate required fields
    if (!data.name || !data.email || !data.phone || !data.placeToVisit) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create lead in database
    const leadData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      placeToVisit: data.placeToVisit,
      message: data.message || "",
      source: "popup" as const,
    }

    const lead = await createLead(leadData)
    console.log("✅ Popup lead created successfully:", lead._id)

    // Send notification email
    try {
      const emailResult = await sendPopupLeadEmail(lead)
      if (emailResult.success) {
        console.log("✅ Popup email notification sent successfully")
      } else {
        console.log("⚠️ Popup email notification failed:", emailResult.error)
      }
    } catch (emailError) {
      console.error("❌ Failed to send popup email notification:", emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({ success: true, lead: { _id: lead._id, name: lead.name } })
  } catch (error) {
    console.error("❌ Error creating popup lead:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
