import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import type { Blog } from "@/lib/types"

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    const blogs = await db.collection<Blog>("blogs").find({}).sort({ createdAt: -1 }).toArray()

    // Convert MongoDB _id to string
    const processedBlogs = blogs.map((blog) => ({
      ...blog,
      _id: blog._id?.toString(),
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
    if (!body.title || !body.content) {
      return NextResponse.json({ error: "Missing required fields: title and content are required" }, { status: 400 })
    }

    // Generate slug from title if not provided
    const slug = body.slug?.trim() || generateSlug(body.title)

    // Check if slug already exists
    const existingBlog = await db.collection("blogs").findOne({ slug: slug })
    if (existingBlog) {
      return NextResponse.json({ error: "A blog with this slug already exists" }, { status: 400 })
    }

    const blogData = {
      title: body.title.trim(),
      slug: slug,
      content: body.content.trim(),
      excerpt: body.excerpt?.trim() || body.content.trim().substring(0, 150) + "...",
      featuredImage: body.featuredImage || "",
      featuredImageAlt: body.featuredImageAlt?.trim() || "",
      metaTitle: body.metaTitle?.trim() || body.title.trim(),
      metaDescription: body.metaDescription?.trim() || body.excerpt?.trim() || body.content.trim().substring(0, 160),
      tags: Array.isArray(body.tags) ? body.tags.filter((tag: string) => tag.trim()) : [],
      published: Boolean(body.published),
      author: body.author?.trim() || "Admin",
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
