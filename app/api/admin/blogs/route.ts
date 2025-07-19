import { NextResponse } from "next/server"
import { checkAdminAuth } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"
import type { Blog } from "@/lib/types"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const blogs = await db.collection<Blog>("blogs").find({}).sort({ createdAt: -1 }).toArray()
    return NextResponse.json(blogs)
  } catch (error) {
    console.error("Error fetching blogs:", error)
    return NextResponse.json({ message: "Failed to fetch blogs", error }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    if (!checkAdminAuth(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const blogData: Blog = await req.json()

    // Basic validation
    if (!blogData.title || !blogData.content) {
      return NextResponse.json({ message: "Title and content are required" }, { status: 400 })
    }

    // Ensure required fields have default values
    const blogToInsert: Blog = {
      title: blogData.title,
      slug: blogData.slug || blogData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      content: blogData.content,
      excerpt: blogData.excerpt || blogData.content.substring(0, 150) + "...",
      metaTitle: blogData.metaTitle || blogData.title,
      metaDescription: blogData.metaDescription || blogData.excerpt || blogData.content.substring(0, 160),
      featuredImage: blogData.featuredImage || "",
      featuredImageAlt: blogData.featuredImageAlt || "",
      images: Array.isArray(blogData.images) ? blogData.images : [],
      author: blogData.author || "Admin",
      tags: Array.isArray(blogData.tags) ? blogData.tags : [],
      published: Boolean(blogData.published),
      publishedAt: blogData.published ? blogData.publishedAt || new Date() : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection<Blog>("blogs").insertOne(blogToInsert)

    if (result.acknowledged) {
      const newBlog = await db.collection<Blog>("blogs").findOne({ _id: result.insertedId })
      return NextResponse.json(newBlog, { status: 201 })
    } else {
      return NextResponse.json({ message: "Failed to create blog" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error creating blog:", error)
    return NextResponse.json(
      { message: "Failed to create blog", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
