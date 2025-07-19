import type { Metadata } from "next"
import { notFound } from "next/navigation"
import CountryVisaDetails from "@/components/countries/country-visa-details"
import VisaApplicationForm from "@/components/countries/visa-application-form"
import { sampleCountries } from "@/lib/seed-data"

interface CountryPageProps {
  params: Promise<{ slug: string }>
}

async function getCountryBySlug(slug: string) {
  try {
    // Try to fetch from database via API using slug
    const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000"
    const response = await fetch(`${baseUrl}/api/countries/slug/${slug}`, {
      cache: "no-store",
    })

    if (response.ok) {
      const country = await response.json()
      return country
    }
  } catch (error) {
    console.error("Error fetching country from API:", error)
  }

  // Fallback to sample data by matching slug
  const sampleCountry = sampleCountries.find(
    (c) =>
      c.name
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-") === slug,
  )
  if (sampleCountry) {
    return {
      ...sampleCountry,
      _id: `sample_${slug}`,
      slug: slug,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }

  return null
}

export async function generateMetadata({ params }: CountryPageProps): Promise<Metadata> {
  const { slug } = await params
  const country = await getCountryBySlug(slug)

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
  const { slug } = await params
  const country = await getCountryBySlug(slug)

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
  // Generate static params for sample countries using slugs
  return sampleCountries.map((country) => ({
    slug: country.name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-"),
  }))
}
