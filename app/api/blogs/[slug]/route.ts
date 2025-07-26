import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const { db } = await connectToDatabase();

    // ✅ Get slug from URL
    const url = new URL(req.url);
    const slug = url.pathname.split("/").pop(); // /api/blogs/[slug] => get slug

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const blog = await db.collection("blogs").findOne({
      slug: slug,
    });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 });
  }
}
