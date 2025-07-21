import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const blogs = await db.collection("blogs").find({}).sort({ createdAt: -1 }).toArray()

    const processedBlogs = blogs.map((blog) => ({
      ...blog,
      _id: blog._id.toString(),
    }))

    return NextResponse.json(processedBlogs)
  } catch (error) {
    console.error("Error fetching blogs:", error)
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.content || !body.author) {
      return NextResponse.json({ error: "Missing required fields: title, content, author" }, { status: 400 })
    }

    // Generate slug from title if not provided
    const slug =
      body.slug ||
      body.title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()

    // Check if slug already exists
    const existingBlog = await db.collection("blogs").findOne({ slug: slug })
    if (existingBlog) {
      return NextResponse.json({ error: "A blog with this slug already exists" }, { status: 400 })
    }

    const blogData = {
      title: body.title.trim(),
      slug: slug,
      excerpt: body.excerpt?.trim() || "",
      content: body.content.trim(),
      author: body.author.trim(),
      tags: body.tags || [],
      featured: body.featured || false,
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("blogs").insertOne(blogData)

    return NextResponse.json({
      _id: result.insertedId.toString(),
      ...blogData,
    })
  } catch (error) {
    console.error("Error creating blog:", error)
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 })
  }
}
