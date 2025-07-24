import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    // Fetch ONLY published blogs
        const blogs = await db
      .collection("blogs")
      .find({}) // <-- sab blogs chahe published ho ya na ho
      .sort({ publishedAt: -1 })
      .toArray()


    return NextResponse.json(blogs)
  } catch (error) {
    console.error("Error fetching public blogs:", error)
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 })
  }
}
