import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { Blog as BlogBase } from "@/lib/types"

type Blog = BlogBase & { _id: string | ObjectId }

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()
    const body = await req.json()

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 })
    }

    const objectId = new ObjectId(params.id)

    const existingBlog = await db.collection("blogs").findOne({ _id: objectId })

    if (!existingBlog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

   const updatedData = {
  title: body.title,
  content: body.content,
  slug: body.slug,
  excerpt: body.excerpt || "",
  tags: body.tags || [],
  featuredImage: body.featuredImage || existingBlog.featuredImage || null,
  featuredImageAlt: body.featuredImageAlt || existingBlog.featuredImageAlt || "",
  metaTitle: body.metaTitle || existingBlog.metaTitle || "",
  metaDescription: body.metaDescription || existingBlog.metaDescription || "",
  featured: body.featured ?? false,
  published: body.published ?? false,
  publishedAt: body.publishedAt ? new Date(body.publishedAt) : existingBlog.publishedAt || new Date(),
  updatedAt: new Date(),
}

    await db.collection("blogs").updateOne({ _id: objectId }, { $set: updatedData })

    const updatedBlog = await db.collection("blogs").findOne({ _id: objectId })

    return NextResponse.json(updatedBlog)
  } catch (error) {
    console.error("Error updating blog:", error)
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 })
    }

    const objectId = new ObjectId(params.id)

    const result = await db.collection("blogs").deleteOne({ _id: objectId })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Blog deleted successfully" })
  } catch (error) {
    console.error("Error deleting blog:", error)
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 })
  }
}
 