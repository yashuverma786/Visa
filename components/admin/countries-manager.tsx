"use client"

import { Textarea } from "@/components/ui/textarea"

import { Input } from "@/components/ui/input"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Edit, Trash, Search, RefreshCw, X, Copy, CheckCircle, AlertCircle } from "lucide-react"
import type { Country, VisaType } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

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
  const [visaTypes, setVisaTypes] = useState<VisaType[]>([])
  const [currentVisaType, setCurrentVisaType] = useState<VisaType | null>(null)
  const [isVisaTypeDialogOpen, setIsVisaTypeDialogOpen] = useState(false)
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
      flagEmoji: "",
      visaFee: "",
      processingTime: "",
      description: "",
      requirements: "",
      imageUrl: "",
      visaTypes: [],
    })
    setVisaTypes([])
    setImagePreview(null)
    setIsEditing(false)
    setIsDialogOpen(true)
  }

  const handleEditCountry = (country: Country) => {
    setCurrentCountry(country)
    setVisaTypes(country.visaTypes || [])
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

    const method = isEditing ? "PUT" : "POST"
    const url = isEditing ? `/api/admin/countries/${currentCountry._id}` : "/api/admin/countries"

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...currentCountry, visaTypes }),
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
        console.error("Failed to save country:", await response.text())
        toast({
          title: "Error",
          description: `Failed to ${isEditing ? "update" : "add"} country.`,
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

  const handleAddVisaType = () => {
    setCurrentVisaType({
      type: "",
      price: "",
      processingTime: "",
      validity: "",
      entryType: "",
      documents: [],
      process: [],
      eligibility: [],
    })
    setIsVisaTypeDialogOpen(true)
  }

  const handleEditVisaType = (visaType: VisaType) => {
    setCurrentVisaType({ ...visaType }) // Create a copy to avoid direct mutation
    setIsVisaTypeDialogOpen(true)
  }

  const handleSaveVisaType = () => {
    if (!currentVisaType) return

    if (currentVisaType.type.trim() === "") {
      toast({
        title: "Validation Error",
        description: "Visa Type is required.",
        variant: "destructive",
      })
      return
    }

    setVisaTypes((prev) => {
      const existingIndex = prev.findIndex((vt) => vt.type === currentVisaType.type)
      if (existingIndex > -1) {
        // Update existing
        return prev.map((vt, index) => (index === existingIndex ? currentVisaType : vt))
      } else {
        // Add new
        return [...prev, currentVisaType]
      }
    })
    setIsVisaTypeDialogOpen(false)
    setCurrentVisaType(null)
    toast({
      title: "Success",
      description: "Visa type saved successfully.",
    })
  }

  const handleDeleteVisaType = (typeToDelete: string) => {
    setVisaTypes((prev) => prev.filter((vt) => vt.type !== typeToDelete))
    toast({
      title: "Success",
      description: "Visa type deleted.",
    })
  }

  const handleCopyVisaType = (visaType: VisaType) => {
    const newVisaType = {
      ...visaType,
      type: `${visaType.type} (Copy)`,
    }
    setVisaTypes((prev) => [...prev, newVisaType])
    toast({
      title: "Success",
      description: `Copied visa type: ${newVisaType.type}`,
    })
  }

  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.code.toLowerCase().includes(searchTerm.toLowerCase()),
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
              <div className="flex items-center text-sm text-gray-500 mb-1">
                <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                <span>{country.visaTypes?.length || 0} Visa Types</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <AlertCircle className="h-4 w-4 mr-1 text-orange-500" />
                <span>Processing: {country.processingTime || "N/A"}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCountries.length === 0 && (
        <div className="text-center py-12">
          <div className="h-12 w-12 text-gray-400 mx-auto mb-4"></div>
          <p className="text-gray-500">No countries found matching your criteria.</p>
        </div>
      )}

      {/* Country Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {currentCountry && (
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Edit Country" : "Add New Country"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Tabs defaultValue="basic">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="visaTypes">Visa Types</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="process">Process</TabsTrigger>
                </TabsList>

                {/* Basic Info Tab */}
                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Country Name</Label>
                      <Input
                        id="name"
                        value={currentCountry.name}
                        onChange={(e) => setCurrentCountry({ ...currentCountry, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="code">Country Code (e.g., US, GB)</Label>
                      <Input
                        id="code"
                        value={currentCountry.code}
                        onChange={(e) => setCurrentCountry({ ...currentCountry, code: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={currentCountry.description}
                      onChange={(e) => setCurrentCountry({ ...currentCountry, description: e.target.value })}
                      rows={4}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="visaFee">Visa Fee (e.g., ₹5,000)</Label>
                      <Input
                        id="visaFee"
                        value={currentCountry.visaFee}
                        onChange={(e) => setCurrentCountry({ ...currentCountry, visaFee: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="processingTime">Processing Time (e.g., 5-7 business days)</Label>
                      <Input
                        id="processingTime"
                        value={currentCountry.processingTime}
                        onChange={(e) => setCurrentCountry({ ...currentCountry, processingTime: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="requirements">General Requirements (separated by new lines)</Label>
                    <Textarea
                      id="requirements"
                      value={currentCountry.requirements}
                      onChange={(e) => setCurrentCountry({ ...currentCountry, requirements: e.target.value })}
                      rows={6}
                    />
                  </div>
                  <div>
                    <Label htmlFor="image">Country Image</Label>
                    <Input id="image" type="file" onChange={handleImageUpload} disabled={uploadingImage} />
                    {uploadingImage && <p className="text-sm text-gray-500 mt-2">Uploading image...</p>}
                    {imagePreview && (
                      <div className="mt-4 relative w-32 h-32">
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Image Preview"
                          className="w-full h-full object-cover rounded-md"
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
                </TabsContent>

                {/* Visa Types Tab */}
                <TabsContent value="visaTypes" className="space-y-4">
                  <Button onClick={handleAddVisaType}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Visa Type
                  </Button>
                  <div className="space-y-3">
                    {visaTypes.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No visa types added yet.</p>
                    )}
                    {visaTypes.map((vt, index) => (
                      <Card key={index} className="p-4 flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{vt.type}</h4>
                          <p className="text-sm text-gray-600">Price: {vt.price || "N/A"}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleCopyVisaType(vt)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleEditVisaType(vt)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteVisaType(vt.type)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Documents Tab (Placeholder for now, can be expanded) */}
                <TabsContent value="documents" className="space-y-4">
                  <p className="text-gray-600">
                    This section can be used to list general documents required for all visa types for this country.
                    Specific documents for each visa type can be managed within the "Visa Types" tab.
                  </p>
                  <div>
                    <Label htmlFor="generalDocuments">General Documents (separated by new lines)</Label>
                    <Textarea
                      id="generalDocuments"
                      value={currentCountry.generalDocuments || ""}
                      onChange={(e) => setCurrentCountry({ ...currentCountry, generalDocuments: e.target.value })}
                      rows={6}
                    />
                  </div>
                </TabsContent>

                {/* Process Tab (Placeholder for now, can be expanded) */}
                <TabsContent value="process" className="space-y-4">
                  <p className="text-gray-600">
                    This section can outline the general visa application process for this country. Specific process
                    steps for each visa type can be managed within the "Visa Types" tab.
                  </p>
                  <div>
                    <Label htmlFor="generalProcess">General Process Steps (separated by new lines)</Label>
                    <Textarea
                      id="generalProcess"
                      value={currentCountry.generalProcess || ""}
                      onChange={(e) => setCurrentCountry({ ...currentCountry, generalProcess: e.target.value })}
                      rows={6}
                    />
                  </div>
                </TabsContent>
              </Tabs>
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

      {/* Visa Type Dialog */}
      <Dialog open={isVisaTypeDialogOpen} onOpenChange={setIsVisaTypeDialogOpen}>
        {currentVisaType && (
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {currentVisaType.type ? `Edit ${currentVisaType.type} Visa` : "Add New Visa Type"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="visaType">Visa Type Name</Label>
                  <Input
                    id="visaType"
                    value={currentVisaType.type}
                    onChange={(e) => setCurrentVisaType({ ...currentVisaType, type: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="visaPrice">Price (e.g., ₹5,000)</Label>
                  <Input
                    id="visaPrice"
                    value={currentVisaType.price}
                    onChange={(e) => setCurrentVisaType({ ...currentVisaType, price: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="visaProcessingTime">Processing Time</Label>
                  <Input
                    id="visaProcessingTime"
                    value={currentVisaType.processingTime}
                    onChange={(e) => setCurrentVisaType({ ...currentVisaType, processingTime: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="visaValidity">Validity</Label>
                  <Input
                    id="visaValidity"
                    value={currentVisaType.validity}
                    onChange={(e) => setCurrentVisaType({ ...currentVisaType, validity: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="entryType">Entry Type (e.g., Single, Multiple)</Label>
                <Input
                  id="entryType"
                  value={currentVisaType.entryType}
                  onChange={(e) => setCurrentVisaType({ ...currentVisaType, entryType: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="documents">Required Documents (separated by new lines)</Label>
                <Textarea
                  id="documents"
                  value={currentVisaType.documents.join("\n")}
                  onChange={(e) => setCurrentVisaType({ ...currentVisaType, documents: e.target.value.split("\n") })}
                  rows={6}
                />
              </div>
              <div>
                <Label htmlFor="processSteps">Process Steps (separated by new lines)</Label>
                <Textarea
                  id="processSteps"
                  value={currentVisaType.process.join("\n")}
                  onChange={(e) => setCurrentVisaType({ ...currentVisaType, process: e.target.value.split("\n") })}
                  rows={6}
                />
              </div>
              <div>
                <Label htmlFor="eligibilityCriteria">Eligibility Criteria (separated by new lines)</Label>
                <Textarea
                  id="eligibilityCriteria"
                  value={currentVisaType.eligibility.join("\n")}
                  onChange={(e) => setCurrentVisaType({ ...currentVisaType, eligibility: e.target.value.split("\n") })}
                  rows={6}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsVisaTypeDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveVisaType}>Save Visa Type</Button>
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
