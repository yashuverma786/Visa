"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Eye,
  Download,
  Mail,
  Calendar,
  Phone,
  FileText,
  User,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Printer,
} from "lucide-react"
import type { VisaApplication } from "@/lib/types"

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

const downloadApplicationData = (application: VisaApplication) => {
  const data = {
    applicationId: application._id,
    personalInformation: {
      fullName: application.applicantName,
      email: application.email,
      phone: application.phone,
      dateOfBirth: application.dateOfBirth,
      nationality: application.nationality,
      passportNumber: application.passportNumber,
    },
    travelInformation: {
      destinationCountry: application.country,
      travelDate: application.travelDate,
      purposeOfVisit: application.purpose,
      applicationStatus: application.status,
    },
    documents: application.documents.map((doc) => ({
      name: doc.name,
      type: doc.type,
      url: doc.url,
      size: doc.size,
    })),
    additionalInfo: application.additionalInfo,
    submittedAt: application.submittedAt,
    notes: application.notes,
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `visa-application-${application.applicantName}-${application._id}.json`
  link.click()
  URL.revokeObjectURL(url)
}

const printApplicationData = (application: VisaApplication) => {
  const printWindow = window.open("", "_blank")
  if (!printWindow) return

  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Visa Application - ${application.applicantName}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .section { margin-bottom: 20px; }
        .section-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; border-bottom: 2px solid #333; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .info-item { margin-bottom: 8px; }
        .label { font-weight: bold; }
        .status { padding: 4px 8px; border-radius: 4px; }
        .status.approved { background-color: #d4edda; color: #155724; }
        .status.pending { background-color: #fff3cd; color: #856404; }
        .status.processing { background-color: #d1ecf1; color: #0c5460; }
        .status.rejected { background-color: #f8d7da; color: #721c24; }
        .documents { margin-top: 10px; }
        .document-item { margin-bottom: 5px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Visa Application Details</h1>
        <p>Application ID: ${application._id}</p>
      </div>
      
      <div class="section">
        <div class="section-title">Personal Information</div>
        <div class="info-grid">
          <div class="info-item"><span class="label">Full Name:</span> ${application.applicantName}</div>
          <div class="info-item"><span class="label">Email:</span> ${application.email}</div>
          <div class="info-item"><span class="label">Phone:</span> ${application.phone}</div>
          <div class="info-item"><span class="label">Date of Birth:</span> ${application.dateOfBirth || "Not provided"}</div>
          <div class="info-item"><span class="label">Nationality:</span> ${application.nationality || "Not provided"}</div>
          <div class="info-item"><span class="label">Passport Number:</span> ${application.passportNumber || "Not provided"}</div>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">Travel Information</div>
        <div class="info-grid">
          <div class="info-item"><span class="label">Destination:</span> ${application.country}</div>
          <div class="info-item"><span class="label">Travel Date:</span> ${application.travelDate || "Not specified"}</div>
          <div class="info-item"><span class="label">Purpose:</span> ${application.purpose || "Not specified"}</div>
          <div class="info-item"><span class="label">Status:</span> <span class="status ${application.status}">${application.status.toUpperCase()}</span></div>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">Documents (${application.documents.length})</div>
        <div class="documents">
          ${application.documents
            .map(
              (doc) => `
            <div class="document-item">• ${doc.name} (${doc.type})</div>
          `,
            )
            .join("")}
        </div>
      </div>
      
      ${
        application.additionalInfo
          ? `
      <div class="section">
        <div class="section-title">Additional Information</div>
        <p>${application.additionalInfo}</p>
      </div>
      `
          : ""
      }
      
      <div class="section">
        <div class="section-title">Application Timeline</div>
        <p><span class="label">Submitted:</span> ${new Date(application.submittedAt).toLocaleString()}</p>
        <p><span class="label">Current Status:</span> ${application.status}</p>
      </div>
    </body>
    </html>
  `

  printWindow.document.write(printContent)
  printWindow.document.close()
  printWindow.print()
}

export default function ApplicationsManager() {
  const [applications, setApplications] = useState<VisaApplication[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedApplication, setSelectedApplication] = useState<VisaApplication | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const response = await fetch("/api/admin/applications")
      if (response.ok) {
        const data = await response.json()
        setApplications(data)
      }
    } catch (error) {
      console.error("Error fetching applications:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateApplicationStatus = async (id: string, status: string, notes?: string) => {
    try {
      const response = await fetch(`/api/admin/applications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes }),
      })

      if (response.ok) {
        await fetchApplications()
        alert("Application status updated successfully!")
      } else {
        alert("Failed to update application status")
      }
    } catch (error) {
      console.error("Error updating application:", error)
      alert("Error updating application")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      case "processing":
        return <Clock className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const filteredApplications = applications.filter((app) => statusFilter === "all" || app.status === statusFilter)

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading applications...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Visa Applications</h2>
        <div className="flex items-center space-x-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Applications</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredApplications.map((application) => (
          <Card key={application._id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{application.applicantName}</h3>
                    <p className="text-gray-600 flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {application.country} Visa
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(application.status)}>
                    {getStatusIcon(application.status)}
                    <span className="ml-1">
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                  </Badge>
                  <Dialog
                    open={isDialogOpen && selectedApplication?._id === application._id}
                    onOpenChange={(open) => {
                      setIsDialogOpen(open)
                      if (!open) setSelectedApplication(null)
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedApplication(application)
                          setIsDialogOpen(true)
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{application.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{application.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>{formatDate(application.submittedAt)}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <FileText className="h-4 w-4" />
                  <span>{application.documents.length} documents uploaded</span>
                </div>

                <div className="flex space-x-2">
                  <Select
                    value={application.status}
                    onValueChange={(value) => updateApplicationStatus(application._id!, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced Application Details Dialog */}
      {selectedApplication && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
            <DialogHeader className="border-b pb-4">
              <div className="flex justify-between items-center">
                <DialogTitle className="text-2xl font-bold flex items-center">
                  <User className="h-6 w-6 mr-2 text-blue-600" />
                  Application Details - {selectedApplication.applicantName}
                </DialogTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => printApplicationData(selectedApplication)}>
                    <Printer className="h-4 w-4 mr-1" />
                    Print
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => downloadApplicationData(selectedApplication)}>
                    <Download className="h-4 w-4 mr-1" />
                    Download Data
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                <span>Application ID: {selectedApplication._id}</span>
                <span>•</span>
                <span>Submitted: {formatDate(selectedApplication.submittedAt)}</span>
                <span>•</span>
                <Badge className={getStatusColor(selectedApplication.status)}>
                  {getStatusIcon(selectedApplication.status)}
                  <span className="ml-1">
                    {selectedApplication.status.charAt(0).toUpperCase() + selectedApplication.status.slice(1)}
                  </span>
                </Badge>
              </div>
            </DialogHeader>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              {/* Left Column - Personal & Travel Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Personal Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <User className="h-5 w-5 mr-2 text-blue-600" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium text-gray-600">Full Name</Label>
                        <p className="font-medium text-lg">{selectedApplication.applicantName}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-sm font-medium text-gray-600">Email Address</Label>
                        <p className="font-medium">{selectedApplication.email}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-sm font-medium text-gray-600">Phone Number</Label>
                        <p className="font-medium">{selectedApplication.phone}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-sm font-medium text-gray-600">Date of Birth</Label>
                        <p className="font-medium">{selectedApplication.dateOfBirth || "Not provided"}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-sm font-medium text-gray-600">Nationality</Label>
                        <p className="font-medium">{selectedApplication.nationality || "Not provided"}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-sm font-medium text-gray-600">Passport Number</Label>
                        <p className="font-medium">{selectedApplication.passportNumber || "Not provided"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Travel Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-green-600" />
                      Travel Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium text-gray-600">Destination Country</Label>
                        <p className="font-medium text-lg">{selectedApplication.country}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-sm font-medium text-gray-600">Travel Date</Label>
                        <p className="font-medium">{selectedApplication.travelDate || "Not specified"}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-sm font-medium text-gray-600">Purpose of Visit</Label>
                        <p className="font-medium">{selectedApplication.purpose || "Not specified"}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-sm font-medium text-gray-600">Application Status</Label>
                        <Badge className={getStatusColor(selectedApplication.status)}>
                          {getStatusIcon(selectedApplication.status)}
                          <span className="ml-1">
                            {selectedApplication.status.charAt(0).toUpperCase() + selectedApplication.status.slice(1)}
                          </span>
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Documents */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-purple-600" />
                        Uploaded Documents ({selectedApplication.documents.length})
                      </div>
                      {selectedApplication.documents.length > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            selectedApplication.documents.forEach((doc) => {
                              const link = document.createElement("a")
                              link.href = doc.url
                              link.download = doc.name
                              link.click()
                            })
                          }}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download All
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedApplication.documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded">
                              <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <p className="text-sm text-gray-500">
                                {doc.type} • {formatFileSize(doc.size || 0)}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => window.open(doc.url, "_blank")}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const link = document.createElement("a")
                                link.href = doc.url
                                link.download = doc.name
                                link.click()
                              }}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      ))}
                      {selectedApplication.documents.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                          <p>No documents uploaded</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Additional Information */}
                {selectedApplication.additionalInfo && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Additional Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="whitespace-pre-wrap">{selectedApplication.additionalInfo}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Right Column - Quick Actions & Timeline */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full" onClick={() => window.open(`mailto:${selectedApplication.email}`)}>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => window.open(`tel:${selectedApplication.phone}`)}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call Applicant
                    </Button>
                    <Separator />
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => printApplicationData(selectedApplication)}
                    >
                      <Printer className="h-4 w-4 mr-2" />
                      Print Details
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => downloadApplicationData(selectedApplication)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Data
                    </Button>
                  </CardContent>
                </Card>

                {/* Application Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-orange-600" />
                      Application Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                        <div>
                          <p className="font-medium">Application Submitted</p>
                          <p className="text-sm text-gray-500">{formatDate(selectedApplication.submittedAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${
                            selectedApplication.status === "pending"
                              ? "bg-yellow-500"
                              : selectedApplication.status === "processing"
                                ? "bg-blue-500"
                                : selectedApplication.status === "approved"
                                  ? "bg-green-500"
                                  : "bg-red-500"
                          }`}
                        ></div>
                        <div>
                          <p className="font-medium">Current Status</p>
                          <p className="text-sm text-gray-500">
                            {selectedApplication.status.charAt(0).toUpperCase() + selectedApplication.status.slice(1)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Admin Notes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Admin Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Add notes about this application..."
                      defaultValue={selectedApplication.notes || ""}
                      rows={4}
                      onBlur={(e) => {
                        if (e.target.value !== selectedApplication.notes) {
                          updateApplicationStatus(selectedApplication._id!, selectedApplication.status, e.target.value)
                        }
                      }}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {filteredApplications.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            {statusFilter === "all" ? "No applications found." : `No ${statusFilter} applications found.`}
          </p>
        </div>
      )}
    </div>
  )
}
