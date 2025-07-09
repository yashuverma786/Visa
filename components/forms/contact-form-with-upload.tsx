"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FileText, X, CheckCircle, AlertCircle, ChevronRight } from "lucide-react"

interface UploadedFile {
  name: string
  size: number
  type: string
  url?: string
}

export default function ContactFormWithUpload() {
  const [isPending, startTransition] = useTransition()
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [uploadError, setUploadError] = useState<string>("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    visaType: "",
    message: "",
  })

  const visaTypes = [
    "Tourist Visa",
    "Business Visa",
    "Student Visa",
    "Work Visa",
    "Family Visa",
    "Transit Visa",
    "Other",
  ]

  const countries = [
    "USA",
    "Canada",
    "UK",
    "Australia",
    "Germany",
    "France",
    "Italy",
    "Spain",
    "Netherlands",
    "Switzerland",
    "Japan",
    "Singapore",
    "Dubai",
    "Other",
  ]

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setUploadError("")

    for (const file of files) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError(`File ${file.name} is too large. Maximum size is 5MB.`)
        continue
      }

      // Check file type
      const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"]
      if (!allowedTypes.includes(file.type)) {
        setUploadError(`File ${file.name} has invalid type. Only PDF, JPG, and PNG files are allowed.`)
        continue
      }

      try {
        // Upload to Vercel Blob
        const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
          method: "POST",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        })

        if (response.ok) {
          const { url, filename, size, type } = await response.json()

          setUploadedFiles((prev) => [
            ...prev,
            {
              name: filename,
              size: size,
              type: type,
              url: url,
            },
          ])
        } else {
          const errorData = await response.json()
          setUploadError(`Failed to upload ${file.name}: ${errorData.error}`)
        }
      } catch (error) {
        console.error("Upload error:", error)
        setUploadError(`Error uploading ${file.name}`)
      }
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please fill in all required fields.")
      return
    }

    startTransition(async () => {
      try {
        const submissionData = {
          ...formData,
          documents: uploadedFiles,
        }

        const response = await fetch("/api/form-leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submissionData),
        })

        if (response.ok) {
          alert("Form submitted successfully! We will contact you soon.")
          // Reset form
          setFormData({
            name: "",
            email: "",
            phone: "",
            country: "",
            visaType: "",
            message: "",
          })
          setUploadedFiles([])
          setUploadError("")
        } else {
          const errorData = await response.json()
          alert(`Failed to submit form: ${errorData.error}`)
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

  return (
    <section className="py-12 bg-gray-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <svg
          className="absolute top-0 left-0 w-full h-full opacity-30"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#e6efff"
            fillOpacity="1"
            d="M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,197.3C672,224,768,224,864,197.3C960,171,1056,117,1152,117.3C1248,117,1344,171,1392,197.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Card className="shadow-xl border-blue-100 overflow-hidden animate-fade-in-up">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
            <CardTitle className="text-2xl">Contact Us for Visa Assistance</CardTitle>
            <p className="text-blue-100">
              Fill out the form below and upload any relevant documents. We'll get back to you soon!
            </p>
          </CardHeader>
          <CardContent className="p-6 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-700">
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-gray-700">
                    Country/Destination
                  </Label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) => setFormData({ ...formData, country: value })}
                  >
                    <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="visaType" className="text-gray-700">
                  Visa Type
                </Label>
                <Select
                  value={formData.visaType}
                  onValueChange={(value) => setFormData({ ...formData, visaType: value })}
                >
                  <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300">
                    <SelectValue placeholder="Select visa type" />
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

              <div className="space-y-2">
                <Label htmlFor="message" className="text-gray-700">
                  Message
                </Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your visa requirements, travel dates, or any questions you have..."
                  rows={4}
                  className="border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                />
              </div>

              {/* Document Upload */}
              <div className="space-y-2">
                <Label className="text-gray-700">Upload Documents (Optional)</Label>
                <p className="text-sm text-gray-500 mb-2">
                  Upload any relevant documents like passport copy, photos, etc.
                </p>
                <div className="mt-2">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <Upload className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-bounce-custom" />
                    <p className="text-gray-600 mb-2">Drag and drop your documents here, or click to browse</p>
                    <p className="text-sm text-gray-500 mb-4">Supported formats: PDF, JPG, PNG (Max 5MB per file)</p>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button type="button" variant="outline" asChild className="hover-lift transition-all duration-300">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        Choose Files
                      </label>
                    </Button>
                  </div>
                </div>

                {/* Upload Error */}
                {uploadError && (
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center animate-fade-in-up">
                    <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                    <p className="text-sm text-red-700">{uploadError}</p>
                  </div>
                )}

                {/* Uploaded Files List */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="font-medium text-gray-900">Uploaded Documents:</h4>
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors animate-fade-in-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="hover:bg-red-50 hover:text-red-600 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full gradient-black-shine text-white border-0 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group"
                  size="lg"
                >
                  {isPending ? (
                    "Submitting..."
                  ) : (
                    <span className="flex items-center justify-center">
                      Submit Form
                      <ChevronRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  )}
                </Button>
                <p className="text-sm text-gray-500 mt-2 text-center">
                  By submitting this form, you agree to our terms and conditions. We will contact you within 24 hours.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
