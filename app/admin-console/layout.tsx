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


if (typeof window !== "undefined") {
  const originalError = console.error;
  console.error = (...args) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("CKEditor 4.22.1 (Full) version is not secure")
    ) {
      return; // skip this warning
    }
    originalError(...args);
  };
}
