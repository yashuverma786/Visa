import { cookies } from "next/headers"
import type { NextRequest } from "next/server"

const ADMIN_CREDENTIALS = {
  username: "visajmt",
  password: "VisanewJMT@123",
}

export function validateAdminCredentials(username: string, password: string): boolean {
  return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password
}

export function setAdminSession() {
  const cookieStore = cookies()
  cookieStore.set("admin-session", "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  })
}

export function clearAdminSession() {
  const cookieStore = cookies()
  cookieStore.delete("admin-session")
}

export function isAdminAuthenticated(): boolean {
  const cookieStore = cookies()
  return cookieStore.get("admin-session")?.value === "authenticated"
}

export function checkAdminAuth(request: NextRequest): boolean {
  const sessionCookie = request.cookies.get("admin-session")
  return sessionCookie?.value === "authenticated"
}
