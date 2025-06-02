"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, Filter } from "lucide-react"

export default function CountriesSearch() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("")
  const [selectedVisaType, setSelectedVisaType] = useState("")

  const handleSearch = () => {
    // This would typically filter the countries list
    console.log("Searching with:", { searchTerm, selectedRegion, selectedVisaType })
  }

  const handleReset = () => {
    setSearchTerm("")
    setSelectedRegion("")
    setSelectedVisaType("")
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center mb-4">
        <Search className="h-5 w-5 text-gray-400 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">Find Your Destination</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <Input
            placeholder="Search countries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        <Select value={selectedRegion} onValueChange={setSelectedRegion}>
          <SelectTrigger>
            <SelectValue placeholder="Select Region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="north-america">North America</SelectItem>
            <SelectItem value="europe">Europe</SelectItem>
            <SelectItem value="asia">Asia</SelectItem>
            <SelectItem value="oceania">Oceania</SelectItem>
            <SelectItem value="africa">Africa</SelectItem>
            <SelectItem value="south-america">South America</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedVisaType} onValueChange={setSelectedVisaType}>
          <SelectTrigger>
            <SelectValue placeholder="Visa Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tourist">Tourist Visa</SelectItem>
            <SelectItem value="business">Business Visa</SelectItem>
            <SelectItem value="family">Family Visit</SelectItem>
            <SelectItem value="student">Student Visa</SelectItem>
            <SelectItem value="transit">Transit Visa</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mt-4">
        <Button onClick={handleSearch} className="flex items-center">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
        <Button variant="outline" onClick={handleReset} className="flex items-center">
          <Filter className="h-4 w-4 mr-2" />
          Reset Filters
        </Button>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>Popular searches: USA, UK, Canada, Australia, Germany, Japan</p>
      </div>
    </div>
  )
}
