import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { to, subject, text, html } = body

    // Alternative 1: Use Resend API (recommended)
    if (process.env.RESEND_API_KEY) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "JMT Travel <noreply@journeymytrip.com>",
          to: [to || "journeymytrip@gmail.com"],
          subject: subject || "New Lead from JMT Travel Website",
          text: text,
          html: html,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        return NextResponse.json({
          success: true,
          message: "Email sent successfully via Resend",
          id: result.id,
        })
      } else {
        const error = await response.text()
        return NextResponse.json(
          {
            success: false,
            error: `Resend API error: ${error}`,
          },
          { status: 500 },
        )
      }
    }

    // Alternative 2: Use EmailJS or similar service
    // For now, just log the email content
    console.log("Email would be sent:", {
      to: to || "journeymytrip@gmail.com",
      subject: subject || "New Lead from JMT Travel Website",
      text,
      html,
    })

    return NextResponse.json({
      success: true,
      message: "Email logged successfully (fallback mode)",
      note: "To enable actual email sending, add RESEND_API_KEY environment variable",
    })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
