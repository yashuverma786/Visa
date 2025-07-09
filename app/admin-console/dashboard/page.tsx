import { redirect } from "next/navigation"
import { isAdminAuthenticated } from "@/lib/auth"
import AdminDashboard from "@/components/admin/admin-dashboard"

export default function AdminDashboardPage() {
  if (!isAdminAuthenticated()) {
    redirect("/admin-console")
  }

  return <AdminDashboard />
}
