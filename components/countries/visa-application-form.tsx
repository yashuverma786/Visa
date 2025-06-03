"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FileText, X, CheckCircle } from "lucide-react"
import type { Country, VisaCategory } from "@/lib/types"

interface VisaApplicationFormProps {
  country: Country
}

interface UploadedFile {
  name: string
  size: number
  type: string
  url?: string
}

export default function VisaApplicationForm({ country }: VisaApplicationFormProps) {
  const [isPending, startTransition] = useTransition()
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [selectedCategory, setSelectedCategory] = useState<VisaCategory | null>(country.visaCategories?.[0] || null)
  const [formData, setFormData] = useState({
    applicantName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    nationality: "",
    passportNumber: "",
    travelDate: "",
    purpose: "",
    additionalInfo: "",
  })

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        alert(`File ${file.name} is too large. Maximum size is 10MB.`)
        continue
      }

      try {
        // Upload to Vercel Blob
        const response = await fetch(`/api/upload?filename=${file.name}`, {
          method: "POST",
          body: file,
        })

        if (response.ok) {
          const { url } = await response.json()

          setUploadedFiles((prev) => [
            ...prev,
            {
              name: file.name,
              size: file.size,
              type: file.type,
              url: url,
            },
          ])
        } else {
          alert(`Failed to upload ${file.name}`)
        }
      } catch (error) {
        console.error("Upload error:", error)
        alert(`Error uploading ${file.name}`)
      }
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedCategory) {
      alert("Please select a visa category.")
      return
    }

    if (uploadedFiles.length === 0) {
      alert("Please upload at least one document.")
      return
    }

    startTransition(async () => {
      try {
        const applicationData = {
          ...formData,
          country: country.name,
          visaCategory: selectedCategory.name,
          documents: uploadedFiles,
        }

        const response = await fetch("/api/visa-applications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(applicationData),
        })

        if (response.ok) {
          alert("Application submitted successfully! We will contact you soon.")
          // Reset form
          setFormData({
            applicantName: "",
            email: "",
            phone: "",
            dateOfBirth: "",
            nationality: "",
            passportNumber: "",
            travelDate: "",
            purpose: "",
            additionalInfo: "",
          })
          setUploadedFiles([])
        } else {
          alert("Failed to submit application. Please try again.")
        }
      } catch (error) {
        console.error("Submission error:", error)
        alert("An error occurred. Please try again.")
      }
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Ensure visa categories exist
  if (!country.visaCategories || country.visaCategories.length === 0) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-600">Visa categories not available for this country.</p>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Apply for {country.name} Visa</CardTitle>
            <p className="text-gray-600">
              Fill out the form below and upload your documents to start your visa application process.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Visa Category Selection */}
              <div>
                <Label htmlFor="visaCategory">Select Visa Category *</Label>
                <Select
                  value={selectedCategory?.id || ""}
                  onValueChange={(value) => {
                    const category = country.visaCategories.find((cat) => cat.id === value)
                    setSelectedCategory(category || null)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a visa category" />
                  </SelectTrigger>
                  <SelectContent>
                    {country.visaCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name} - ₹{category.price.toLocaleString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Selected Category Details */}
              {selectedCategory && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-blue-900">Processing Time</p>
                      <p className="text-sm text-blue-700">{selectedCategory.processingTime}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-900">Validity</p>
                      <p className="text-sm text-blue-700">{selectedCategory.validity}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-900">Visa Fee</p>
                      <p className="text-lg font-bold text-green-600">₹{selectedCategory.price.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="applicantName">Full Name *</Label>
                  <Input
                    id="applicantName"
                    value={formData.applicantName}
                    onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nationality">Nationality *</Label>
                  <Input
                    id="nationality"
                    value={formData.nationality}
                    onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="passportNumber">Passport Number *</Label>
                  <Input
                    id="passportNumber"
                    value={formData.passportNumber}
                    onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="travelDate">Intended Travel Date</Label>
                  <Input
                    id="travelDate"
                    type="date"
                    value={formData.travelDate}
                    onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="purpose">Purpose of Visit</Label>
                  <Input
                    id="purpose"
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    placeholder="e.g., Tourism, Business, Family Visit"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="additionalInfo">Additional Information</Label>
                <Textarea
                  id="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                  placeholder="Any additional information or special requirements"
                  rows={3}
                />
              </div>

              {/* Document Upload */}
              <div>
                <Label>Upload Documents *</Label>
                <div className="mt-2">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Drag and drop your documents here, or click to browse</p>
                    <p className="text-sm text-gray-500 mb-4">Supported formats: PDF, JPG, PNG (Max 10MB per file)</p>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button type="button" variant="outline" asChild>
                      <label htmlFor="file-upload" className="cursor-pointer">
                        Choose Files
                      </label>
                    </Button>
                  </div>
                </div>

                {/* Uploaded Files List */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="font-medium text-gray-900">Uploaded Documents:</h4>
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Required Documents List */}
                {selectedCategory && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Required Documents for {selectedCategory.name}:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      {selectedCategory.requiredDocuments?.map((doc, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                          {doc}
                        </li>
                      )) || []}
                    </ul>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={isPending || uploadedFiles.length === 0 || !selectedCategory}
                  className="w-full"
                  size="lg"
                >
                  {isPending ? "Submitting Application..." : "Submit Visa Application"}
                </Button>
                <p className="text-sm text-gray-500 mt-2 text-center">
                  By submitting this form, you agree to our terms and conditions. We will email your documents to our
                  visa processing team.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
