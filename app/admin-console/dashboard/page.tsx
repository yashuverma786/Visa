import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { isAdminAuthenticated } from "@/lib/auth"
import AdminDashboard from "@/components/admin/admin-dashboard"

export default async function AdminDashboardPage() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get("admin-session")?.value

  if (!isAdminAuthenticated(sessionToken)) {
    redirect("/admin-console")
  }

  return <AdminDashboard />
}
