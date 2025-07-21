import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plane, Briefcase, GraduationCap, Users, Heart, Clock } from "lucide-react"
import Link from "next/link"

const visaTypes = [
  {
    id: "tourist",
    title: "Tourist Visa",
    icon: Plane,
    description: "Perfect for leisure travel, sightseeing, and visiting family or friends.",
    features: ["Multiple entry options", "Flexible duration", "Quick processing"],
    countries: ["USA", "UK", "Canada", "Australia", "Schengen"],
    color: "bg-blue-500",
  },
  {
    id: "business",
    title: "Business Visa",
    icon: Briefcase,
    description: "Ideal for business meetings, conferences, and professional engagements.",
    features: ["Fast-track processing", "Multiple entries", "Extended validity"],
    countries: ["USA", "UK", "Canada", "Singapore", "UAE"],
    color: "bg-green-500",
  },
  {
    id: "student",
    title: "Student Visa",
    icon: GraduationCap,
    description: "For pursuing education, research, or academic programs abroad.",
    features: ["Long-term validity", "Work permissions", "Family inclusion"],
    countries: ["USA", "UK", "Canada", "Australia", "Germany"],
    color: "bg-purple-500",
  },
  {
    id: "family",
    title: "Family Visa",
    icon: Users,
    description: "Reunite with family members or join your spouse abroad.",
    features: ["Permanent options", "Dependent inclusion", "Path to residency"],
    countries: ["USA", "UK", "Canada", "Australia", "New Zealand"],
    color: "bg-orange-500",
  },
  {
    id: "medical",
    title: "Medical Visa",
    icon: Heart,
    description: "For medical treatment, procedures, or health-related travel.",
    features: ["Urgent processing", "Attendant visas", "Extended stays"],
    countries: ["USA", "UK", "Germany", "Singapore", "Thailand"],
    color: "bg-red-500",
  },
  {
    id: "transit",
    title: "Transit Visa",
    icon: Clock,
    description: "For short layovers and connecting flights through a country.",
    features: ["Quick approval", "Short validity", "Airport transit"],
    countries: ["UK", "Schengen", "Canada", "Australia", "UAE"],
    color: "bg-gray-500",
  },
]

export default function VisaTypesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Visa Types We Handle</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We provide comprehensive visa services for all types of travel purposes. Choose the visa type that matches
            your travel needs and let our experts guide you through the process.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visaTypes.map((visa) => {
            const IconComponent = visa.icon
            return (
              <Card key={visa.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-full ${visa.color} text-white`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">{visa.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">{visa.description}</p>

                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 mb-2">Key Features:</h4>
                    <ul className="space-y-1">
                      {visa.features.map((feature, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 mb-2">Popular Destinations:</h4>
                    <div className="flex flex-wrap gap-1">
                      {visa.countries.map((country) => (
                        <Badge key={country} variant="outline" className="text-xs">
                          {country}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button asChild className="w-full">
                      <Link href="/countries">Explore Countries</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-16 text-center">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="py-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help Choosing the Right Visa?</h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Our visa experts are here to help you determine the best visa type for your specific needs. Get
                personalized guidance and support throughout your application process.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/contact">Get Expert Consultation</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/countries">Browse All Countries</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
