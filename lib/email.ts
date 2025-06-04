import type { VisaApplication } from "./types"

// Check if email configuration is available
const isEmailConfigured = () => {
  return !!(process.env.SMTP_USER && process.env.SMTP_PASS)
}

export async function sendVisaApplicationEmail(application: VisaApplication) {
  if (!isEmailConfigured()) {
    console.log("Email not configured. Application would be sent:", {
      to: "visa@journeymytrip.com",
      subject: `New Visa Application - ${application.applicantName} (${application.country})`,
      application,
    })
    return
  }

  try {
    // Dynamic import to avoid build errors when nodemailer isn't available
    const nodemailer = await import("nodemailer")

    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number.parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const documentsList =
      application.documents?.map((doc) => `- ${doc.name} (${doc.type}) - ${doc.url}`).join("\n") ||
      "No documents uploaded"

    const emailContent = `
      🎯 NEW VISA APPLICATION RECEIVED
      
      Applicant Details:
      - Name: ${application.applicantName}
      - Email: ${application.email}
      - Phone: ${application.phone}
      - Date of Birth: ${application.dateOfBirth || "Not provided"}
      - Nationality: ${application.nationality || "Not provided"}
      - Passport Number: ${application.passportNumber || "Not provided"}
      - Country: ${application.country}
      - Visa Category: ${application.visaCategory}
      - Travel Date: ${application.travelDate || "Not specified"}
      - Purpose: ${application.purpose || "Not specified"}
      
      Documents Submitted:
      ${documentsList}
      
      Additional Information:
      ${application.additionalInfo || "None provided"}
      
      Application submitted at: ${new Date(application.submittedAt).toLocaleString()}
      
      Please review the application in the admin console.
    `

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: "visa@journeymytrip.com",
      subject: `🎯 New Visa Application - ${application.applicantName} (${application.country})`,
      text: emailContent,
      html: emailContent.replace(/\n/g, "<br>"),
    }

    await transporter.sendMail(mailOptions)
    console.log("Email sent successfully to visa@journeymytrip.com")
  } catch (error) {
    console.error("Error sending email:", error)
    // Don't throw error, just log it
  }
}

export async function sendLeadNotificationEmail(lead: any) {
  if (!isEmailConfigured()) {
    console.log("Email not configured. Lead notification would be sent:", {
      to: "visa@journeymytrip.com",
      subject: `New Lead - ${lead.name}`,
      lead,
    })
    return
  }

  try {
    const nodemailer = await import("nodemailer")

    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number.parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const documentsList =
      lead.documents?.map((doc: any) => `- ${doc.name} (${doc.type}) - ${doc.url}`).join("\n") ||
      "No documents uploaded"

    const emailContent = `
      📧 NEW FORM LEAD CAPTURED
      
      Lead Details:
      - Name: ${lead.name}
      - Email: ${lead.email}
      - Phone: ${lead.phone}
      - Visa Type: ${lead.visaType || "Not specified"}
      - Country: ${lead.country || lead.placeToVisit || "Not specified"}
      - Message: ${lead.message || "No message"}
      - Source: ${lead.source || "Website"}
      
      Documents Submitted:
      ${documentsList}
      
      Lead captured at: ${new Date(lead.createdAt).toLocaleString()}
    `

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: "visa@journeymytrip.com",
      subject: `📧 New Lead - ${lead.name}`,
      text: emailContent,
      html: emailContent.replace(/\n/g, "<br>"),
    }

    await transporter.sendMail(mailOptions)
    console.log("Lead notification sent successfully to visa@journeymytrip.com")
  } catch (error) {
    console.error("Error sending lead notification email:", error)
    // Don't throw error, just log it
  }
}

export async function sendPopupLeadEmail(lead: any) {
  if (!isEmailConfigured()) {
    console.log("Email not configured. Popup lead would be sent:", {
      to: "visa@journeymytrip.com",
      subject: `🎯 New Popup Lead - ${lead.name}`,
      lead,
    })
    return
  }

  try {
    const nodemailer = await import("nodemailer")

    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number.parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const emailContent = `
      🎯 NEW POPUP LEAD CAPTURED
      
      Lead Details:
      - Name: ${lead.name}
      - Email: ${lead.email}
      - Phone: ${lead.phone}
      - Place to Visit: ${lead.placeToVisit}
      - Source: Website Popup
      
      Lead captured at: ${new Date(lead.createdAt).toLocaleString()}
      
      ⚡ This is a hot lead from the website popup! Contact immediately for best conversion.
    `

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: "visa@journeymytrip.com",
      subject: `🎯 New Popup Lead - ${lead.name} (${lead.placeToVisit})`,
      text: emailContent,
      html: emailContent.replace(/\n/g, "<br>"),
    }

    await transporter.sendMail(mailOptions)
    console.log("Popup lead notification sent successfully to visa@journeymytrip.com")
  } catch (error) {
    console.error("Error sending popup lead notification email:", error)
  }
}
