import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("🧪 Testing email configuration...")

    // Check if email environment variables are set
    const emailConfig = {
      SMTP_HOST: process.env.SMTP_HOST,
      SMTP_PORT: process.env.SMTP_PORT,
      SMTP_USER: process.env.SMTP_USER,
      SMTP_PASS: process.env.SMTP_PASS ? "***SET***" : undefined,
    }

    console.log("Email config:", emailConfig)

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return NextResponse.json({
        success: false,
        error: "Email configuration incomplete",
        config: emailConfig,
        message: "Please set SMTP_HOST, SMTP_USER, and SMTP_PASS environment variables",
      })
    }

    // Test email sending without importing nodemailer at the top level
    try {
      const { sendVisaApplicationEmail } = await import("@/lib/email")

      const testApplication = {
        _id: "test-id",
        applicantName: "Test User",
        email: "test@example.com",
        phone: "1234567890",
        country: "Test Country",
        visaCategory: "Test Visa",
        submittedAt: new Date(),
        status: "pending",
        documents: [],
      }

      const result = await sendVisaApplicationEmail(testApplication)

      return NextResponse.json({
        success: result.success,
        error: result.error,
        config: emailConfig,
        message: result.success ? "Test email sent successfully!" : "Failed to send test email",
        details: result.error || "Email configuration appears to be working",
      })
    } catch (emailError) {
      console.error("Email test error:", emailError)
      return NextResponse.json({
        success: false,
        error: "Email system error",
        config: emailConfig,
        details: emailError instanceof Error ? emailError.message : "Unknown email error",
      })
    }
  } catch (error) {
    console.error("Test email debug error:", error)
    return NextResponse.json({
      success: false,
      error: "Test failed",
      details: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
