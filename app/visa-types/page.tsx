import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, Camera, Heart, GraduationCap, Plane, Users } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Visa Types - Tourist, Business & Family Visit Visas",
  description:
    "Explore different types of visas including tourist, business, family visit, student, and transit visas. Expert guidance for all visa categories.",
}

const visaTypes = [
  {
    icon: Camera,
    title: "Tourist Visa",
    description: "Perfect for leisure travel, sightseeing, and vacation trips",
    features: [
      "Single or multiple entry options",
      "Validity up to 10 years",
      "Quick processing time",
      "Tourism and recreation purposes",
    ],
    duration: "15-30 days processing",
    price: "Starting from ₹5,000",
  },
  {
    icon: Briefcase,
    title: "Business Visa",
    description: "For business meetings, conferences, and commercial activities",
    features: [
      "Business meetings and conferences",
      "Trade and commercial activities",
      "Multiple entry facility",
      "Extended validity options",
    ],
    duration: "10-20 days processing",
    price: "Starting from ₹8,000",
  },
  {
    icon: Heart,
    title: "Family Visit Visa",
    description: "Visit family members and relatives living abroad",
    features: [
      "Visit family and relatives",
      "Attend family functions",
      "Medical treatment visits",
      "Flexible duration options",
    ],
    duration: "15-25 days processing",
    price: "Starting from ₹6,000",
  },
  {
    icon: GraduationCap,
    title: "Student Visa",
    description: "For educational purposes and academic programs",
    features: ["Study abroad programs", "University admissions", "Research and academic work", "Long-term validity"],
    duration: "20-40 days processing",
    price: "Starting from ₹10,000",
  },
  {
    icon: Plane,
    title: "Transit Visa",
    description: "For travelers passing through a country to reach their destination",
    features: ["Airport transit facility", "Short-term validity", "Quick processing", "Connecting flights"],
    duration: "5-10 days processing",
    price: "Starting from ₹3,000",
  },
  {
    icon: Users,
    title: "Group Visa",
    description: "Special visa arrangements for group travel and tours",
    features: ["Group tour packages", "Bulk processing discounts", "Coordinated applications", "Group travel benefits"],
    duration: "15-30 days processing",
    price: "Contact for group rates",
  },
]

export default function VisaTypesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Types of Visas We Process</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Choose from our comprehensive range of visa services tailored to your specific travel needs
          </p>
        </div>
      </section>

      {/* Visa Types Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visaTypes.map((visa, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <visa.icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl ml-4">{visa.title}</CardTitle>
                  </div>
                  <p className="text-gray-600">{visa.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Features:</h4>
                      <ul className="space-y-1">
                        {visa.features.map((feature, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-center">
                            <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      <div className="text-sm">
                        <span className="font-semibold">Processing Time:</span>
                        <span className="text-gray-600 ml-1">{visa.duration}</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-semibold">Price:</span>
                        <span className="text-green-600 ml-1 font-semibold">{visa.price}</span>
                      </div>
                    </div>

                    <Button asChild className="w-full">
                      <Link href="/visa-assistance">Apply Now</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Not Sure Which Visa Type You Need?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Our visa experts are here to help you choose the right visa type for your travel needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/visa-assistance">Get Expert Consultation</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-blue-600"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
