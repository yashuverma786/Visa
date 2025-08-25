import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    const { db } = await connectToDatabase();

    // Fetch all blogs
    const blogs = await db
      .collection("blogs")
      .find({})
      .sort({ publishedAt: -1 })
      .toArray();

    return NextResponse.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

// 👇 Add this POST handler
export async function POST(req: Request) {
  try {
    const { db } = await connectToDatabase();

    const formData = await req.formData();

    const blog = {
      title: formData.get("title"),
      slug: formData.get("slug"),
      excerpt: formData.get("excerpt"),
      country: formData.get("country"),
      content: formData.get("content"),
      metaTitle: formData.get("metaTitle"),
      metaDescription: formData.get("metaDescription"),
      publishedAt: new Date(),
    };

    // Handle file (featuredImage)
    const file = formData.get("featuredImage") as File | null;
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      // TODO: Save buffer to cloud storage or local fs
      blog["featuredImage"] = file.name;
    }

    const result = await db.collection("blogs").insertOne(blog);

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error("Error saving blog:", error);
    return NextResponse.json({ error: "Failed to save blog" }, { status: 500 });
  }
}
