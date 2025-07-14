import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Console - JMT Travel",
  description: "Admin panel for managing JMT Travel services",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen bg-gray-50">{children}</div>
}
