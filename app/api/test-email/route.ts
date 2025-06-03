import { NextResponse } from "next/server"
import { sendLeadNotificationEmail } from "@/lib/email"

export async function POST() {
  try {
    const testLead = {
      name: "Test User",
      email: "test@example.com",
      phone: "+91 9876543210",
      placeToVisit: "USA",
      message: "This is a test email to verify email configuration",
      source: "test",
      createdAt: new Date(),
    }

    await sendLeadNotificationEmail(testLead)

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully to ravi@journeymytrip.com",
    })
  } catch (error) {
    console.error("Test email failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
