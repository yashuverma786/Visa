"use client"

import { notFound } from "next/navigation"
import { getCountryByCode } from "@/lib/database"
import CountryVisaDetails from "@/components/countries/country-visa-details"
import VisaApplicationForm from "@/components/countries/visa-application-form"
import { unstable_noStore as noStore } from "next/cache"

interface CountryPageProps {
  params: {
    code: string
  }
}

export default async function CountryPageClient({ params }: CountryPageProps) {
  noStore()
  try {
    const country = await getCountryByCode(params.code.toUpperCase())

    if (!country) {
      notFound()
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <CountryVisaDetails country={country} />
        <VisaApplicationForm country={country} />
      </div>
    )
  } catch (error) {
    console.error("Error loading country page:", error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Country Information Unavailable</h2>
          <p className="text-gray-600 mb-6">
            We're having trouble loading information for this country. Please try again later or contact our support
            team.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
            <a
              href="/countries"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              View All Countries
            </a>
          </div>
        </div>
      </div>
    )
  }
}
