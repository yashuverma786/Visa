import type { Metadata } from "next"
import { notFound } from "next/navigation"
import CountryVisaDetails from "@/components/countries/country-visa-details"
import VisaApplicationForm from "@/components/countries/visa-application-form"
import { sampleCountries } from "@/lib/seed-data"

interface CountryPageProps {
  params: Promise<{ code: string }>
}

async function getCountryByCode(code: string) {
  try {
    // Try to fetch from database via API
    const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000"
    const response = await fetch(`${baseUrl}/api/countries/${code}`, {
      cache: "no-store",
    })

    if (response.ok) {
      const country = await response.json()
      return country
    }
  } catch (error) {
    console.error("Error fetching country from API:", error)
  }

  // Fallback to sample data
  const sampleCountry = sampleCountries.find((c) => c.code === code.toUpperCase())
  if (sampleCountry) {
    return {
      ...sampleCountry,
      _id: `sample_${code}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }

  return null
}

export async function generateMetadata({ params }: CountryPageProps): Promise<Metadata> {
  const { code } = await params
  const country = await getCountryByCode(code)

  if (!country) {
    return {
      title: "Country Not Found",
    }
  }

  return {
    title: `${country.name} Visa Services - Requirements & Application`,
    description: `Get your ${country.name} visa with JMT Travel. Complete visa requirements, documents needed, and step-by-step application process.`,
  }
}

export default async function CountryPage({ params }: CountryPageProps) {
  const { code } = await params
  const country = await getCountryByCode(code)

  if (!country) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CountryVisaDetails country={country} />
      <VisaApplicationForm country={country} />
    </div>
  )
}

export async function generateStaticParams() {
  // Generate static params for sample countries
  return sampleCountries.map((country) => ({
    code: country.code.toLowerCase(),
  }))
}
