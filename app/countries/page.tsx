import { Suspense } from "react"
import CountriesList from "@/components/countries/countries-list"
import CountriesSearch from "@/components/countries/countries-search"

// Force dynamic rendering to ensure fresh data
export const dynamic = "force-dynamic"
export const revalidate = 0

export default function CountriesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Visa Services by Country</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our comprehensive visa services for destinations worldwide. Get expert assistance for your travel
            documentation needs.
          </p>
        </div>

        <div className="mb-8">
          <CountriesSearch />
        </div>

        <Suspense
          fallback={
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading countries...</p>
            </div>
          }
        >
          <CountriesList />
        </Suspense>
      </div>
    </div>
  )
}
