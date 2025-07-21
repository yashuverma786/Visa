import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plane, Briefcase, GraduationCap, Users, Heart, Stethoscope } from "lucide-react"
import Link from "next/link"

const visaTypes = [
  {
    icon: <Plane className="h-8 w-8 text-blue-600" />,
    title: "Tourist Visa",
    description: "Perfect for leisure travel, sightseeing, and visiting friends and family.",
    features: [
      "Leisure travel and tourism",
      "Visiting friends and family",
      "Short-term stays",
      "Multiple entry options available",
    ],
    countries: ["USA", "UK", "Canada", "Australia", "Schengen"],
    startingPrice: "₹8,000",
  },
  {
    icon: <Briefcase className="h-8 w-8 text-green-600" />,
    title: "Business Visa",
    description: "For business meetings, conferences, and professional activities.",
    features: ["Business meetings", "Conferences and seminars", "Trade negotiations", "Professional networking"],
    countries: ["USA", "UK", "Canada", "Singapore", "UAE"],
    startingPrice: "₹12,000",
  },
  {
    icon: <GraduationCap className="h-8 w-8 text-purple-600" />,
    title: "Student Visa",
    description: "For pursuing education and academic programs abroad.",
    features: ["University admissions", "Language courses", "Research programs", "Exchange programs"],
    countries: ["USA", "UK", "Canada", "Australia", "Germany"],
    startingPrice: "₹15,000",
  },
  {
    icon: <Users className="h-8 w-8 text-orange-600" />,
    title: "Work Visa",
    description: "For employment opportunities and professional work abroad.",
    features: [
      "Employment authorization",
      "Skilled worker programs",
      "Temporary work permits",
      "Long-term career opportunities",
    ],
    countries: ["Canada", "Australia", "Germany", "New Zealand", "UAE"],
    startingPrice: "₹20,000",
  },
  {
    icon: <Heart className="h-8 w-8 text-red-600" />,
    title: "Family Visa",
    description: "For family reunification and joining relatives abroad.",
    features: ["Spouse visas", "Dependent visas", "Parent visas", "Family reunification"],
    countries: ["USA", "UK", "Canada", "Australia", "New Zealand"],
    startingPrice: "₹18,000",
  },
  {
    icon: <Stethoscope className="h-8 w-8 text-teal-600" />,
    title: "Medical Visa",
    description: "For medical treatment and healthcare services abroad.",
    features: ["Medical treatment", "Specialized healthcare", "Medical consultations", "Accompanying patient visas"],
    countries: ["USA", "UK", "Germany", "Singapore", "Thailand"],
    startingPrice: "₹10,000",
  },
]

export default function VisaTypesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Visa Types & Services</h1>
            <p className="text-xl text-blue-100 mb-8">
              Comprehensive visa solutions for all your travel needs. From tourist visas to work permits, we provide
              expert guidance for every type of visa application.
            </p>
          </div>
        </div>
      </section>

      {/* Visa Types Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visaTypes.map((visa, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-4 mb-4">
                    {visa.icon}
                    <CardTitle className="text-xl">{visa.title}</CardTitle>
                  </div>
                  <p className="text-gray-600">{visa.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Features */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Key Features:</h4>
                      <ul className="space-y-1">
                        {visa.features.map((feature, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-center">
                            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Popular Countries */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Popular Countries:</h4>
                      <div className="flex flex-wrap gap-1">
                        {visa.countries.map((country, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {country}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Starting from</span>
                        <span className="text-lg font-bold text-green-600">{visa.startingPrice}</span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Button asChild className="w-full">
                      <Link href="/countries">Explore Countries</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Information */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose Our Visa Services?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">95%</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Success Rate</h3>
                <p className="text-gray-600">High approval rates across all visa categories</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">24/7</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Support</h3>
                <p className="text-gray-600">Round-the-clock assistance and guidance</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">10+</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Years Experience</h3>
                <p className="text-gray-600">Decade of expertise in visa processing</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Visa Application?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Get expert guidance and personalized assistance for your visa application. Contact us today for a free
            consultation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/contact">Get Free Consultation</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-blue-600 bg-transparent"
            >
              <Link href="/countries">Browse Countries</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
