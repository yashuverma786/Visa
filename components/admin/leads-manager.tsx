"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  Eye,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Search,
  Target,
  FileText,
  Download,
  Printer,
  User,
  Globe,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  FileDown,
  RefreshCw,
} from "lucide-react"
import type { LeadCapture } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LeadsManager() {
  const [leads, setLeads] = useState<LeadCapture[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLead, setSelectedLead] = useState<LeadCapture | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [sourceFilter, setSourceFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/admin/leads")
      if (response.ok) {
        const data = await response.json()
        setLeads(data)
      } else {
        console.error("Failed to fetch leads:", await response.text())
      }
    } catch (error) {
      console.error("Error fetching leads:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getSourceColor = (source: string) => {
    switch (source) {
      case "popup":
        return "bg-purple-100 text-purple-800"
      case "hero":
        return "bg-blue-100 text-blue-800"
      case "contact":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "popup":
        return "🎯"
      case "hero":
        return "🏠"
      case "contact":
        return "📞"
      default:
        return "📝"
    }
  }

  const filteredLeads = leads.filter((lead) => {
    const matchesSource = sourceFilter === "all" || lead.source === sourceFilter
    const matchesSearch =
      lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone?.includes(searchTerm) ||
      (lead.placeToVisit && lead.placeToVisit.toLowerCase().includes(searchTerm.toLowerCase()))

    return matchesSource && matchesSearch
  })

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const sendEmail = (email: string, name: string) => {
    const subject = `Follow-up: Your Visa Inquiry - JMT Travel`
    const body = `Dear ${name},\n\nThank you for your interest in our visa services. We would like to discuss your travel plans and assist you with your visa application.\n\nPlease let us know a convenient time to call you.\n\nBest regards,\nJMT Travel Team`

    window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
  }

  const downloadLeadData = (lead: LeadCapture) => {
    const leadData = {
      personalInfo: {
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
      },
      inquiryDetails: {
        destination: lead.placeToVisit || lead.country || "Not specified",
        visaType: lead.visaType || "Not specified",
        message: lead.message || "No message provided",
        source: lead.source,
        capturedAt: lead.createdAt ? new Date(lead.createdAt).toISOString() : new Date().toISOString(),
      },
      documents: lead.documents || [],
    }

    const dataStr = JSON.stringify(leadData, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = `lead-${lead.name}-${new Date().toISOString().slice(0, 10)}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  const printLeadDetails = (lead: LeadCapture) => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const createdAt = lead.createdAt ? formatDate(lead.createdAt) : "Unknown"

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Lead Details - ${lead.name}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 30px; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
          .title { font-size: 20px; margin-bottom: 20px; }
          .section { margin-bottom: 20px; }
          .section-title { font-size: 16px; font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 10px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
          .info-item { margin-bottom: 5px; }
          .label { font-weight: bold; }
          .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #666; }
          table { width: 100%; border-collapse: collapse; }
          table, th, td { border: 1px solid #ddd; }
          th, td { padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">JMT Travel</div>
          <div class="title">Lead Details Report</div>
        </div>
        
        <div class="section">
          <div class="section-title">Personal Information</div>
          <div class="info-grid">
            <div class="info-item"><span class="label">Name:</span> ${lead.name || "Not provided"}</div>
            <div class="info-item"><span class="label">Email:</span> ${lead.email || "Not provided"}</div>
            <div class="info-item"><span class="label">Phone:</span> ${lead.phone || "Not provided"}</div>
            <div class="info-item"><span class="label">Captured On:</span> ${createdAt}</div>
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">Inquiry Details</div>
          <div class="info-grid">
            <div class="info-item"><span class="label">Destination:</span> ${lead.placeToVisit || lead.country || "Not specified"}</div>
            <div class="info-item"><span class="label">Visa Type:</span> ${lead.visaType || "Not specified"}</div>
            <div class="info-item"><span class="label">Source:</span> ${lead.source || "Website"}</div>
          </div>
          ${
            lead.message
              ? `
          <div class="info-item" style="margin-top: 10px;">
            <span class="label">Message:</span>
            <p>${lead.message}</p>
          </div>
          `
              : ""
          }
        </div>
        
        ${
          lead.documents && lead.documents.length > 0
            ? `
        <div class="section">
          <div class="section-title">Uploaded Documents</div>
          <table>
            <thead>
              <tr>
                <th>Document Name</th>
                <th>Type</th>
                <th>Size</th>
              </tr>
            </thead>
            <tbody>
              ${lead.documents
                .map(
                  (doc: any) => `
                <tr>
                  <td>${doc.name}</td>
                  <td>${doc.type}</td>
                  <td>${formatFileSize(doc.size)}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </div>
        `
            : ""
        }
        
        <div class="footer">
          <p>Visaa.in | D, 22, Block D, Noida Sector 3, Noida, Uttar Pradesh 201301</p>
          <p>Phone: 9599076202 | Email: info@visaa.in</p>
          <p>Generated on ${new Date().toLocaleString()}</p>
        </div>
        
        <div class="no-print" style="text-align: center; margin-top: 30px;">
          <button onclick="window.print()" style="padding: 10px 20px; cursor: pointer;">Print Report</button>
        </div>
      </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
    }, 500)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading leads...</span>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Mobile-Optimized Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold">Leads Management</h2>
        <Button variant="outline" size="sm" onClick={fetchLeads} className="self-start sm:self-auto bg-transparent">
          <RefreshCw className="h-4 w-4 mr-1" />
          Refresh
        </Button>
      </div>

      {/* Mobile-Optimized Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Filter by source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            <SelectItem value="popup">Popup Form</SelectItem>
            <SelectItem value="hero">Hero Section</SelectItem>
            <SelectItem value="contact">Contact Page</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Mobile-Optimized Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="hover:shadow-md transition-all duration-300">
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-lg sm:text-2xl font-bold text-blue-600">{leads.length}</div>
            <div className="text-xs sm:text-sm text-gray-600">Total Leads</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-all duration-300">
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-lg sm:text-2xl font-bold text-purple-600">
              {leads.filter((l) => l.source === "popup").length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Popup Leads</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-all duration-300">
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-lg sm:text-2xl font-bold text-green-600">
              {leads.filter((l) => l.source === "hero").length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Hero Leads</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-all duration-300">
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-lg sm:text-2xl font-bold text-orange-600">
              {
                leads.filter((l) => l.createdAt && new Date(l.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000))
                  .length
              }
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Last 24h</div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile-Optimized Lead Cards */}
      <div className="space-y-3 sm:space-y-4">
        {filteredLeads.map((lead) => (
          <Card key={lead._id} className="hover:shadow-md transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              {/* Mobile Header */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                <div className="flex items-start space-x-3">
                  <div className="text-xl sm:text-2xl flex-shrink-0">{getSourceIcon(lead.source)}</div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg font-semibold truncate">{lead.name}</h3>
                    <p className="text-sm text-gray-600 truncate">
                      Interested in: {lead.placeToVisit || "Not specified"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <Badge className={`${getSourceColor(lead.source)} text-xs`}>
                    {lead.source.charAt(0).toUpperCase() + lead.source.slice(1)}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedLead(lead)
                      setIsDialogOpen(true)
                    }}
                    className="text-xs"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                </div>
              </div>

              {/* Mobile Contact Info */}
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{lead.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span>{lead.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span className="text-xs">{lead.createdAt ? formatDate(lead.createdAt) : "Unknown"}</span>
                </div>
              </div>

              {/* Mobile Message */}
              {lead.message && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700 line-clamp-2">"{lead.message}"</p>
                </div>
              )}

              {/* Mobile Actions */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">Destination: {lead.placeToVisit || "Not specified"}</span>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => sendEmail(lead.email, lead.name)}
                    className="flex-1 sm:flex-none text-xs"
                  >
                    <Mail className="h-3 w-3 mr-1" />
                    Email
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`tel:${lead.phone}`)}
                    className="flex-1 sm:flex-none text-xs"
                  >
                    <Phone className="h-3 w-3 mr-1" />
                    Call
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mobile-Optimized Lead Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedLead && (
          <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="border-b pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <DialogTitle className="flex items-center text-lg sm:text-xl">
                  <span className="text-xl sm:text-2xl mr-2">{getSourceIcon(selectedLead.source)}</span>
                  <span className="truncate">Lead Details - {selectedLead.name}</span>
                </DialogTitle>
                <Badge className={getSourceColor(selectedLead.source) + " text-sm px-3 py-1"}>
                  {selectedLead.source.charAt(0).toUpperCase() + selectedLead.source.slice(1)}
                </Badge>
              </div>
            </DialogHeader>

            <div className="py-2">
              {/* Mobile Action Buttons */}
              <div className="grid grid-cols-2 sm:flex sm:justify-end gap-2 mb-4">
                <Button variant="outline" size="sm" onClick={() => sendEmail(selectedLead.email, selectedLead.name)}>
                  <Mail className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Email Lead</span>
                  <span className="sm:hidden">Email</span>
                </Button>
                <Button variant="outline" size="sm" onClick={() => window.open(`tel:${selectedLead.phone}`)}>
                  <Phone className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Call Lead</span>
                  <span className="sm:hidden">Call</span>
                </Button>
                <Button variant="outline" size="sm" onClick={() => printLeadDetails(selectedLead)}>
                  <Printer className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Print</span>
                  <span className="sm:hidden">Print</span>
                </Button>
                <Button variant="outline" size="sm" onClick={() => downloadLeadData(selectedLead)}>
                  <Download className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Download</span>
                  <span className="sm:hidden">Data</span>
                </Button>
              </div>

              <Tabs defaultValue="details">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="details" className="text-xs sm:text-sm">
                    Details
                  </TabsTrigger>
                  <TabsTrigger value="documents" className="text-xs sm:text-sm">
                    Documents
                  </TabsTrigger>
                  <TabsTrigger value="notes" className="text-xs sm:text-sm">
                    Notes
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Personal Information */}
                    <Card className="lg:col-span-2">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base sm:text-lg flex items-center">
                          <User className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-500" />
                          Personal Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs sm:text-sm font-medium text-gray-600">Full Name</label>
                            <p className="font-medium text-sm sm:text-base">{selectedLead.name || "Not provided"}</p>
                          </div>
                          <div>
                            <label className="text-xs sm:text-sm font-medium text-gray-600">Email</label>
                            <p className="font-medium text-sm sm:text-base break-all">
                              {selectedLead.email || "Not provided"}
                            </p>
                          </div>
                          <div>
                            <label className="text-xs sm:text-sm font-medium text-gray-600">Phone</label>
                            <p className="font-medium text-sm sm:text-base">{selectedLead.phone || "Not provided"}</p>
                          </div>
                          <div>
                            <label className="text-xs sm:text-sm font-medium text-gray-600">Captured On</label>
                            <p className="font-medium text-sm sm:text-base">
                              {selectedLead.createdAt ? formatDate(selectedLead.createdAt) : "Unknown"}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Lead Status */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base sm:text-lg flex items-center">
                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-500" />
                          Lead Status
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-4">
                          <div>
                            <label className="text-xs sm:text-sm font-medium text-gray-600">Source</label>
                            <div className="flex items-center mt-1">
                              <Badge className={getSourceColor(selectedLead.source)}>
                                {selectedLead.source.charAt(0).toUpperCase() + selectedLead.source.slice(1)}
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <label className="text-xs sm:text-sm font-medium text-gray-600">Lead Age</label>
                            <p className="font-medium text-sm sm:text-base">
                              {selectedLead.createdAt
                                ? `${Math.floor(
                                    (new Date().getTime() - new Date(selectedLead.createdAt).getTime()) /
                                      (1000 * 60 * 60 * 24),
                                  )} days`
                                : "Unknown"}
                            </p>
                          </div>
                          <div>
                            <label className="text-xs sm:text-sm font-medium text-gray-600">Follow-up Status</label>
                            <p className="font-medium">
                              <Badge
                                variant="outline"
                                className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs"
                              >
                                Pending Follow-up
                              </Badge>
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Inquiry Details */}
                    <Card className="lg:col-span-2">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base sm:text-lg flex items-center">
                          <Globe className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-purple-500" />
                          Inquiry Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs sm:text-sm font-medium text-gray-600">Destination</label>
                            <p className="font-medium text-sm sm:text-base">
                              {selectedLead.placeToVisit || selectedLead.country || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <label className="text-xs sm:text-sm font-medium text-gray-600">Visa Type</label>
                            <p className="font-medium text-sm sm:text-base">
                              {selectedLead.visaType || "Not specified"}
                            </p>
                          </div>
                        </div>

                        {selectedLead.message && (
                          <div className="mt-4">
                            <label className="text-xs sm:text-sm font-medium text-gray-600">Message</label>
                            <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm whitespace-pre-wrap">{selectedLead.message}</p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Timeline */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base sm:text-lg flex items-center">
                          <Clock className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-500" />
                          Timeline
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3">
                            <div className="mt-1 bg-green-100 rounded-full p-1">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Lead Captured</p>
                              <p className="text-xs text-gray-500">
                                {selectedLead.createdAt ? formatDate(selectedLead.createdAt) : "Unknown date"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <div className="mt-1 bg-yellow-100 rounded-full p-1">
                              <AlertCircle className="h-3 w-3 text-yellow-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Awaiting Follow-up</p>
                              <p className="text-xs text-gray-500">No action taken yet</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="documents">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base sm:text-lg flex items-center">
                        <FileText className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-500" />
                        Uploaded Documents
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedLead.documents && selectedLead.documents.length > 0 ? (
                        <div className="space-y-4">
                          <div className="flex justify-end">
                            <Button variant="outline" size="sm">
                              <FileDown className="h-4 w-4 mr-2" />
                              Download All
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {selectedLead.documents.map((doc: any, index: number) => (
                              <div
                                key={index}
                                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg gap-3"
                              >
                                <div className="flex items-center space-x-3">
                                  <FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />
                                  <div className="min-w-0">
                                    <p className="font-medium text-sm truncate">{doc.name}</p>
                                    <p className="text-xs text-gray-500">
                                      {doc.type} • {formatFileSize(doc.size)}
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
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500">No documents uploaded with this lead</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="notes">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base sm:text-lg flex items-center">
                        <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-500" />
                        Notes & Follow-up
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center py-8">
                          <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500">No notes or follow-up actions recorded yet</p>
                          <Button variant="outline" className="mt-4 bg-transparent">
                            Add Note
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {filteredLeads.length === 0 && (
        <div className="text-center py-12">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            {searchTerm || sourceFilter !== "all" ? "No leads found matching your criteria." : "No leads captured yet."}
          </p>
        </div>
      )}
    </div>
  )
}

// Helper function to format file size
function formatFileSize(bytes: number): string {
  if (!bytes || bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}
