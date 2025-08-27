import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import fs from "fs";
import path from "path";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ✅ await params
    const { db } = await connectToDatabase();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
    }

    const objectId = new ObjectId(id);

    const contentType = req.headers.get("content-type") || "";
    let body: any = {};
    let featuredImageUrl = "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();

      for (const [key, value] of formData.entries()) {
        if (key === "featuredImage" && value instanceof File && value.size > 0) {
          const bytes = await value.arrayBuffer();
          const buffer = Buffer.from(bytes);

          const uploadsDir = path.join(process.cwd(), "public", "uploads");
          if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
          }

          const filename = `${Date.now()}-${value.name}`;
          const filePath = path.join(uploadsDir, filename);
          await fs.promises.writeFile(filePath, buffer);

          featuredImageUrl = `/uploads/${filename}`;
        } else {
          body[key] = value;
        }
      }
    } else {
      body = await req.json();
    }

    const now = new Date();
    const updateData: any = {
      title: body.title?.trim(),
      slug: body.slug,
      excerpt: body.excerpt?.trim() || "",
      content: body.content?.trim(),
      country: body.country?.trim() || "",
      metaTitle: body.metaTitle?.trim() || "",
      metaDescription: body.metaDescription?.trim() || "",
      updatedAt: now,
    };

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
