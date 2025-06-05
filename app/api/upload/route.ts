import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get("filename")

    if (!filename) {
      return NextResponse.json({ error: "Filename is required" }, { status: 400 })
    }

    if (!request.body) {
      return NextResponse.json({ error: "Request body is required" }, { status: 400 })
    }

    // Get the file size from headers
    const contentLength = request.headers.get("content-length")
    const fileSize = contentLength ? Number.parseInt(contentLength) : 0

    // Check file size limit (10MB for images, 5MB for documents)
    const isImage = filename.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/i)
    const maxSize = isImage ? 10 * 1024 * 1024 : 5 * 1024 * 1024 // 10MB for images, 5MB for docs

    if (fileSize > maxSize) {
      return NextResponse.json(
        {
          error: `File too large. Maximum size is ${isImage ? "10MB" : "5MB"}.`,
        },
        { status: 413 },
      )
    }

    // Check file type
    const allowedTypes = [".pdf", ".jpg", ".jpeg", ".png", ".gif", ".webp"]
    const fileExtension = filename.toLowerCase().substring(filename.lastIndexOf("."))

    if (!allowedTypes.includes(fileExtension)) {
      return NextResponse.json(
        {
          error: "Invalid file type. Only PDF, JPG, JPEG, PNG, GIF, and WEBP files are allowed.",
        },
        { status: 400 },
      )
    }

    // Create a unique filename to avoid conflicts
    const timestamp = Date.now()
    const uniqueFilename = `${timestamp}-${filename}`

    // Upload to Vercel Blob
    const blob = await put(uniqueFilename, request.body, {
      access: "public",
    })

    console.log("✅ File uploaded successfully:", blob.url)

    return NextResponse.json({
      url: blob.url,
      filename: uniqueFilename,
      originalName: filename,
      size: fileSize,
      type: fileExtension,
    })
  } catch (error) {
    console.error("❌ Upload error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Upload failed",
      },
      { status: 500 },
    )
  }
}
