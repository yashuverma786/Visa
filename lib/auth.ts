import type { NextRequest } from "next/server"

// Admin credentials (in production, use environment variables)
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123",
}

// Session management
const SESSION_COOKIE_NAME = "admin_session"
const SESSION_SECRET = "your-secret-key-here"

export function validateAdminCredentials(username: string, password: string): boolean {
  return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password
}

export function setAdminSession(): string {
  // In a real app, you'd use JWT or a proper session store
  const sessionToken = Buffer.from(`${Date.now()}-${SESSION_SECRET}`).toString("base64")
  return sessionToken
}

export function clearAdminSession(): void {
  // This would clear the session in a real implementation
  console.log("Admin session cleared")
}

export function isAdminAuthenticated(sessionToken?: string): boolean {
  if (!sessionToken) return false

  try {
    // Simple validation - in production use proper JWT validation
    const decoded = Buffer.from(sessionToken, "base64").toString()
    return decoded.includes(SESSION_SECRET)
  } catch {
    return false
  }
}

export function checkAdminAuth(request: NextRequest): boolean {
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)
  return isAdminAuthenticated(sessionCookie?.value)
}

export async function isAuthenticated(request: NextRequest): Promise<boolean> {
  try {
    return checkAdminAuth(request)
  } catch (error) {
    console.error("Authentication check failed:", error)
    return false
  }
}

export function requireAuth(request: NextRequest): void {
  if (!checkAdminAuth(request)) {
    throw new Error("Authentication required")
  }
}
