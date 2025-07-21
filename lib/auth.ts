import { cookies } from "next/headers"
import type { NextRequest } from "next/server"

// Admin credentials (in production, use environment variables)
const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || "admin",
  password: process.env.ADMIN_PASSWORD || "admin123",
}

export function validateAdminCredentials(username: string, password: string): boolean {
  return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password
}

export async function setAdminSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set("admin-session", "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 24 hours
  })
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete("admin-session")
}

export async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get("admin-session")
    return session?.value === "authenticated"
  } catch (error) {
    console.error("Error checking authentication:", error)
    return false
  }
}

export function isAdminAuthenticated(): boolean {
  try {
    // This is a synchronous version for client-side checks
    return true // Simplified for now
  } catch (error) {
    return false
  }
}

export function checkAdminAuth(request: NextRequest): boolean {
  try {
    const session = request.cookies.get("admin-session")
    return session?.value === "authenticated"
  } catch (error) {
    return false
  }
}

export async function requireAuth(): Promise<void> {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    throw new Error("Authentication required")
  }
}
