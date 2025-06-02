"use client"

import type React from "react"

import { useState, useEffect, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Upload, Save, X } from "lucide-react"
import Image from "next/image"
import type { Country } from "@/lib/types"

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
    visa: {
      type: "B1-B2" as const,
      price: 0,
      processingTime: "",
      requiredDocuments: [""],
      processSteps: [""],
      additionalInfo: "",
    },
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

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
          alert("Failed to save country")
        }
      } catch (error) {
        console.error("Error saving country:", error)
        alert("Error saving country")
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
      visa: { ...country.visa },
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
      visa: {
        type: "B1-B2",
        price: 0,
        processingTime: "",
        requiredDocuments: [""],
        processSteps: [""],
        additionalInfo: "",
      },
    })
  }

  const addDocumentField = () => {
    setFormData({
      ...formData,
      visa: {
        ...formData.visa,
        requiredDocuments: [...formData.visa.requiredDocuments, ""],
      },
    })
  }

  const removeDocumentField = (index: number) => {
    const newDocs = formData.visa.requiredDocuments.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      visa: {
        ...formData.visa,
        requiredDocuments: newDocs,
      },
    })
  }

  const updateDocumentField = (index: number, value: string) => {
    const newDocs = [...formData.visa.requiredDocuments]
    newDocs[index] = value
    setFormData({
      ...formData,
      visa: {
        ...formData.visa,
        requiredDocuments: newDocs,
      },
    })
  }

  const addProcessStep = () => {
    setFormData({
      ...formData,
      visa: {
        ...formData.visa,
        processSteps: [...formData.visa.processSteps, ""],
      },
    })
  }

  const removeProcessStep = (index: number) => {
    const newSteps = formData.visa.processSteps.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      visa: {
        ...formData.visa,
        processSteps: newSteps,
      },
    })
  }

  const updateProcessStep = (index: number, value: string) => {
    const newSteps = [...formData.visa.processSteps]
    newSteps[index] = value
    setFormData({
      ...formData,
      visa: {
        ...formData.visa,
        processSteps: newSteps,
      },
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
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCountry ? "Edit Country" : "Add New Country"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
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

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Visa Details (B1-B2)</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="price">Visa Fee (₹) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.visa.price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          visa: { ...formData.visa, price: Number.parseInt(e.target.value) },
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="processingTime">Processing Time *</Label>
                    <Input
                      id="processingTime"
                      value={formData.visa.processingTime}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          visa: { ...formData.visa, processingTime: e.target.value },
                        })
                      }
                      placeholder="e.g., 15-30 days"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <Label>Required Documents *</Label>
                  <div className="space-y-2 mt-2">
                    {formData.visa.requiredDocuments.map((doc, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={doc}
                          onChange={(e) => updateDocumentField(index, e.target.value)}
                          placeholder="Enter required document"
                          required
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeDocumentField(index)}
                          disabled={formData.visa.requiredDocuments.length === 1}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" onClick={addDocumentField}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Document
                    </Button>
                  </div>
                </div>

                <div className="mb-4">
                  <Label>Process Steps *</Label>
                  <div className="space-y-2 mt-2">
                    {formData.visa.processSteps.map((step, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="text-sm font-medium w-8">{index + 1}.</span>
                        <Input
                          value={step}
                          onChange={(e) => updateProcessStep(index, e.target.value)}
                          placeholder="Enter process step"
                          required
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeProcessStep(index)}
                          disabled={formData.visa.processSteps.length === 1}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" onClick={addProcessStep}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Step
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="additionalInfo">Additional Information</Label>
                  <Textarea
                    id="additionalInfo"
                    value={formData.visa.additionalInfo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        visa: { ...formData.visa, additionalInfo: e.target.value },
                      })
                    }
                    rows={3}
                    placeholder="Any additional visa information"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
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
                <Badge className="absolute top-2 right-2 bg-blue-600">{country.visa.type}</Badge>
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
                  <span>Visa Fee:</span>
                  <span className="font-semibold text-green-600">₹{country.visa.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Processing:</span>
                  <span>{country.visa.processingTime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Documents:</span>
                  <span>{country.visa.requiredDocuments.length} required</span>
                </div>
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
