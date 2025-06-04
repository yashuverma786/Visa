import { NextResponse } from "next/server"
import { isDatabaseAvailable, createLead } from "@/lib/database"
import { sendLeadNotificationEmail } from "@/lib/email"

export async function GET() {
  const results = {
    database: { connected: false, error: null as string | null },
    email: { configured: false, sent: false, error: null as string | null },
    testLead: null as any,
  }

  // Test database connection
  try {
    results.database.connected = await isDatabaseAvailable()
    if (results.database.connected) {
      console.log("✅ Database connection test passed")
    }
  } catch (error) {
    results.database.error = error instanceof Error ? error.message : "Unknown error"
    console.error("❌ Database connection test failed:", error)
  }

  // Test email configuration
  try {
    const hasEmailConfig = !!(process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_HOST)
    results.email.configured = hasEmailConfig

    if (hasEmailConfig) {
      // Create a test lead
      const testLead = {
        name: "Test User",
        email: "test@example.com",
        phone: "+1234567890",
        placeToVisit: "Test Country",
        message: "This is a test submission",
        source: "debug" as const,
      }

      results.testLead = await createLead(testLead)

      // Try to send email
      const emailResult = await sendLeadNotificationEmail(results.testLead)
      results.email.sent = emailResult.success
      if (!emailResult.success) {
        results.email.error = emailResult.error
      }
    } else {
      results.email.error = "Missing SMTP configuration (SMTP_USER, SMTP_PASS, SMTP_HOST)"
    }
  } catch (error) {
    results.email.error = error instanceof Error ? error.message : "Unknown error"
    console.error("❌ Email test failed:", error)
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    results,
    recommendations: [
      !results.database.connected && "Check MONGODB_URI environment variable",
      !results.email.configured && "Set SMTP_USER, SMTP_PASS, and SMTP_HOST environment variables",
      results.email.configured && !results.email.sent && "Check SMTP credentials and server settings",
    ].filter(Boolean),
  })
}
