import { NextResponse } from "next/server"
import { checkAdminAuth } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { Blog } from "@/lib/types"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!checkAdminAuth(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { db } = await connectToDatabase()
    const blogData: Blog = await req.json()

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid blog ID" }, { status: 400 })
    }

    // Basic validation
    if (!blogData.title || !blogData.content) {
      return NextResponse.json({ message: "Title and content are required" }, { status: 400 })
    }

    const updateData = {
      title: blogData.title,
      slug: blogData.slug,
      content: blogData.content,
      excerpt: blogData.excerpt,
      metaTitle: blogData.metaTitle || blogData.title,
      metaDescription: blogData.metaDescription || blogData.excerpt,
      featuredImage: blogData.featuredImage || "",
      featuredImageAlt: blogData.featuredImageAlt || "",
      images: Array.isArray(blogData.images) ? blogData.images : [],
      author: blogData.author,
      tags: Array.isArray(blogData.tags) ? blogData.tags : [],
      published: Boolean(blogData.published),
      publishedAt: blogData.published ? blogData.publishedAt || new Date() : undefined,
      updatedAt: new Date(),
    }

    const result = await db.collection<Blog>("blogs").updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 })
    }

    const updatedBlog = await db.collection<Blog>("blogs").findOne({ _id: new ObjectId(id) })
    return NextResponse.json(updatedBlog, { status: 200 })
  } catch (error) {
    console.error("Error updating blog:", error)
    return NextResponse.json(
      { message: "Failed to update blog", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!checkAdminAuth(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { db } = await connectToDatabase()

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid blog ID" }, { status: 400 })
    }

    const result = await db.collection<Blog>("blogs").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Blog deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting blog:", error)
    return NextResponse.json(
      { message: "Failed to delete blog", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
