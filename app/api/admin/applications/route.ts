import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: Request) {
  try {
    // Check admin authentication
    const sessionToken = request.headers.get("cookie")?.includes("admin-session")
    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const applications = await db.collection("visa_applications").find({}).sort({ createdAt: -1 }).toArray()

    const processedApplications = applications.map((app) => ({
      ...app,
      _id: app._id.toString(),
    }))

    return NextResponse.json(processedApplications)
  } catch (error) {
    console.error("Error fetching applications:", error)
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const sessionToken = request.headers.get("cookie")?.includes("admin-session")
    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const body = await request.json()

    const applicationData = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: body.status || "pending",
    }

    const result = await db.collection("visa_applications").insertOne(applicationData)

    return NextResponse.json({
      _id: result.insertedId.toString(),
      ...applicationData,
    })
  } catch (error) {
    console.error("Error creating application:", error)
    return NextResponse.json({ error: "Failed to create application" }, { status: 500 })
  }
}
