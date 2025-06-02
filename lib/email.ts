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

    const documentsList = application.documents.map((doc) => `- ${doc.name} (${doc.type})`).join("\n")

    const emailContent = `
      New Visa Application Received
      
      Applicant Details:
      - Name: ${application.applicantName}
      - Email: ${application.email}
      - Phone: ${application.phone}
      - Country: ${application.country}
      - Visa Type: ${application.visaType}
      
      Documents Submitted:
      ${documentsList}
      
      Application submitted at: ${new Date(application.submittedAt).toLocaleString()}
      
      Please review the application in the admin console.
    `

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: "visa@journeymytrip.com",
      subject: `New Visa Application - ${application.applicantName} (${application.country})`,
      text: emailContent,
      html: emailContent.replace(/\n/g, "<br>"),
    }

    await transporter.sendMail(mailOptions)
    console.log("Email sent successfully")
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

    const emailContent = `
      New Lead Captured
      
      Lead Details:
      - Name: ${lead.name}
      - Email: ${lead.email}
      - Phone: ${lead.phone}
      - Visa Type: ${lead.visaType}
      - Country: ${lead.country || "Not specified"}
      - Message: ${lead.message || "No message"}
      
      Lead captured at: ${new Date(lead.createdAt).toLocaleString()}
    `

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: "visa@journeymytrip.com",
      subject: `New Lead - ${lead.name}`,
      text: emailContent,
      html: emailContent.replace(/\n/g, "<br>"),
    }

    await transporter.sendMail(mailOptions)
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
  } catch (error) {
    console.error("Error sending popup lead notification email:", error)
  }
}
