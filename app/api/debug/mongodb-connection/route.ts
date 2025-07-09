import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    console.log("🔍 Testing MongoDB connection...")

    // Test basic connection
    const client = await clientPromise
    console.log("✅ MongoDB client connected")

    // Test database access
    const db = client.db("visaadatabase")
    const result = await db.admin().ping()
    console.log("✅ Database ping successful:", result)

    // Test collections access
    const collections = await db.listCollections().toArray()
    console.log(
      "✅ Collections found:",
      collections.map((c) => c.name),
    )

    // Test data access
    const leadsCount = await db.collection("leads").countDocuments()
    const countriesCount = await db.collection("countries").countDocuments()
    const customersCount = await db.collection("customers").countDocuments()

    return NextResponse.json({
      status: "success",
      message: "MongoDB connection successful",
      database: "visaadatabase",
      collections: collections.map((c) => c.name),
      counts: {
        leads: leadsCount,
        countries: countriesCount,
        customers: customersCount,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("❌ MongoDB connection test failed:", error)

    return NextResponse.json(
      {
        status: "error",
        message: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
