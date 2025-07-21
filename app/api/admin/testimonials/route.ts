import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { isAuthenticated } from "@/lib/auth"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const testimonials = await db.collection("testimonials").find({}).sort({ createdAt: -1 }).toArray()

    const processedTestimonials = testimonials.map((testimonial) => ({
      ...testimonial,
      _id: testimonial._id.toString(),
    }))

    return NextResponse.json(processedTestimonials)
  } catch (error) {
    console.error("Error fetching testimonials:", error)
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { db } = await connectToDatabase()

    const testimonialData = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("testimonials").insertOne(testimonialData)

    return NextResponse.json({
      _id: result.insertedId.toString(),
      ...testimonialData,
    })
  } catch (error) {
    console.error("Error creating testimonial:", error)
    return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 })
  }
}
