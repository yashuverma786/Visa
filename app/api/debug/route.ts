import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    // Get collection stats
    const collections = await db.listCollections().toArray()
    const stats = {}

    for (const collection of collections) {
      const count = await db.collection(collection.name).countDocuments()
      stats[collection.name] = count
    }

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      database: "connected",
      collections: stats,
      environment: process.env.NODE_ENV || "development",
    })
  } catch (error) {
    console.error("Debug error:", error)
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        database: "disconnected",
        error: error.message,
        environment: process.env.NODE_ENV || "development",
      },
      { status: 500 },
    )
  }
}
