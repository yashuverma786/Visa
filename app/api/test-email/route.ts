import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("Testing email configuration...")

    // Check if email configuration is available
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.SMTP_HOST) {
      return NextResponse.json({
        success: false,
        error: "Email not configured. Missing SMTP environment variables.",
        config: {
          host: process.env.SMTP_HOST ? "Set" : "Missing",
          user: process.env.SMTP_USER ? "Set" : "Missing",
          pass: process.env.SMTP_PASS ? "Set" : "Missing",
          port: process.env.SMTP_PORT || "587",
        },
        correctConfig: {
          SMTP_HOST: "smtp.gmail.com",
          SMTP_USER: "freemadman098765@gmail.com",
          SMTP_PASS: "goqayaueaopjkvdw",
          SMTP_PORT: "587",
        },
      })
    }

    // Import nodemailer
    const nodemailer = await import("nodemailer")

    // Create transporter
    const transporter = nodemailer.default.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER, // freemadman098765@gmail.com
        pass: process.env.SMTP_PASS, // goqayaueaopjkvdw
      },
      tls: {
        rejectUnauthorized: false,
      },
    })

    // Verify connection
    console.log("Verifying SMTP connection...")
    await transporter.verify()
    console.log("✅ SMTP connection verified successfully")

    // Send test email
    console.log("Sending test email...")
    const result = await transporter.sendMail({
      from: process.env.SMTP_USER, // freemadman098765@gmail.com
      to: "visa@journeymytrip.com",
      subject: "✅ Test Email from JMT Travel Website - Email Working!",
      text: "This is a test email to verify the email configuration is working correctly.",
      html: `
        <h2>✅ Email Configuration Test Successful</h2>
        <p>This is a test email to verify the email configuration is working correctly.</p>
        <p><strong>From:</strong> ${process.env.SMTP_USER}</p>
        <p><strong>App Password Used:</strong> goqayaueaopjkvdw</p>
        <p><strong>Test Time:</strong> ${new Date().toLocaleString()}</p>
        <hr>
        <p><strong>JMT Travel</strong><br>
        D-22 Ground and First Floor Sector 3 Noida 201301 Uttar Pradesh<br>
        Phone: 9312540202, 9599076202, 9717540883<br>
        Email: travel@journeymytrip.com, info@visaa.in</p>
      `,
    })

    console.log("✅ Test email sent successfully:", result.messageId)

    return NextResponse.json({
      success: true,
      message: "🎉 Email test successful! Check visa@journeymytrip.com inbox",
      messageId: result.messageId,
      config: {
        from: process.env.SMTP_USER,
        to: "visa@journeymytrip.com",
        host: "smtp.gmail.com",
        port: "587",
      },
    })
  } catch (error) {
    console.error("Error testing email:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        correctConfig: {
          SMTP_HOST: "smtp.gmail.com",
          SMTP_USER: "freemadman098765@gmail.com",
          SMTP_PASS: "goqayaueaopjkvdw",
          SMTP_PORT: "587",
        },
      },
      { status: 500 },
    )
  }
}
