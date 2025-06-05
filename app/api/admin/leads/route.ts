import { type NextRequest, NextResponse } from "next/server"
import { checkAdminAuth } from "@/lib/auth"
import { getCustomers } from "@/lib/database"

export async function GET(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const customers = await getCustomers()
    return NextResponse.json(customers)
  } catch (error) {
    console.error("Error fetching customers:", error)
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 })
  }
}
