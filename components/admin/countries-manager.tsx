"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash, Search, RefreshCw, X, Upload, Copy } from "lucide-react"
import type { Country, VisaType } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
]

const visaTypes = ["Tourist", "Business", "Student", "Work", "Transit", "Medical", "Family Visit"]
const entryTypes = ["Single entry", "Multiple entry", "Double entry"]

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export default function CountriesManager() {
  const [countries, setCountries] = useState<Country[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false)
  const [currentCountry, setCurrentCountry] = useState<Country | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [visaCategories, setVisaCategories] = useState<VisaType[]>([])
  const { toast } = useToast()

  useEffect(() => {
    fetchCountries()
  }, [])

  const fetchCountries = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/admin/countries")
      if (response.ok) {
        const data = await response.json()
        setCountries(data)
      } else {
        console.error("Failed to fetch countries:", await response.text())
        toast({
          title: "Error",
          description: "Failed to fetch countries.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching countries:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred while fetching countries.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddCountry = () => {
    setCurrentCountry({
      _id: "",
      name: "",
      code: "",
      slug: "",
      flagEmoji: "",
      visaFee: "",
      currency: "USD",
      processingTime: "",
      description: "",
      requirements: "",
      imageUrl: "",
      visaTypes: [],
      visaCategories: [],
    })
    setVisaCategories([
      {
        type: "Tourist",
        price: "",
        currency: "USD",
        processingTime: "",
        validity: "",
        entryType: "Single entry",
        documents: [],
        process: [],
        eligibility: [],
      },
    ])
    setImagePreview(null)
    setIsEditing(false)
    setIsDialogOpen(true)
  }

  const handleEditCountry = (country: Country) => {
    setCurrentCountry(country)
    setVisaCategories(
      country.visaCategories || [
        {
          type: "Tourist",
          price: "",
          currency: country.currency || "USD",
          processingTime: "",
          validity: "",
          entryType: "Single entry",
          documents: [],
          process: [],
          eligibility: [],
        },
      ],
    )
    setImagePreview(country.imageUrl || null)
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  const handleDeleteCountry = (country: Country) => {
    setCurrentCountry(country)
    setIsConfirmDeleteOpen(true)
  }

  const confirmDeleteCountry = async () => {
    if (!currentCountry?._id) return

    try {
      const response = await fetch(`/api/admin/countries/${currentCountry._id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setCountries(countries.filter((c) => c._id !== currentCountry._id))
        toast({
          title: "Success",
          description: "Country deleted successfully.",
        })
      } else {
        console.error("Failed to delete country:", await response.text())
        toast({
          title: "Error",
          description: "Failed to delete country.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting country:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred while deleting the country.",
        variant: "destructive",
      })
    } finally {
      setIsConfirmDeleteOpen(false)
      setCurrentCountry(null)
    }
  }

  const handleSaveCountry = async () => {
    if (!currentCountry) return

    // Validation
    if (!currentCountry.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Country name is required.",
        variant: "destructive",
      })
      return
    }

    if (!currentCountry.code.trim()) {
      toast({
        title: "Validation Error",
        description: "Country code is required.",
        variant: "destructive",
      })
      return
    }

    if (!currentCountry.description.trim()) {
      toast({
        title: "Validation Error",
        description: "Description is required.",
        variant: "destructive",
      })
      return
    }

    if (visaCategories.length === 0) {
      toast({
        title: "Validation Error",
        description: "At least one visa category is required.",
        variant: "destructive",
      })
      return
    }

    // Generate slug from country name if not provided
    const slug = currentCountry.slug || generateSlug(currentCountry.name)
    const countryWithData = {
      ...currentCountry,
      slug,
      visaCategories: visaCategories.filter((cat) => cat.type && cat.price),
    }

    const method = isEditing ? "PUT" : "POST"
    const url = isEditing ? `/api/admin/countries/${currentCountry._id}` : "/api/admin/countries"

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(countryWithData),
      })

      if (response.ok) {
        const savedCountry = await response.json()
        if (isEditing) {
          setCountries(countries.map((c) => (c._id === savedCountry._id ? savedCountry : c)))
        } else {
          setCountries([...countries, savedCountry])
        }
        toast({
          title: "Success",
          description: `Country ${isEditing ? "updated" : "added"} successfully.`,
        })
        setIsDialogOpen(false)
      } else {
        const errorData = await response.json()
        console.error("Failed to save country:", errorData)
        toast({
          title: "Error",
          description: errorData.error || `Failed to ${isEditing ? "update" : "add"} country.`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving country:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred while saving the country.",
        variant: "destructive",
      })
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setImagePreview(data.url)
        setCurrentCountry((prev) => (prev ? { ...prev, imageUrl: data.url } : null))
        toast({
          title: "Success",
          description: "Image uploaded successfully.",
        })
      } else {
        console.error("Failed to upload image:", await response.text())
        toast({
          title: "Error",
          description: "Failed to upload image.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred during image upload.",
        variant: "destructive",
      })
    } finally {
      setUploadingImage(false)
    }
  }

  const addVisaCategory = () => {
    setVisaCategories([
      ...visaCategories,
      {
        type: "Tourist",
        price: "",
        currency: currentCountry?.currency || "USD",
        processingTime: "",
        validity: "",
        entryType: "Single entry",
        documents: [],
        process: [],
        eligibility: [],
      },
    ])
  }

  const removeVisaCategory = (index: number) => {
    setVisaCategories(visaCategories.filter((_, i) => i !== index))
  }

  const updateVisaCategory = (index: number, field: string, value: string) => {
    const updated = [...visaCategories]
    updated[index] = { ...updated[index], [field]: value }
    setVisaCategories(updated)
  }

  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (country.slug && country.slug.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  if (isLoading) {
    return <div className="text-center py-8">Loading countries...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Countries Management</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline" size="sm" onClick={fetchCountries}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          <Button onClick={handleAddCountry}>
            <Plus className="h-4 w-4 mr-1" />
            Add Country
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCountries.map((country) => (
          <Card key={country._id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {country.imageUrl && (
                    <img
                      src={country.imageUrl || "/placeholder.svg"}
                      alt={`${country.name} flag`}
                      className="w-8 h-8 object-cover rounded-full"
                    />
                  )}
                  <h3 className="text-lg font-semibold">
                    {country.name} ({country.code})
                  </h3>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditCountry(country)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteCountry(country)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">{country.description}</p>
              <div className="text-sm text-gray-500 mb-1">
                Price: {country.currency} {country.visaFee}
              </div>
              <div className="text-sm text-gray-500 mb-1">Processing: {country.processingTime || "N/A"}</div>
              <div className="text-sm text-gray-500 mb-1">Categories: {country.visaCategories?.length || 0}</div>
              <div className="text-xs text-gray-400">URL: /countries/{country.slug || generateSlug(country.name)}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCountries.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No countries found matching your criteria.</p>
        </div>
      )}

      {/* Country Dialog - Matching Screenshot Layout */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {currentCountry && (
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Edit Country" : "Add New Country"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              {/* Country Name and Code Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Country Name *</Label>
                  <Input
                    id="name"
                    value={currentCountry.name}
                    onChange={(e) => setCurrentCountry({ ...currentCountry, name: e.target.value })}
                    placeholder="e.g., United Kingdom"
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Country Slug *</Label>
                  <Input
                    id="slug"
                    value={currentCountry.slug}
                    onChange={(e) => setCurrentCountry({ ...currentCountry, slug: e.target.value })}
                    placeholder="e.g., uk, usa, ca"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={currentCountry.description}
                  onChange={(e) => setCurrentCountry({ ...currentCountry, description: e.target.value })}
                  rows={4}
                  placeholder="Enter country description..."
                />
              </div>

              {/* Country Image */}
              <div>
                <Label htmlFor="image">Country Image</Label>
                <div className="mt-2">
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("image-upload")?.click()}
                      disabled={uploadingImage}
                      className="flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      {uploadingImage ? "Uploading..." : "Upload Image"}
                    </Button>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                  {imagePreview && (
                    <div className="mt-4 relative w-32 h-32">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Country Preview"
                        className="w-full h-full object-cover rounded-md border"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                        onClick={() => {
                          setImagePreview(null)
                          setCurrentCountry((prev) => (prev ? { ...prev, imageUrl: "" } : null))
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Visa Categories */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-base font-semibold">Visa Categories *</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addVisaCategory}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Category
                  </Button>
                </div>

                <div className="space-y-6">
                  {visaCategories.map((category, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium">Visa Category {index + 1}</h4>
                        <div className="flex gap-2">
                          {index > 0 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const newCategory = { ...category }
                                setVisaCategories([...visaCategories, newCategory])
                              }}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          )}
                          {visaCategories.length > 1 && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeVisaCategory(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="grid gap-4">
                        {/* Category Name and Type Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Category Name *</Label>
                            <Input
                              value={category.categoryName || ""}
                              onChange={(e) => updateVisaCategory(index, "categoryName", e.target.value)}
                              placeholder="e.g., Tourist Visa (B-2)"
                            />
                          </div>
                          <div>
                            <Label>Type *</Label>
                            <Select
                              value={category.type}
                              onValueChange={(value) => updateVisaCategory(index, "type", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                {visaTypes.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Price and Processing Time Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Price (₹) *</Label>
                            <div className="flex">
                              <Select
                                value={category.currency}
                                onValueChange={(value) => updateVisaCategory(index, "currency", value)}
                              >
                                <SelectTrigger className="w-20">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {currencies.map((curr) => (
                                    <SelectItem key={curr.code} value={curr.code}>
                                      {curr.symbol}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Input
                                value={category.price}
                                onChange={(e) => updateVisaCategory(index, "price", e.target.value)}
                                placeholder="0"
                                className="flex-1 ml-2"
                              />
                            </div>
                          </div>
                          <div>
                            <Label>Processing Time *</Label>
                            <Input
                              value={category.processingTime}
                              onChange={(e) => updateVisaCategory(index, "processingTime", e.target.value)}
                              placeholder="e.g., 15-30 days"
                            />
                          </div>
                        </div>

                        {/* Validity and Entries Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Validity *</Label>
                            <Input
                              value={category.validity}
                              onChange={(e) => updateVisaCategory(index, "validity", e.target.value)}
                              placeholder="e.g., Up to 10 years"
                            />
                          </div>
                          <div>
                            <Label>Entries *</Label>
                            <Select
                              value={category.entryType}
                              onValueChange={(value) => updateVisaCategory(index, "entryType", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select entry type" />
                              </SelectTrigger>
                              <SelectContent>
                                {entryTypes.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Additional Information */}
                        <div>
                          <Label>Additional Information</Label>
                          <Textarea
                            value={category.additionalInfo || ""}
                            onChange={(e) => updateVisaCategory(index, "additionalInfo", e.target.value)}
                            rows={3}
                            placeholder="Any additional information about this visa category"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveCountry}>{isEditing ? "Update Country" : "Add Country"}</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Are you sure you want to delete "{currentCountry?.name}"? This action cannot be undone.
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteCountry}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
