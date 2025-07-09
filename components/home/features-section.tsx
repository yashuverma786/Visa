import { Clock, Shield, Users, FileText, Globe, Headphones } from "lucide-react"

const features = [
  {
    icon: Clock,
    title: "Fast Processing",
    description: "Quick turnaround times with efficient visa processing",
  },
  {
    icon: Shield,
    title: "100% Secure",
    description: "Your documents and data are completely safe with us",
  },
  {
    icon: Users,
    title: "Expert Team",
    description: "Experienced professionals to guide you through the process",
  },
  {
    icon: FileText,
    title: "Document Support",
    description: "Complete assistance with document preparation and verification",
  },
  {
    icon: Globe,
    title: "All Countries",
    description: "Visa services for destinations worldwide",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Round-the-clock customer support for all your queries",
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose JMT Travel?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We make visa applications simple, fast, and stress-free with our comprehensive services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 ml-4">{feature.title}</h3>
              </div>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
