import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { isAuthenticated } from "@/lib/auth"

export async function GET() {
  try {
    const authenticated = await isAuthenticated()
    if (!authenticated) {
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

export async function DELETE(request: Request) {
  try {
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await request.json()
    const { db } = await connectToDatabase()

    await db.collection("visa_applications").deleteOne({ _id: id })

    return NextResponse.json({ message: "Application deleted successfully" })
  } catch (error) {
    console.error("Error deleting application:", error)
    return NextResponse.json({ error: "Failed to delete application" }, { status: 500 })
  }
}
