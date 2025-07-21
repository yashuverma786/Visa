"use client"

import type React from "react"
import { useState, useEffect, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, Upload, Save, X, Copy, RefreshCw } from "lucide-react"
import Image from "next/image"
import type { Country, VisaCategory } from "@/lib/types"
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
  const [isPending, startTransition] = useTransition()
  const [editingCountry, setEditingCountry] = useState<Country | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    slug: "",
    description: "",
    image: "",
    currency: "INR",
    visaCategories: [] as VisaCategory[],
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchCountries()
  }, [])

  const fetchCountries = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/admin/countries", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      })
      if (response.ok) {
        const data = await response.json()
        console.log("Fetched countries:", data.length)
        setCountries(data)
      } else {
        console.error("Failed to fetch countries:", response.status)
        toast({
          title: "Error",
          description: "Failed to fetch countries",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching countries:", error)
      toast({
        title: "Error",
        description: "Error fetching countries",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive",
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size should be less than 5MB",
        variant: "destructive",
      })
      return
    }

    try {
      setUploadingImage(true)
      console.log("Uploading image:", file.name, file.size)

      const formDataUpload = new FormData()
      formDataUpload.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      })

      if (response.ok) {
        const { url } = await response.json()
        console.log("Image uploaded successfully:", url)
        setFormData({ ...formData, image: url })
        toast({
          title: "Success",
          description: "Image uploaded successfully!",
        })
      } else {
        const errorData = await response.json()
        console.error("Upload failed:", errorData)
        toast({
          title: "Error",
          description: `Failed to upload image: ${errorData.error || "Unknown error"}`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Error",
        description: "Error uploading image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploadingImage(false)
    }
  }

  const addVisaCategory = () => {
    const newCategory: VisaCategory = {
      id: `category_${Date.now()}`,
      name: "",
      type: "Tourist",
      price: 0,
      currency: formData.currency,
      processingTime: "",
      validity: "",
      entries: "Single",
      requiredDocuments: [""],
      processSteps: [""],
      eligibility: [""],
      additionalInfo: "",
    }
    setFormData({
      ...formData,
      visaCategories: [...formData.visaCategories, newCategory],
    })
  }

  const updateVisaCategory = (index: number, category: VisaCategory) => {
    const newCategories = [...formData.visaCategories]
    newCategories[index] = category
    setFormData({ ...formData, visaCategories: newCategories })
  }

  const removeVisaCategory = (index: number) => {
    const newCategories = formData.visaCategories.filter((_, i) => i !== index)
    setFormData({ ...formData, visaCategories: newCategories })
  }

  const duplicateVisaCategory = (index: number) => {
    const categoryToDuplicate = { ...formData.visaCategories[index] }
    categoryToDuplicate.id = `category_${Date.now()}`
    categoryToDuplicate.name = `${categoryToDuplicate.name} (Copy)`
    const newCategories = [...formData.visaCategories]
    newCategories.splice(index + 1, 0, categoryToDuplicate)
    setFormData({ ...formData, visaCategories: newCategories })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.visaCategories.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please add at least one visa category",
        variant: "destructive",
      })
      return
    }

    // Validate all required fields
    if (!formData.name.trim() || !formData.code.trim() || !formData.description.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Generate slug if not provided
    const slug = formData.slug || generateSlug(formData.name)

    // Validate visa categories
    for (let i = 0; i < formData.visaCategories.length; i++) {
      const category = formData.visaCategories[i]
      if (!category.name.trim() || !category.processingTime.trim() || !category.validity.trim()) {
        toast({
          title: "Validation Error",
          description: `Please complete all fields for visa category ${i + 1}`,
          variant: "destructive",
        })
        return
      }
      if (category.price <= 0) {
        toast({
          title: "Validation Error",
          description: `Please enter a valid price for visa category ${i + 1}`,
          variant: "destructive",
        })
        return
      }
    }

    startTransition(async () => {
      try {
        const url = editingCountry ? `/api/admin/countries/${editingCountry._id}` : "/api/admin/countries"
        const method = editingCountry ? "PUT" : "POST"

        const countryData = {
          name: formData.name,
          code: formData.code,
          slug: slug,
          description: formData.description,
          image: formData.image,
          currency: formData.currency,
          visaCategories: formData.visaCategories,
        }

        console.log("Submitting country data:", {
          method,
          url,
          name: countryData.name,
          code: countryData.code,
          slug: countryData.slug,
          categoriesCount: countryData.visaCategories.length,
          hasImage: !!countryData.image,
        })

        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(countryData),
        })

        const responseData = await response.json()

        if (response.ok) {
          console.log("Country saved successfully")
          await fetchCountries() // Refresh the list
          resetForm()
          setIsDialogOpen(false)
          toast({
            title: "Success",
            description: editingCountry ? "Country updated successfully!" : "Country added successfully!",
          })
        } else {
          console.error("Failed to save country:", responseData)
          toast({
            title: "Error",
            description: `Failed to save country: ${responseData.error || "Unknown error"}`,
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error saving country:", error)
        toast({
          title: "Error",
          description: "Error saving country. Please check your connection and try again.",
          variant: "destructive",
        })
      }
    })
  }

  const handleEdit = (country: Country) => {
    setEditingCountry(country)
    setFormData({
      name: country.name,
      code: country.code,
      slug: country.slug,
      description: country.description,
      image: country.image,
      currency: country.currency || "INR",
      visaCategories: country.visaCategories || [],
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this country?")) return

    startTransition(async () => {
      try {
        const response = await fetch(`/api/admin/countries/${id}`, {
          method: "DELETE",
        })

        if (response.ok) {
          await fetchCountries()
          toast({
            title: "Success",
            description: "Country deleted successfully!",
          })
        } else {
          toast({
            title: "Error",
            description: "Failed to delete country",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error deleting country:", error)
        toast({
          title: "Error",
          description: "Error deleting country",
          variant: "destructive",
        })
      }
    })
  }

  const resetForm = () => {
    setEditingCountry(null)
    setFormData({
      name: "",
      code: "",
      slug: "",
      description: "",
      image: "",
      currency: "INR",
      visaCategories: [],
    })
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading countries...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Countries Management</h2>
        <div className="flex gap-2">
          <Button onClick={fetchCountries} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add Country
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingCountry ? "Edit Country" : "Add New Country"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Country Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Country Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => {
                        const name = e.target.value
                        setFormData({
                          ...formData,
                          name,
                          slug: formData.slug || generateSlug(name),
                        })
                      }}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug">Country Slug *</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="e.g., uk, usa, canada"
                      required
                    />
                    {formData.name && (
                      <p className="text-xs text-gray-500 mt-1">
                        URL: /countries/{formData.slug || generateSlug(formData.name)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="code">Country Code *</Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      placeholder="e.g., US, GB, CA"
                      maxLength={3}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="currency">Default Currency *</Label>
                    <Select
                      value={formData.currency}
                      onValueChange={(value) => setFormData({ ...formData, currency: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            {currency.symbol} {currency.code} - {currency.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="image">Country Image</Label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                      disabled={uploadingImage}
                    />
                    <Button type="button" variant="outline" asChild disabled={uploadingImage}>
                      <label htmlFor="image-upload" className="cursor-pointer flex items-center">
                        <Upload className="h-4 w-4 mr-2" />
                        {uploadingImage ? "Uploading..." : "Upload Image"}
                      </label>
                    </Button>
                    {formData.image && (
                      <div className="relative w-32 h-24">
                        <Image
                          src={formData.image || "/placeholder.svg"}
                          alt="Preview"
                          fill
                          className="object-cover rounded"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                          onClick={() => setFormData({ ...formData, image: "" })}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Visa Categories */}
                <div className="border-t pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Visa Categories *</h3>
                    <Button type="button" onClick={addVisaCategory} variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Category
                    </Button>
                  </div>

                  {formData.visaCategories.length === 0 && (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">
                        No visa categories added yet. Click "Add Category" to get started.
                      </p>
                    </div>
                  )}

                  <div className="space-y-6">
                    {formData.visaCategories.map((category, index) => (
                      <VisaCategoryForm
                        key={category.id}
                        category={category}
                        index={index}
                        defaultCurrency={formData.currency}
                        onUpdate={updateVisaCategory}
                        onRemove={removeVisaCategory}
                        onDuplicate={duplicateVisaCategory}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-6 border-t">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isPending || uploadingImage}>
                    <Save className="h-4 w-4 mr-2" />
                    {isPending ? "Saving..." : editingCountry ? "Update Country" : "Add Country"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {countries.map((country) => (
          <Card key={country._id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="p-0">
              <div className="relative h-48 w-full">
                <Image
                  src={country.image || "/placeholder.svg?height=300&width=400"}
                  alt={country.name}
                  fill
                  className="object-cover rounded-t-lg"
                />
                <div className="absolute top-2 right-2">
                  <Badge className="bg-blue-600">{country.visaCategories?.length || 0} Categories</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{country.name}</h3>
                <span className="text-sm text-gray-500">{country.code}</span>
              </div>

              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{country.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Categories:</span>
                  <span className="font-semibold">{country.visaCategories?.length || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Currency:</span>
                  <span className="font-semibold">{country.currency || "INR"}</span>
                </div>
                <div className="text-xs text-gray-400">URL: /countries/{country.slug}</div>
                {country.visaCategories && country.visaCategories.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {country.visaCategories.slice(0, 3).map((cat, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {cat.type} - {currencies.find((c) => c.code === cat.currency)?.symbol || "₹"}
                        {cat.price.toLocaleString()}
                      </Badge>
                    ))}
                    {country.visaCategories.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{country.visaCategories.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(country)} className="flex-1">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(country._id!)} disabled={isPending}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {countries.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No countries found. Add your first country to get started.</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add First Country
          </Button>
        </div>
      )}
    </div>
  )
}

// Visa Category Form Component
function VisaCategoryForm({
  category,
  index,
  defaultCurrency,
  onUpdate,
  onRemove,
  onDuplicate,
}: {
  category: VisaCategory
  index: number
  defaultCurrency: string
  onUpdate: (index: number, category: VisaCategory) => void
  onRemove: (index: number) => void
  onDuplicate: (index: number) => void
}) {
  const updateField = (field: keyof VisaCategory, value: any) => {
    onUpdate(index, { ...category, [field]: value })
  }

  const updateArrayField = (
    field: "requiredDocuments" | "processSteps" | "eligibility",
    index: number,
    value: string,
  ) => {
    const newArray = [...category[field]]
    newArray[index] = value
    updateField(field, newArray)
  }

  const addArrayItem = (field: "requiredDocuments" | "processSteps" | "eligibility") => {
    updateField(field, [...category[field], ""])
  }

  const removeArrayItem = (field: "requiredDocuments" | "processSteps" | "eligibility", itemIndex: number) => {
    const newArray = category[field].filter((_, i) => i !== itemIndex)
    updateField(field, newArray)
  }

  const selectedCurrency =
    currencies.find((c) => c.code === category.currency) ||
    currencies.find((c) => c.code === defaultCurrency) ||
    currencies[5]

  return (
    <Card className="border-2 border-dashed border-gray-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Visa Category {index + 1}</CardTitle>
          <div className="flex space-x-2">
            <Button type="button" variant="outline" size="sm" onClick={() => onDuplicate(index)}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button type="button" variant="destructive" size="sm" onClick={() => onRemove(index)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="process">Process</TabsTrigger>
            <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Category Name *</Label>
                <Input
                  value={category.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="e.g., Tourist Visa (B-2)"
                  required
                />
              </div>
              <div>
                <Label>Type *</Label>
                <Select value={category.type} onValueChange={(value) => updateField("type", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tourist">Tourist</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Student">Student</SelectItem>
                    <SelectItem value="Work">Work</SelectItem>
                    <SelectItem value="Family">Family</SelectItem>
                    <SelectItem value="Transit">Transit</SelectItem>
                    <SelectItem value="Medical">Medical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Price *</Label>
                <div className="flex">
                  <Select value={category.currency} onValueChange={(value) => updateField("currency", value)}>
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
                    type="number"
                    value={category.price}
                    onChange={(e) => updateField("price", Number.parseInt(e.target.value) || 0)}
                    className="flex-1 ml-2"
                    min="0"
                    placeholder="0"
                    required
                  />
                </div>
              </div>
              <div>
                <Label>Processing Time *</Label>
                <Input
                  value={category.processingTime}
                  onChange={(e) => updateField("processingTime", e.target.value)}
                  placeholder="e.g., 15-30 days"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Validity *</Label>
                <Input
                  value={category.validity}
                  onChange={(e) => updateField("validity", e.target.value)}
                  placeholder="e.g., Up to 10 years"
                  required
                />
              </div>
              <div>
                <Label>Entries *</Label>
                <Select
                  value={category.entries}
                  onValueChange={(value: "Single" | "Multiple") => updateField("entries", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single">Single Entry</SelectItem>
                    <SelectItem value="Multiple">Multiple Entry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Additional Information</Label>
              <Textarea
                value={category.additionalInfo}
                onChange={(e) => updateField("additionalInfo", e.target.value)}
                rows={3}
                placeholder="Any additional information about this visa category"
              />
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <div>
              <Label>Required Documents *</Label>
              <div className="space-y-2 mt-2">
                {category.requiredDocuments.map((doc, docIndex) => (
                  <div key={docIndex} className="flex items-center space-x-2">
                    <Input
                      value={doc}
                      onChange={(e) => updateArrayField("requiredDocuments", docIndex, e.target.value)}
                      placeholder="Enter required document"
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem("requiredDocuments", docIndex)}
                      disabled={category.requiredDocuments.length === 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={() => addArrayItem("requiredDocuments")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Document
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="process" className="space-y-4">
            <div>
              <Label>Process Steps *</Label>
              <div className="space-y-2 mt-2">
                {category.processSteps.map((step, stepIndex) => (
                  <div key={stepIndex} className="flex items-center space-x-2">
                    <span className="text-sm font-medium w-8">{stepIndex + 1}.</span>
                    <Input
                      value={step}
                      onChange={(e) => updateArrayField("processSteps", stepIndex, e.target.value)}
                      placeholder="Enter process step"
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem("processSteps", stepIndex)}
                      disabled={category.processSteps.length === 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={() => addArrayItem("processSteps")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Step
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="eligibility" className="space-y-4">
            <div>
              <Label>Eligibility Criteria *</Label>
              <div className="space-y-2 mt-2">
                {category.eligibility.map((criteria, criteriaIndex) => (
                  <div key={criteriaIndex} className="flex items-center space-x-2">
                    <Input
                      value={criteria}
                      onChange={(e) => updateArrayField("eligibility", criteriaIndex, e.target.value)}
                      placeholder="Enter eligibility criteria"
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem("eligibility", criteriaIndex)}
                      disabled={category.eligibility.length === 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={() => addArrayItem("eligibility")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Criteria
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
