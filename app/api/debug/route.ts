import { NextResponse } from "next/server"

export async function GET() {
  try {
    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      version: "1.0.0",
      status: "healthy",
      database: {
        connected: !!process.env.MONGODB_URI,
        uri: process.env.MONGODB_URI ? "configured" : "not configured",
      },
      email: {
        configured: !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS),
        host: process.env.SMTP_HOST || "not configured",
      },
    }

    return NextResponse.json(debugInfo)
  } catch (error) {
    console.error("Debug error:", error)
    return NextResponse.json({ error: "Debug failed" }, { status: 500 })
  }
}
