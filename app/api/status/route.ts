import { NextResponse } from "next/server"
import { isDatabaseAvailable } from "@/lib/database"
import { config } from "@/lib/config"

export async function GET() {
  const dbAvailable = await isDatabaseAvailable()

  const status = {
    app: "JMT Travel Visa Website",
    timestamp: new Date().toISOString(),
    services: {
      database: {
        available: dbAvailable,
        configured: config.mongodb.isAvailable,
      },
      email: {
        available: config.email.isAvailable,
        configured: config.email.isAvailable,
      },
      blob: {
        available: !!process.env.BLOB_READ_WRITE_TOKEN,
        configured: !!process.env.BLOB_READ_WRITE_TOKEN,
      },
    },
    environment: process.env.NODE_ENV,
  }

  return NextResponse.json(status)
}
