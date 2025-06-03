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
import { Plus, Edit, Trash2, Upload, Save, X, Copy } from "lucide-react"
import Image from "next/image"
import type { Country, VisaCategory } from "@/lib/types"

export default function CountriesManager() {
  const [countries, setCountries] = useState<Country[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  const [editingCountry, setEditingCountry] = useState<Country | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    image: "",
    visaCategories: [] as VisaCategory[],
  })

  useEffect(() => {
    fetchCountries()
  }, [])

  const fetchCountries = async () => {
    try {
      const response = await fetch("/api/admin/countries")
      if (response.ok) {
        const data = await response.json()
        setCountries(data)
      }
    } catch (error) {
      console.error("Error fetching countries:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const response = await fetch(`/api/upload?filename=${file.name}`, {
        method: "POST",
        body: file,
      })

      if (response.ok) {
        const { url } = await response.json()
        setFormData({ ...formData, image: url })
      } else {
        alert("Failed to upload image")
      }
    } catch (error) {
      console.error("Upload error:", error)
      alert("Error uploading image")
    }
  }

  const addVisaCategory = () => {
    const newCategory: VisaCategory = {
      id: `category_${Date.now()}`,
      name: "",
      type: "Tourist",
      price: 0,
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
      alert("Please add at least one visa category")
      return
    }

    startTransition(async () => {
      try {
        const url = editingCountry ? `/api/admin/countries/${editingCountry._id}` : "/api/admin/countries"
        const method = editingCountry ? "PUT" : "POST"

        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })

        if (response.ok) {
          await fetchCountries()
          resetForm()
          setIsDialogOpen(false)
          alert(editingCountry ? "Country updated successfully!" : "Country added successfully!")
        } else {
          const errorData = await response.json()
          alert(`Failed to save country: ${errorData.error || "Unknown error"}`)
        }
      } catch (error) {
        console.error("Error saving country:", error)
        alert("Error saving country. Please check your connection and try again.")
      }
    })
  }

  const handleEdit = (country: Country) => {
    setEditingCountry(country)
    setFormData({
      name: country.name,
      code: country.code,
      description: country.description,
      image: country.image,
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
          alert("Country deleted successfully!")
        } else {
          alert("Failed to delete country")
        }
      } catch (error) {
        console.error("Error deleting country:", error)
        alert("Error deleting country")
      }
    })
  }

  const resetForm = () => {
    setEditingCountry(null)
    setFormData({
      name: "",
      code: "",
      description: "",
      image: "",
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
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
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
                  />
                  <Button type="button" variant="outline" asChild>
                    <label htmlFor="image-upload" className="cursor-pointer flex items-center">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Image
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
                    <p className="text-gray-500">No visa categories added yet. Click "Add Category" to get started.</p>
                  </div>
                )}

                <div className="space-y-6">
                  {formData.visaCategories.map((category, index) => (
                    <VisaCategoryForm
                      key={category.id}
                      category={category}
                      index={index}
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
                <Button type="submit" disabled={isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  {isPending ? "Saving..." : editingCountry ? "Update Country" : "Add Country"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {countries.map((country) => (
          <Card key={country._id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="p-0">
              <div className="relative h-48 w-full">
                <Image
                  src={country.image || "/placeholder.svg"}
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
                {country.visaCategories && country.visaCategories.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {country.visaCategories.slice(0, 3).map((cat, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {cat.type}
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
  onUpdate,
  onRemove,
  onDuplicate,
}: {
  category: VisaCategory
  index: number
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
                <Label>Price (₹) *</Label>
                <Input
                  type="number"
                  value={category.price}
                  onChange={(e) => updateField("price", Number.parseInt(e.target.value))}
                  required
                />
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
