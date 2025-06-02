import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getCountryByCode } from "@/lib/database"
import CountryVisaDetails from "@/components/countries/country-visa-details"
import VisaApplicationForm from "@/components/countries/visa-application-form"

interface CountryPageProps {
  params: {
    code: string
  }
}

export async function generateMetadata({ params }: CountryPageProps): Promise<Metadata> {
  const country = await getCountryByCode(params.code.toUpperCase())

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
}
