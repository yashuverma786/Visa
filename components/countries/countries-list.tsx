import { getCountries } from "@/lib/database"
import CountryCard from "./country-card"

export default async function CountriesList() {
  let countries = []

  try {
    countries = await getCountries()
  } catch (error) {
    console.error("Error fetching countries:", error)
    countries = []
  }

  // Ensure countries is always an array
  if (!Array.isArray(countries)) {
    countries = []
  }

  if (countries.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">No countries found. Please check back later.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {countries.map((country) => (
        <CountryCard key={country._id} country={country} />
      ))}
    </div>
  )
}
