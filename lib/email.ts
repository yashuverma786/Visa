import type { VisaApplication } from "./types"

// Check if email configuration is available
const isEmailConfigured = () => {
  return !!(process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_HOST)
}

export async function sendVisaApplicationEmail(application: VisaApplication) {
  console.log("Attempting to send visa application email...")

  if (!isEmailConfigured()) {
    console.log("Email not configured. Missing SMTP environment variables.")
    console.log("Required: SMTP_USER, SMTP_PASS, SMTP_HOST")
    console.log("Application would be sent to: visa@journeymytrip.com")
    return { success: false, error: "Email not configured" }
  }

  try {
    // Dynamic import to avoid build errors when nodemailer isn't available
    const nodemailer = await import("nodemailer")

    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: Number.parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false, // Allow self-signed certificates
      },
    })

    // Verify connection
    await transporter.verify()
    console.log("SMTP connection verified successfully")

    const documentsList =
      application.documents && application.documents.length > 0
        ? application.documents
            .map(
              (doc) => `- ${doc.name} (${doc.type}) - Size: ${formatFileSize(doc.size)} - URL: ${doc.url || "No URL"}`,
            )
            .join("\n")
        : "No documents uploaded"

    const emailContent = `
🎯 NEW VISA APPLICATION RECEIVED - JMT TRAVEL

Applicant Details:
- Name: ${application.applicantName || "Not provided"}
- Email: ${application.email || "Not provided"}
- Phone: ${application.phone || "Not provided"}
- Date of Birth: ${application.dateOfBirth || "Not provided"}
- Nationality: ${application.nationality || "Not provided"}
- Passport Number: ${application.passportNumber || "Not provided"}
- Country: ${application.country || "Not provided"}
- Visa Category: ${application.visaCategory || "Not provided"}
- Travel Date: ${application.travelDate || "Not specified"}
- Purpose: ${application.purpose || "Not specified"}

Documents Submitted:
${documentsList}

Additional Information:
${application.additionalInfo || "None provided"}

Application submitted at: ${new Date(application.submittedAt).toLocaleString()}

Please review the application in the admin console.

---
JMT Travel
D-22 Ground and First Floor Sector 3 Noida 201301 Uttar Pradesh
Phone: 9312540202, 9599076202, 9717540883
Email: travel@journeymytrip.com, visa@journeymytrip.com
    `

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: "visa@journeymytrip.com",
      cc: "travel@journeymytrip.com",
      subject: `🎯 New Visa Application - ${application.applicantName} (${application.country})`,
      text: emailContent,
      html: emailContent.replace(/\n/g, "<br>"),
    }

    const result = await transporter.sendMail(mailOptions)
    console.log("Email sent successfully to visa@journeymytrip.com", result.messageId)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error("Error sending visa application email:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function sendLeadNotificationEmail(lead: any) {
  console.log("Attempting to send lead notification email for:", lead.name)

  if (!isEmailConfigured()) {
    console.log("Email not configured. Missing SMTP environment variables.")
    console.log("Lead notification would be sent to: visa@journeymytrip.com")
    return { success: false, error: "Email not configured" }
  }

  try {
    const nodemailer = await import("nodemailer")

    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: Number.parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_PORT === "465",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    })

    // Verify connection
    await transporter.verify()
    console.log("SMTP connection verified for lead notification")

    const documentsList =
      lead.documents && lead.documents.length > 0
        ? lead.documents
            .map(
              (doc: any) =>
                `- ${doc.name} (${doc.type}) - Size: ${formatFileSize(doc.size)} - URL: ${doc.url || "No URL"}`,
            )
            .join("\n")
        : "No documents uploaded"

    const emailContent = `
📧 NEW CUSTOMER LEAD CAPTURED - JMT TRAVEL

Customer Details:
- Name: ${lead.name || "Not provided"}
- Email: ${lead.email || "Not provided"}
- Phone: ${lead.phone || "Not provided"}
- Visa Type: ${lead.visaType || "Not specified"}
- Country/Destination: ${lead.country || lead.placeToVisit || "Not specified"}
- Message: ${lead.message || "No message"}
- Source: ${lead.source || "Website"}

Documents Submitted:
${documentsList}

Lead captured at: ${new Date(lead.createdAt || new Date()).toLocaleString()}

Please follow up with this customer promptly.

---
JMT Travel
D-22 Ground and First Floor Sector 3 Noida 201301 Uttar Pradesh
Phone: 9312540202, 9599076202, 9717540883
Email: travel@journeymytrip.com, visa@journeymytrip.com
    `

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: "visa@journeymytrip.com",
      cc: "travel@journeymytrip.com",
      subject: `📧 New Customer Lead - ${lead.name} (${lead.country || lead.placeToVisit || "Unknown"})`,
      text: emailContent,
      html: emailContent.replace(/\n/g, "<br>"),
    }

    const result = await transporter.sendMail(mailOptions)
    console.log("Lead notification sent successfully to visa@journeymytrip.com", result.messageId)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error("Error sending lead notification email:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function sendPopupLeadEmail(lead: any) {
  console.log("Attempting to send popup lead email for:", lead.name)

  if (!isEmailConfigured()) {
    console.log("Email not configured. Popup lead would be sent to: visa@journeymytrip.com")
    return { success: false, error: "Email not configured" }
  }

  try {
    const nodemailer = await import("nodemailer")

    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: Number.parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_PORT === "465",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    })

    await transporter.verify()

    const emailContent = `
🎯 NEW POPUP LEAD CAPTURED - JMT TRAVEL

Lead Details:
- Name: ${lead.name || "Not provided"}
- Email: ${lead.email || "Not provided"}
- Phone: ${lead.phone || "Not provided"}
- Place to Visit: ${lead.placeToVisit || "Not specified"}
- Source: Website Popup

Lead captured at: ${new Date(lead.createdAt || new Date()).toLocaleString()}

⚡ This is a hot lead from the website popup! Contact immediately for best conversion.

---
JMT Travel
D-22 Ground and First Floor Sector 3 Noida 201301 Uttar Pradesh
Phone: 9312540202, 9599076202, 9717540883
Email: travel@journeymytrip.com, visa@journeymytrip.com
    `

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: "visa@journeymytrip.com",
      cc: "travel@journeymytrip.com",
      subject: `🎯 New Popup Lead - ${lead.name} (${lead.placeToVisit || "Unknown"})`,
      text: emailContent,
      html: emailContent.replace(/\n/g, "<br>"),
    }

    const result = await transporter.sendMail(mailOptions)
    console.log("Popup lead notification sent successfully", result.messageId)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error("Error sending popup lead notification email:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

// Helper function to format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}
