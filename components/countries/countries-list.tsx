import { getCountries } from "@/lib/database"
import CountryCard from "./country-card"

export default async function CountriesList() {
  let countries = []

  try {
    console.log("🔍 Fetching countries for frontend...")
    countries = await getCountries()
    console.log(`✅ Found ${countries.length} countries for frontend`)
  } catch (error) {
    console.error("❌ Error fetching countries for frontend:", error)
    countries = []
  }

  // Ensure countries is always an array
  if (!Array.isArray(countries)) {
    console.warn("⚠️ Countries is not an array, converting...")
    countries = []
  }

  if (countries.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">No countries found. Please check back later.</p>
        <p className="text-gray-400 text-sm mt-2">If you're an admin, please add countries from the admin panel.</p>
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
