"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, DollarSign, FileText, CheckCircle } from "lucide-react"
import type { Country } from "@/lib/types"

interface CountryVisaDetailsProps {
  country: Country
}

export default function CountryVisaDetails({ country }: CountryVisaDetailsProps) {
  const visa = country.visa

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Country Header */}
        <div className="bg-white rounded-lg shadow-sm mb-8 overflow-hidden">
          <div className="relative h-64 md:h-80">
            <Image src={country.image || "/placeholder.svg"} alt={country.name} fill className="object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-end">
              <div className="p-6 text-white">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{country.name} B1-B2 Visa</h1>
                <p className="text-lg text-gray-200">{country.description}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Visa Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Visa Type Badge */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Visa Type</CardTitle>
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    {visa.type} - Business & Tourism
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{visa.additionalInfo}</p>
              </CardContent>
            </Card>

            {/* Visa Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Visa Fee</p>
                  <p className="text-xl font-bold text-green-600">₹{visa.price.toLocaleString()}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Processing Time</p>
                  <p className="text-lg font-semibold">{visa.processingTime}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <FileText className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Visa Type</p>
                  <p className="text-lg font-semibold">B1-B2</p>
                </CardContent>
              </Card>
            </div>

            {/* Required Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Required Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {visa.requiredDocuments.map((doc, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm">{doc}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Process Steps */}
            <Card>
              <CardHeader>
                <CardTitle>Application Process</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {visa.processSteps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Badge variant="outline" className="mt-1 flex-shrink-0">
                        {index + 1}
                      </Badge>
                      <p className="text-sm">{step}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Info Sidebar */}
          <div className="space-y-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Quick Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-blue-800">Country Code</p>
                  <p className="text-sm text-blue-600">{country.code}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-800">Visa Type</p>
                  <p className="text-sm text-blue-600">{visa.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-800">Processing Time</p>
                  <p className="text-sm text-blue-600">{visa.processingTime}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-800">Visa Fee</p>
                  <p className="text-sm text-blue-600">₹{visa.price.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-green-700 mb-3">
                  Our visa experts are here to assist you with your application.
                </p>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Email:</strong> visa@journeymytrip.com
                  </p>
                  <p>
                    <strong>Phone:</strong> +91 9876543210
                  </p>
                  <p>
                    <strong>Hours:</strong> 9 AM - 6 PM (Mon-Sat)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
