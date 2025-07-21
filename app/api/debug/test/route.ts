import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    message: "Test endpoint working",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    status: "ok",
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    return NextResponse.json({
      message: "Test POST endpoint working",
      timestamp: new Date().toISOString(),
      receivedData: body,
      status: "ok",
    })
  } catch (error) {
    return NextResponse.json(
      {
        message: "Test POST endpoint error",
        timestamp: new Date().toISOString(),
        error: error.message,
        status: "error",
      },
      { status: 400 },
    )
  }
}
