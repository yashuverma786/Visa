import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plane, Briefcase, GraduationCap, Users, Heart, Clock } from "lucide-react"
import Link from "next/link"

const visaTypes = [
  {
    icon: Plane,
    title: "Tourist Visa",
    description: "Perfect for leisure travel, sightseeing, and visiting friends or family.",
    features: ["Multiple entry options", "Flexible duration", "Quick processing"],
    countries: ["USA", "UK", "Canada", "Australia", "Schengen"],
    color: "bg-blue-500",
  },
  {
    icon: Briefcase,
    title: "Business Visa",
    description: "Ideal for business meetings, conferences, and professional visits.",
    features: ["Fast-track processing", "Multiple entries", "Extended validity"],
    countries: ["USA", "UK", "Canada", "Singapore", "UAE"],
    color: "bg-green-500",
  },
  {
    icon: GraduationCap,
    title: "Student Visa",
    description: "For pursuing education, research, or academic programs abroad.",
    features: ["Study permit included", "Work authorization", "Long-term validity"],
    countries: ["USA", "UK", "Canada", "Australia", "Germany"],
    color: "bg-purple-500",
  },
  {
    icon: Users,
    title: "Family Visa",
    description: "Reunite with family members or join your spouse abroad.",
    features: ["Family reunification", "Dependent visas", "Permanent options"],
    countries: ["USA", "UK", "Canada", "Australia", "New Zealand"],
    color: "bg-pink-500",
  },
  {
    icon: Heart,
    title: "Medical Visa",
    description: "For medical treatment, procedures, or health consultations.",
    features: ["Emergency processing", "Attendant visas", "Medical support"],
    countries: ["USA", "UK", "Germany", "Singapore", "Thailand"],
    color: "bg-red-500",
  },
  {
    icon: Clock,
    title: "Transit Visa",
    description: "For short layovers and connecting flights through a country.",
    features: ["Quick approval", "Short duration", "Airport transit"],
    countries: ["UK", "Schengen", "Canada", "Australia", "UAE"],
    color: "bg-orange-500",
  },
]

export default function VisaTypesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Visa Types & Services</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We provide comprehensive visa services for all types of travel purposes. Choose the visa type that matches
            your travel needs.
          </p>
        </div>

        {/* Visa Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {visaTypes.map((visa, index) => {
            const IconComponent = visa.icon
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`w-12 h-12 ${visa.color} rounded-lg flex items-center justify-center mb-4`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{visa.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{visa.description}</p>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Key Features:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {visa.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">Popular Destinations:</h4>
                    <div className="flex flex-wrap gap-1">
                      {visa.countries.map((country, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {country}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button asChild className="w-full">
                    <Link href="/countries">Explore Countries</Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-lg p-8 text-center shadow-sm">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Need Help Choosing the Right Visa?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Our visa experts are here to help you determine the best visa type for your specific needs and guide you
            through the entire application process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/contact">Get Expert Consultation</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/countries">Browse All Countries</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
