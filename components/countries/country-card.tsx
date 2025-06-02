import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Country } from "@/lib/types"

interface CountryCardProps {
  country: Country
}

export default function CountryCard({ country }: CountryCardProps) {
  // Safely get the visa price
  const visaPrice = country.visa?.price || 0

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={country.image || "/placeholder.svg"}
            alt={country.name}
            fill
            className="object-cover rounded-t-lg"
          />
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-white/90">
              {country.visa?.type || "B1-B2"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{country.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{country.description}</p>

        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">Starting from</span>
          <span className="text-lg font-bold text-green-600">₹{visaPrice.toLocaleString()}</span>
        </div>

        <Button asChild className="w-full">
          <Link href={`/countries/${country.code.toLowerCase()}`}>View Details</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
