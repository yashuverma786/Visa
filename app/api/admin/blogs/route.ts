import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const client = await connectToDatabase()
    const db = client.db("jmt_travel")
    const blogs = await db.collection("blogs").find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(blogs)
  } catch (error) {
    console.error("Error fetching blogs:", error)
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validation
    if (!body.title || !body.content || !body.author) {
      return NextResponse.json({ error: "Title, content, and author are required" }, { status: 400 })
    }

    const client = await connectToDatabase()
    const db = client.db("jmt_travel")

    // Check if slug already exists
    if (body.slug) {
      const existingBlog = await db.collection("blogs").findOne({ slug: body.slug })
      if (existingBlog) {
        return NextResponse.json({ error: "A blog with this slug already exists" }, { status: 400 })
      }
    }

    const blogData = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: body.published ? new Date() : null,
    }

    const result = await db.collection("blogs").insertOne(blogData)
    const newBlog = await db.collection("blogs").findOne({ _id: result.insertedId })

    return NextResponse.json(newBlog, { status: 201 })
  } catch (error) {
    console.error("Error creating blog:", error)
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 })
  }
}
