import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { id } = params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 })
    }

    // Validation
    if (!body.title || !body.content || !body.author) {
      return NextResponse.json({ error: "Title, content, and author are required" }, { status: 400 })
    }

    const client = await connectToDatabase()
    const db = client.db("jmt_travel")

    // Check if slug already exists (excluding current blog)
    if (body.slug) {
      const existingBlog = await db.collection("blogs").findOne({
        slug: body.slug,
        _id: { $ne: new ObjectId(id) },
      })
      if (existingBlog) {
        return NextResponse.json({ error: "A blog with this slug already exists" }, { status: 400 })
      }
    }

    const updateData = {
      ...body,
      updatedAt: new Date(),
      publishedAt: body.published && !body.publishedAt ? new Date() : body.publishedAt,
    }

    const result = await db.collection("blogs").updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    const updatedBlog = await db.collection("blogs").findOne({ _id: new ObjectId(id) })
    return NextResponse.json(updatedBlog)
  } catch (error) {
    console.error("Error updating blog:", error)
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 })
    }

    const client = await connectToDatabase()
    const db = client.db("jmt_travel")

    const result = await db.collection("blogs").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Blog deleted successfully" })
  } catch (error) {
    console.error("Error deleting blog:", error)
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 })
  }
}
