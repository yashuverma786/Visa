import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import Image from "next/image"

const testimonials = [
  {
    name: "Priya Sharma",
    country: "USA Visa",
    rating: 5,
    comment:
      "JMT Travel made my US visa process incredibly smooth. Their team guided me through every step and I got my visa approved in just 20 days!",
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    name: "Rajesh Kumar",
    country: "Canada Visa",
    rating: 5,
    comment:
      "Excellent service! The documentation support was outstanding and the processing was faster than expected. Highly recommended for Canada visa.",
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    name: "Anita Patel",
    country: "UK Visa",
    rating: 5,
    comment:
      "Professional and reliable service. They handled all my UK visa requirements perfectly and kept me updated throughout the process.",
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    name: "Vikram Singh",
    country: "Australia Visa",
    rating: 5,
    comment:
      "Got my Australian tourist visa without any hassle. The team at JMT Travel is very knowledgeable and supportive. Thank you!",
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    name: "Meera Joshi",
    country: "Germany Visa",
    rating: 5,
    comment:
      "Amazing experience with JMT Travel. They made my Schengen visa application process so easy and stress-free. Will definitely use their services again.",
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    name: "Arjun Reddy",
    country: "Japan Visa",
    rating: 5,
    comment:
      "Quick and efficient service for my Japan visa. The team was very responsive and helped me get my visa approved in record time.",
    image: "/placeholder.svg?height=60&width=60",
  },
]

export default function TestimonialsSection() {
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
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
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
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>

                <p className="text-gray-700 text-sm leading-relaxed">"{testimonial.comment}"</p>
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
      </div>
    </section>
  )
}
