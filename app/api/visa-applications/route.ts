import { type NextRequest, NextResponse } from "next/server"
import { createVisaApplication, createCustomer } from "@/lib/database"
import { sendVisaApplicationEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    console.log("📝 Processing visa application...")

    const data = await request.json()
    console.log("Application data received:", {
      name: data.applicantName,
      email: data.email,
      country: data.country,
      documentsCount: data.documents?.length || 0,
    })

    // Validate required fields
    if (!data.applicantName || !data.email || !data.phone || !data.country || !data.visaCategory) {
      console.log("❌ Missing required fields")
      return NextResponse.json(
        {
          error: "Missing required fields: name, email, phone, country, and visa category are required",
        },
        { status: 400 },
      )
    }

    // Create visa application in database
    const applicationData = {
      ...data,
      visaType: data.visaCategory, // Map visaCategory to visaType for consistency
    }

    const application = await createVisaApplication(applicationData)
    console.log("✅ Visa application created:", application._id)

    // Also save as a customer for unified tracking
    try {
      const customerData = {
        name: data.applicantName,
        email: data.email,
        phone: data.phone,
        placeToVisit: data.country,
        message: `Visa application for ${data.visaCategory}. Additional info: ${data.additionalInfo || "None"}`,
        visaType: data.visaCategory,
        country: data.country,
        documents: data.documents || [],
        source: "visa-application" as const,
      }

      await createCustomer(customerData)
      console.log("✅ Customer record created")
    } catch (customerError) {
      console.error("⚠️ Failed to create customer entry:", customerError)
      // Don't fail the request if customer creation fails
    }

    // Send notification email
    try {
      const emailResult = await sendVisaApplicationEmail(application)
      if (emailResult.success) {
        console.log("✅ Email notification sent successfully")
      } else {
        console.log("⚠️ Email notification failed:", emailResult.error)
      }
    } catch (emailError) {
      console.error("❌ Failed to send email notification:", emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      application: {
        _id: application._id,
        applicantName: application.applicantName,
        country: application.country,
        status: application.status,
      },
      message: "Visa application submitted successfully! We will contact you soon.",
    })
  } catch (error) {
    console.error("❌ Error creating visa application:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to submit application. Please try again.",
      },
      { status: 500 },
    )
  }
}
