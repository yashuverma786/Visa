import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { checkAdminAuth } from "@/lib/auth"

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export async function GET(request: NextRequest) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

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

export async function POST(request: NextRequest) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { db } = await connectToDatabase()

    // Validate required fields
    if (!body.title || !body.content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    // Generate slug if not provided
    const slug = body.slug || generateSlug(body.title)

    // Check if slug already exists
    const existingBlog = await db.collection("blogs").findOne({ slug: slug })
    if (existingBlog) {
      return NextResponse.json({ error: "A blog with this slug already exists" }, { status: 400 })
    }

    const blogData = {
      title: body.title.trim(),
      slug: slug,
      excerpt: body.excerpt || "",
      content: body.content.trim(),
      image: body.image || "",
      author: body.author || "JMT Travel Team",
      tags: body.tags || [],
      isPublished: body.isPublished || false,
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
