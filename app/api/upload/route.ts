import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Check if BLOB token is available
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error("❌ BLOB_READ_WRITE_TOKEN not found in environment variables")
      return NextResponse.json(
        {
          error: "File upload service not configured. Please contact administrator.",
        },
        { status: 503 },
      )
    }

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
    const randomString = Math.random().toString(36).substring(2, 8)
    const uniqueFilename = `${timestamp}-${randomString}-${filename.replace(/[^a-zA-Z0-9.-]/g, "_")}`

    console.log("📤 Uploading file:", uniqueFilename)

    // Upload to Vercel Blob
    const blob = await put(uniqueFilename, request.body, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
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

    // Provide more specific error messages
    let errorMessage = "Upload failed"
    if (error instanceof Error) {
      if (error.message.includes("token")) {
        errorMessage = "Upload service authentication failed"
      } else if (error.message.includes("network")) {
        errorMessage = "Network error during upload"
      } else {
        errorMessage = error.message
      }
    }

    return NextResponse.json(
      {
        error: errorMessage,
      },
      { status: 500 },
    )
  }
}
