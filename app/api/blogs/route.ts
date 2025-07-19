import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import type { Blog } from "@/lib/types"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const blogs = await db
      .collection<Blog>("blogs")
      .find({ published: true })
      .sort({ publishedAt: -1, createdAt: -1 })
      .toArray()

    return NextResponse.json(blogs)
  } catch (error) {
    console.error("Error fetching published blogs:", error)
    return NextResponse.json({ message: "Failed to fetch blogs", error }, { status: 500 })
  }
}
