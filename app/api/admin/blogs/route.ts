import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

// ======================= GET =======================
export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const blogs = await db.collection("blogs").find({}).sort({ createdAt: -1 }).toArray();
    // Convert _id to string for frontend compatibility
    const processedBlogs = blogs.map((blog) => ({
      ...blog,
      _id: blog._id.toString(),
    }));
    return NextResponse.json(processedBlogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

// ======================= POST =======================
export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase();
    let body;
    let featuredImageUrl = "";

    // Check content type for FormData
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      // Parse FormData
      const formData = await request.formData();
      body = {};
      for (const [key, value] of formData.entries()) {
        if (key === "featuredImage" && value instanceof File && value.size > 0) {
          // Save image to /public/uploads or use a cloud service
          // For demo, just use a placeholder URL
          featuredImageUrl = `/placeholder-user.jpg`;
        } else {
          body[key] = value;
        }
      }
    } else {
      body = await request.json();
    }

    // Validate required fields
    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: "Missing required fields: title, content" },
        { status: 400 }
      );
    }

    // Generate slug from title if not provided
    const slug =
      body.slug ||
      body.title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();

    // Check if slug already exists
    const existingBlog = await db.collection("blogs").findOne({ slug });
    if (existingBlog) {
      return NextResponse.json(
        { error: "A blog with this slug already exists" },
        { status: 400 }
      );
    }

    const now = new Date();
    const blogData = {
      title: body.title.trim(),
      slug,
      excerpt: body.excerpt?.trim() || "",
      content: body.content.trim(),
      tags: body.tags || [],
      featured: body.featured || false,
      published: body.published ?? true,
      metaTitle: body.metaTitle?.trim() || "",
      metaDescription: body.metaDescription?.trim() || "",
      country: body.country?.trim() || "",
      featuredImageUrl,
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : now,
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection("blogs").insertOne(blogData);

    return NextResponse.json({
      _id: result.insertedId.toString(),
      ...blogData,
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
  }
}
