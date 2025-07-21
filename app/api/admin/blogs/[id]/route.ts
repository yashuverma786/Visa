import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { Blog } from "@/lib/types"

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()
    const { _id, ...blogData }: Blog = await req.json()

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 })
    }

    const result = await db
      .collection<Blog>("blogs")
      .updateOne({ _id: new ObjectId(params.id) }, { $set: { ...blogData, updatedAt: new Date() } })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    const updatedBlog = await db.collection<Blog>("blogs").findOne({ _id: new ObjectId(params.id) })

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

    const result = await db.collection<Blog>("blogs").deleteOne({ _id: new ObjectId(params.id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Blog deleted successfully" })
  } catch (error) {
    console.error("Error deleting blog:", error)
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 })
  }
}
