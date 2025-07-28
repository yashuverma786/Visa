import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

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
    const { db } = await connectToDatabase()
    const body = await request.json()

    // Fix: use comment if content is not provided
    const comment = body.content || body.comment

    if (!body.name || !comment || !body.rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const testimonialData = {
      name: body.name.trim(),
      content: comment.trim(),
      rating: Number(body.rating),
      country: body.country?.trim() || "",
      image: body.image || "",
      featured: body.featured || false,
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
