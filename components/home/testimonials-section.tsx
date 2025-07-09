"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import Image from "next/image"

interface Testimonial {
  _id: string
  name: string
  country: string
  rating: number
  comment: string
  image?: string
  createdAt?: Date
}

// Fallback testimonials in case database is not available
const fallbackTestimonials: Testimonial[] = [
  {
    _id: "fallback_1",
    name: "Priya Sharma",
    country: "USA Visa",
    rating: 5,
    comment:
      "JMT Travel made my US visa process incredibly smooth. Their team guided me through every step and I got my visa approved in just 20 days!",
    image: "/placeholder.svg?height=60&width=60",
    createdAt: new Date(),
  },
  {
    _id: "fallback_2",
    name: "Rajesh Kumar",
    country: "Canada Visa",
    rating: 5,
    comment:
      "Excellent service! The documentation support was outstanding and the processing was faster than expected. Highly recommended for Canada visa.",
    image: "/placeholder.svg?height=60&width=60",
    createdAt: new Date(),
  },
  {
    _id: "fallback_3",
    name: "Anita Patel",
    country: "UK Visa",
    rating: 5,
    comment:
      "Professional and reliable service. They handled all my UK visa requirements perfectly and kept me updated throughout the process.",
    image: "/placeholder.svg?height=60&width=60",
    createdAt: new Date(),
  },
  {
    _id: "fallback_4",
    name: "Vikram Singh",
    country: "Australia Visa",
    rating: 5,
    comment:
      "Got my Australian tourist visa without any hassle. The team at JMT Travel is very knowledgeable and supportive. Thank you!",
    image: "/placeholder.svg?height=60&width=60",
    createdAt: new Date(),
  },
  {
    _id: "fallback_5",
    name: "Meera Joshi",
    country: "Germany Visa",
    rating: 5,
    comment:
      "Amazing experience with JMT Travel. They made my Schengen visa application process so easy and stress-free. Will definitely use their services again.",
    image: "/placeholder.svg?height=60&width=60",
    createdAt: new Date(),
  },
  {
    _id: "fallback_6",
    name: "Arjun Reddy",
    country: "Japan Visa",
    rating: 5,
    comment:
      "Quick and efficient service for my Japan visa. The team was very responsive and helped me get my visa approved in record time.",
    image: "/placeholder.svg?height=60&width=60",
    createdAt: new Date(),
  },
]

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/testimonials", {
        cache: "no-store",
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Fetched testimonials:", data.length)

        if (data && data.length > 0) {
          setTestimonials(data)
        } else {
          console.log("No testimonials in database, using fallback")
          setTestimonials(fallbackTestimonials)
        }
      } else {
        console.error("Failed to fetch testimonials, using fallback")
        setTestimonials(fallbackTestimonials)
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error)
      setTestimonials(fallbackTestimonials)
    } finally {
      setIsLoading(false)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  if (isLoading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Read testimonials from thousands of satisfied customers who trusted us with their visa applications
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                    <div>
                      <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="flex items-center mb-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-4 w-4 bg-gray-300 rounded mr-1"></div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-300 rounded"></div>
                    <div className="h-3 bg-gray-300 rounded"></div>
                    <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Read testimonials from thousands of satisfied customers who trusted us with their visa applications
          </p>
          {testimonials.length > fallbackTestimonials.length && (
            <p className="text-sm text-green-600 mt-2">✅ Showing latest testimonials from our database</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.slice(0, 6).map((testimonial, index) => (
            <Card key={testimonial._id || index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                    <Image
                      src={testimonial.image || "/placeholder.svg?height=48&width=48"}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.country}</p>
                  </div>
                </div>

                <div className="flex items-center mb-3">
                  {renderStars(testimonial.rating)}
                  <span className="ml-2 text-sm text-gray-600">({testimonial.rating}/5)</span>
                </div>

                <p className="text-gray-700 text-sm leading-relaxed">"{testimonial.comment}"</p>

                {testimonial.createdAt && (
                  <div className="mt-3 text-xs text-gray-500">
                    {new Date(testimonial.createdAt).toLocaleDateString()}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-4 bg-white rounded-lg p-6 shadow-sm">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">5000+</p>
              <p className="text-sm text-gray-600">Happy Customers</p>
            </div>
            <div className="w-px h-12 bg-gray-300"></div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">98%</p>
              <p className="text-sm text-gray-600">Success Rate</p>
            </div>
            <div className="w-px h-12 bg-gray-300"></div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">50+</p>
              <p className="text-sm text-gray-600">Countries</p>
            </div>
          </div>
        </div>

        {/* Refresh button for admin testing */}
        <div className="text-center mt-8">
          <button onClick={fetchTestimonials} className="text-sm text-blue-600 hover:text-blue-800 underline">
            Refresh Testimonials
          </button>
        </div>
      </div>
    </section>
  )
}
