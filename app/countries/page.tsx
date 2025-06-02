import type { Metadata } from "next"
import { Suspense } from "react"
import CountriesList from "@/components/countries/countries-list"
import CountriesSearch from "@/components/countries/countries-search"

export const metadata: Metadata = {
  title: "Countries - Visa Services for All Destinations",
  description:
    "Explore visa services for all countries worldwide. Find detailed visa information, requirements, and application process for your destination.",
}

export default function CountriesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Visa Services for All Countries</h1>
          <p className="text-xl text-green-100 max-w-3xl mx-auto">
            Find detailed visa information and requirements for your destination country
          </p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CountriesSearch />
        </div>
      </section>

      {/* Countries List */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<div className="text-center py-20">Loading countries...</div>}>
            <CountriesList />
          </Suspense>
        </div>
      </section>
    </div>
  )
}
