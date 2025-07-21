import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import type { Blog } from "@/lib/types"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const blogs = await db.collection<Blog>("blogs").find({}).sort({ createdAt: -1 }).toArray()
    return NextResponse.json(blogs)
  } catch (error) {
    console.error("Error fetching blogs:", error)
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { db } = await connectToDatabase()
    const blogData: Omit<Blog, "_id"> = await req.json()

    // Basic validation
    if (!blogData.title || !blogData.content || !blogData.author) {
      return NextResponse.json({ error: "Title, content, and author are required" }, { status: 400 })
    }

    const result = await db.collection<Blog>("blogs").insertOne({
      ...blogData,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    if (result.acknowledged) {
      const newBlog = await db.collection<Blog>("blogs").findOne({ _id: result.insertedId })
      return NextResponse.json(newBlog, { status: 201 })
    } else {
      return NextResponse.json({ error: "Failed to create blog" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error creating blog:", error)
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 })
  }
}
