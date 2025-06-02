import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

const popularCountries = [
  {
    name: "United States",
    code: "US",
    image: "/placeholder.svg?height=200&width=300",
    startingPrice: 15000,
    processingTime: "15-30 days",
  },
  {
    name: "United Kingdom",
    code: "GB",
    image: "/placeholder.svg?height=200&width=300",
    startingPrice: 12000,
    processingTime: "15-20 days",
  },
  {
    name: "Canada",
    code: "CA",
    image: "/placeholder.svg?height=200&width=300",
    startingPrice: 8000,
    processingTime: "20-30 days",
  },
  {
    name: "Australia",
    code: "AU",
    image: "/placeholder.svg?height=200&width=300",
    startingPrice: 10000,
    processingTime: "15-25 days",
  },
  {
    name: "Germany",
    code: "DE",
    image: "/placeholder.svg?height=200&width=300",
    startingPrice: 7000,
    processingTime: "10-15 days",
  },
  {
    name: "Japan",
    code: "JP",
    image: "/placeholder.svg?height=200&width=300",
    startingPrice: 6000,
    processingTime: "5-10 days",
  },
]

export default function CountriesPreview() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Popular Destinations</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore visa services for the most popular travel destinations worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {popularCountries.map((country) => (
            <Card key={country.code} className="hover:shadow-lg transition-shadow group">
              <CardContent className="p-0">
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <Image
                    src={country.image || "/placeholder.svg"}
                    alt={country.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{country.name}</h3>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Starting from</p>
                      <p className="text-lg font-bold text-green-600">₹{country.startingPrice.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Processing</p>
                      <p className="text-sm font-medium">{country.processingTime}</p>
                    </div>
                  </div>
                  <Button asChild className="w-full">
                    <Link href={`/countries/${country.code.toLowerCase()}`}>View Details</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button asChild size="lg" variant="outline">
            <Link href="/countries" className="inline-flex items-center">
              View All Countries
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
