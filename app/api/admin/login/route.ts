import { NextResponse } from "next/server"
import { validateAdminCredentials, setAdminSession } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()
    console.log("Login attempt with:", username, password)

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 })
    }

    if (validateAdminCredentials(username, password)) {
      const sessionToken = setAdminSession()
      console.log("Generated Session Token:", sessionToken)

      const response = NextResponse.json({
        success: true,
        message: "Login successful",
      })
      response.cookies.set("admin-session", sessionToken, {
        httpOnly: true,
        secure: false, // bas ek baar, testing ke liye false
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })


      return response
    } else {
      console.log("Invalid credentials")
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
