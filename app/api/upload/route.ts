import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)
  const filename = searchParams.get("filename")

  if (!filename) {
    return NextResponse.json({ error: "Filename is required" }, { status: 400 })
  }

  if (!request.body) {
    return NextResponse.json({ error: "Request body is required" }, { status: 400 })
  }

  try {
    // Get the file size from headers
    const contentLength = request.headers.get("content-length")
    const fileSize = contentLength ? Number.parseInt(contentLength) : 0

    // Check file size limit (5MB = 5 * 1024 * 1024 bytes)
    const maxSize = 5 * 1024 * 1024
    if (fileSize > maxSize) {
      return NextResponse.json(
        {
          error: "File too large. Maximum size is 5MB.",
        },
        { status: 413 },
      )
    }

    // Check file type
    const allowedTypes = [".pdf", ".jpg", ".jpeg", ".png"]
    const fileExtension = filename.toLowerCase().substring(filename.lastIndexOf("."))

    if (!allowedTypes.includes(fileExtension)) {
      return NextResponse.json(
        {
          error: "Invalid file type. Only PDF, JPG, and PNG files are allowed.",
        },
        { status: 400 },
      )
    }

    // Upload to Vercel Blob
    const blob = await put(filename, request.body, {
      access: "public",
    })

    return NextResponse.json({
      url: blob.url,
      filename: filename,
      size: fileSize,
      type: fileExtension,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
