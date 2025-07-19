import { type NextRequest, NextResponse } from "next/server"
import { checkAdminAuth } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"
import type { Blog } from "@/lib/types"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const blogData: Blog = await request.json()

    const { db } = await connectToDatabase()
    const { ObjectId } = require("mongodb")

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid blog ID format" }, { status: 400 })
    }

    const result = await db
      .collection<Blog>("blogs")
      .updateOne({ _id: new ObjectId(id) }, { $set: { ...blogData, updatedAt: new Date() } })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    const updatedBlog = await db.collection<Blog>("blogs").findOne({ _id: new ObjectId(id) })
    return NextResponse.json(updatedBlog)
  } catch (error) {
    console.error("Error updating blog:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { db } = await connectToDatabase()
    const { ObjectId } = require("mongodb")

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid blog ID format" }, { status: 400 })
    }

    const result = await db.collection<Blog>("blogs").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting blog:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
