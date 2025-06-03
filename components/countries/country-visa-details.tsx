"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, DollarSign, FileText, CheckCircle, Users, Calendar, Globe } from "lucide-react"
import type { Country, VisaCategory } from "@/lib/types"

interface CountryVisaDetailsProps {
  country: Country
}

export default function CountryVisaDetails({ country }: CountryVisaDetailsProps) {
  const [selectedCategory, setSelectedCategory] = useState<VisaCategory | null>(country.visaCategories?.[0] || null)

  if (!country.visaCategories || country.visaCategories.length === 0) {
    return (
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{country.name}</h1>
            <p className="text-gray-600">Visa information not available for this country.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Country Header */}
        <div className="bg-white rounded-lg shadow-sm mb-8 overflow-hidden">
          <div className="relative h-64 md:h-80">
            <Image src={country.image || "/placeholder.svg"} alt={country.name} fill className="object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-end">
              <div className="p-6 text-white">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{country.name} Visa Services</h1>
                <p className="text-lg text-gray-200">{country.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Visa Category Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Select Visa Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {country.visaCategories.map((category) => (
              <Card
                key={category.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedCategory?.id === category.id ? "ring-2 ring-blue-500 bg-blue-50" : ""
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                    <Badge variant={selectedCategory?.id === category.id ? "default" : "secondary"}>
                      {category.type}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>₹{category.price.toLocaleString()}</p>
                    <p>{category.processingTime}</p>
                    <p>{category.validity}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Selected Category Details */}
        {selectedCategory && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Category Overview */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Globe className="h-5 w-5 mr-2" />
                      {selectedCategory.name}
                    </CardTitle>
                    <Badge variant="secondary" className="text-lg px-4 py-2">
                      {selectedCategory.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{selectedCategory.additionalInfo}</p>
                </CardContent>
              </Card>

              {/* Key Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Visa Fee</p>
                    <p className="text-xl font-bold text-green-600">₹{selectedCategory.price.toLocaleString()}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Processing Time</p>
                    <p className="text-lg font-semibold">{selectedCategory.processingTime}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Validity</p>
                    <p className="text-lg font-semibold">{selectedCategory.validity}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Information Tabs */}
              <Card>
                <CardContent className="p-6">
                  <Tabs defaultValue="documents" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="documents">Documents</TabsTrigger>
                      <TabsTrigger value="process">Process</TabsTrigger>
                      <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
                    </TabsList>

                    <TabsContent value="documents" className="mt-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center">
                          <FileText className="h-5 w-5 mr-2" />
                          Required Documents
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {selectedCategory.requiredDocuments.map((doc, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                              <span className="text-sm">{doc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="process" className="mt-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Application Process</h3>
                        <div className="space-y-4">
                          {selectedCategory.processSteps.map((step, index) => (
                            <div key={index} className="flex items-start space-x-3">
                              <Badge variant="outline" className="mt-1 flex-shrink-0">
                                {index + 1}
                              </Badge>
                              <p className="text-sm">{step}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="eligibility" className="mt-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center">
                          <Users className="h-5 w-5 mr-2" />
                          Eligibility Criteria
                        </h3>
                        <div className="space-y-2">
                          {selectedCategory.eligibility.map((criteria, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0" />
                              <span className="text-sm">{criteria}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-800">Quick Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-blue-800">Country</p>
                    <p className="text-sm text-blue-600">
                      {country.name} ({country.code})
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-800">Visa Type</p>
                    <p className="text-sm text-blue-600">{selectedCategory.type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-800">Processing Time</p>
                    <p className="text-sm text-blue-600">{selectedCategory.processingTime}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-800">Visa Fee</p>
                    <p className="text-sm text-blue-600">₹{selectedCategory.price.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-800">Validity</p>
                    <p className="text-sm text-blue-600">{selectedCategory.validity}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-800">Entries</p>
                    <p className="text-sm text-blue-600">{selectedCategory.entries}</p>
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

              <Card>
                <CardContent className="p-4 text-center">
                  <Button className="w-full" size="lg">
                    Apply for {selectedCategory.name}
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">Click to start your visa application process</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
