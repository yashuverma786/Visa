import { NextResponse } from "next/server"
import { clearAdminSession } from "@/lib/auth"

export async function POST() {
  try {
    clearAdminSession()

    const response = NextResponse.json({
      success: true,
      message: "Logout successful",
    })

    // Clear the session cookie
    response.cookies.set("admin-session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
    })

    return response
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Logout failed" }, { status: 500 })
  }
}
