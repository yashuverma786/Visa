import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    message: "Resend Email Service Setup Instructions",
    steps: [
      "1. Sign up at https://resend.com (free tier: 3000 emails/month)",
      "2. Get your API key from dashboard",
      "3. Add to Vercel environment variables:",
      "   RESEND_API_KEY=re_xxxxxxxxxx",
      "4. Install resend: npm install resend",
      "5. Use Resend instead of SMTP for better deliverability",
    ],
    benefits: [
      "✅ No SMTP configuration needed",
      "✅ Better deliverability rates",
      "✅ Built-in analytics",
      "✅ Easy setup with Vercel",
      "✅ Free tier available",
    ],
    currentIssue: "Gmail SMTP requires App Password (not regular password)",
    gmailFix: [
      "1. Enable 2-Factor Authentication on Gmail",
      "2. Go to https://myaccount.google.com/apppasswords",
      "3. Generate App Password for 'Mail'",
      "4. Use App Password as SMTP_PASS (16 characters, no spaces)",
    ],
  })
}
