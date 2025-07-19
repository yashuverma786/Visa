import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import type { Blog } from "@/lib/types"

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const { db } = await connectToDatabase()

    const blog = await db.collection<Blog>("blogs").findOne({
      slug: slug,
      published: true,
    })

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    return NextResponse.json(blog)
  } catch (error) {
    console.error("Error fetching blog:", error)
    return NextResponse.json({ message: "Failed to fetch blog", error }, { status: 500 })
  }
}
