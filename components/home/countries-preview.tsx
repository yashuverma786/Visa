import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, MapPin, Clock } from "lucide-react"
import { getCountries } from "@/lib/database"

export default async function CountriesPreview() {
  let countries = []

  try {
    countries = await getCountries()
    // Show only first 6 countries for preview
    countries = countries.slice(0, 6)
  } catch (error) {
    console.error("Error fetching countries for preview:", error)
    countries = []
  }

  if (countries.length === 0) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-fade-in">Popular Destinations</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 animate-fade-in-delay">
              We're adding new destinations. Please check back soon!
            </p>
            <div className="animate-bounce">
              <MapPin className="h-16 w-16 text-gray-400 mx-auto" />
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-fade-in">Popular Destinations</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-delay">
            Explore visa services for the most popular travel destinations worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {countries.map((country, index) => {
            // Get the cheapest visa category for display
            const cheapestCategory = country.visaCategories?.reduce((prev, current) =>
              prev.price < current.price ? prev : current,
            )
            const startingPrice = cheapestCategory?.price || 0
            const processingTime = cheapestCategory?.processingTime || "Contact us"

            return (
              <Card
                key={country._id}
                className="hover:shadow-xl transition-all duration-500 group animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-0">
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <Image
                      src={country.image || "/placeholder.svg?height=300&width=400"}
                      alt={country.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-4 right-4">
                      <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-800 animate-pulse">
                        {country.visaCategories?.length || 0} Categories
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                      {country.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{country.description}</p>

                    <div className="flex justify-between items-center mb-4">
                      <div className="animate-fade-in">
                        <p className="text-sm text-gray-500">Starting from</p>
                        <p className="text-lg font-bold text-green-600">₹{startingPrice.toLocaleString("en-IN")}</p>
                      </div>
                      <div className="text-right animate-fade-in-delay">
                        <p className="text-sm text-gray-500 flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          Processing
                        </p>
                        <p className="text-sm font-medium">{processingTime}</p>
                      </div>
                    </div>

                    {/* Show visa types */}
                    {country.visaCategories && country.visaCategories.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {country.visaCategories.slice(0, 3).map((category, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 animate-fade-in"
                              style={{ animationDelay: `${idx * 50}ms` }}
                            >
                              {category.type}
                            </span>
                          ))}
                          {country.visaCategories.length > 3 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              +{country.visaCategories.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <Button
                      asChild
                      className="w-full group-hover:bg-blue-700 transition-all duration-300 transform group-hover:scale-105"
                    >
                      <Link href={`/countries/${country.code.toLowerCase()}`}>
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center animate-fade-in-up">
          <Button asChild size="lg" variant="outline" className="hover:scale-105 transition-all duration-300">
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
