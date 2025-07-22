import type { NextRequest } from "next/server"

// Admin credentials (in production, use environment variables)
const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || "admin",
  password: process.env.ADMIN_PASSWORD || "admin123",
}

export function validateAdminCredentials(username: string, password: string): boolean {
  return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password
}

export function setAdminSession(): string {
  // In a real app, you'd use JWT or a proper session management system
  const sessionToken = Buffer.from(`${Date.now()}-admin-session`).toString("base64")
  return sessionToken
}

export function clearAdminSession(): void {
  // Clear session logic would go here
  // For now, we'll just return void since we're using simple token validation
}

export function isAdminAuthenticated(sessionToken?: string): boolean {
  console.log("Session Token in Auth Check:", sessionToken)

  if (!sessionToken) return false

  try {
    const decoded = Buffer.from(sessionToken, "base64").toString()
    console.log("Decoded Token:", decoded)

    return decoded.includes("admin-session")
  } catch (err) {
    console.error("Decoding failed", err)
    return false
  }
}

export function checkAdminAuth(request: NextRequest): boolean {
  const sessionToken = request.cookies.get("admin-session")?.value
  return isAdminAuthenticated(sessionToken)
}

export async function isAuthenticated(sessionToken?: string): Promise<boolean> {
  return isAdminAuthenticated(sessionToken)
}

export function requireAuth(sessionToken?: string): void {
  if (!isAdminAuthenticated(sessionToken)) {
    throw new Error("Authentication required")
  }
}
