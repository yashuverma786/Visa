import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const client = await connectToDatabase()
    const db = client.db("jmt_travel")

    // Only return published blogs for public API
    const blogs = await db.collection("blogs").find({ published: true }).sort({ publishedAt: -1 }).toArray()

    return NextResponse.json(blogs)
  } catch (error) {
    console.error("Error fetching public blogs:", error)
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 })
  }
}
