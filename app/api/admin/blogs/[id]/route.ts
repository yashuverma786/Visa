import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { put } from "@vercel/blob";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { db } = await connectToDatabase();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
    }

    const objectId = new ObjectId(id);
    const formData = await req.formData();

    let body: any = {};
    let featuredImageUrl = "";

    for (const [key, value] of formData.entries()) {
      if (key === "featuredImage" && value instanceof File && value.size > 0) {
        const filename = `${Date.now()}-${value.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const blob = await put(filename, value, { access: "public" });
        featuredImageUrl = blob.url;
      } else {
        body[key] = value;
      }
    }

    const now = new Date();
    const updateData: any = {
      title: body.title?.trim(),
      slug:
        body.slug ||
        body.title
          ?.toLowerCase()
          .replace(/[^a-z0-9 -]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .trim(),
      excerpt: body.excerpt?.trim() || "",
      content: body.content?.trim(),
      country: body.country?.trim() || "",
      metaTitle: body.metaTitle?.trim() || "",
      metaDescription: body.metaDescription?.trim() || "",
      updatedAt: now,
    };

    // agar nayi image aayi hai to update karo
    if (featuredImageUrl) {
      updateData.featuredImageUrl = featuredImageUrl;
    }

    await db.collection("blogs").updateOne(
      { _id: objectId },
      { $set: updateData }
    );

    return NextResponse.json({
      message: "Blog updated successfully",
      ...updateData,
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json(
      { error: "Failed to update blog" },
      { status: 500 }
    );
  }
}
