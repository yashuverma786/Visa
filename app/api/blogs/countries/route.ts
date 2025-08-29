import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  const { db } = await connectToDatabase()

  // unique countries used in blogs
  const blogs = await db.collection("blogs").find({}, { projection: { country: 1, countrySlug: 1, countryImage: 1 } }).toArray()

  const map = new Map()
  blogs.forEach(b => {
    if (b.countrySlug && !map.has(b.countrySlug)) {
      map.set(b.countrySlug, {
        slug: b.countrySlug,
        name: b.country,
        imageUrl: b.countryImage || "/placeholder.svg"
      })
    }
  })

  return NextResponse.json(Array.from(map.values()))
}
