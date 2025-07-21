import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { checkAdminAuth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    if (!checkAdminAuth(request)) {
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

export async function POST(request: NextRequest) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { db } = await connectToDatabase()

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
