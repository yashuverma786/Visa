import { type NextRequest, NextResponse } from "next/server"
import { clearAdminSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    clearAdminSession()

    const response = NextResponse.json({ success: true, message: "Logout successful" })

    // Clear session cookie
    response.cookies.delete("admin_session")

    return response
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Logout failed" }, { status: 500 })
  }
}
