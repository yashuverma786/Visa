"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Eye, Mail, Phone, Calendar, MapPin, Search, Target } from "lucide-react"
import type { LeadCapture } from "@/lib/types"

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
      const response = await fetch("/api/admin/leads")
      if (response.ok) {
        const data = await response.json()
        setLeads(data)
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
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
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

  if (isLoading) {
    return <div className="text-center py-8">Loading leads...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Leads Management</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-40">
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
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{leads.length}</div>
            <div className="text-sm text-gray-600">Total Leads</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{leads.filter((l) => l.source === "popup").length}</div>
            <div className="text-sm text-gray-600">Popup Leads</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{leads.filter((l) => l.source === "hero").length}</div>
            <div className="text-sm text-gray-600">Hero Leads</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {
                leads.filter((l) => l.createdAt && new Date(l.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000))
                  .length
              }
            </div>
            <div className="text-sm text-gray-600">Last 24h</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredLeads.map((lead) => (
          <Card key={lead._id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{getSourceIcon(lead.source)}</div>
                  <div>
                    <h3 className="text-lg font-semibold">{lead.name}</h3>
                    <p className="text-gray-600">Interested in: {lead.placeToVisit || "Not specified"}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getSourceColor(lead.source)}>
                    {lead.source.charAt(0).toUpperCase() + lead.source.slice(1)}
                  </Badge>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedLead(lead)}>
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{lead.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{lead.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>{lead.createdAt ? formatDate(lead.createdAt) : "Unknown"}</span>
                </div>
              </div>

              {lead.message && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">"{lead.message}"</p>
                </div>
              )}

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>Destination: {lead.placeToVisit || "Not specified"}</span>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => sendEmail(lead.email, lead.name)}>
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => window.open(`tel:${lead.phone}`)}>
                    <Phone className="h-4 w-4 mr-1" />
                    Call
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Lead Details Dialog */}
      {selectedLead && (
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <span className="text-2xl">{getSourceIcon(selectedLead.source)}</span>
              <span>Lead Details - {selectedLead.name}</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Full Name</label>
                    <p className="font-medium">{selectedLead.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="font-medium">{selectedLead.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone</label>
                    <p className="font-medium">{selectedLead.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Place to Visit</label>
                    <p className="font-medium">{selectedLead.placeToVisit || "Not specified"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Lead Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Source</label>
                    <div className="flex items-center space-x-2">
                      <Badge className={getSourceColor(selectedLead.source)}>
                        {selectedLead.source.charAt(0).toUpperCase() + selectedLead.source.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Captured At</label>
                    <p className="font-medium">
                      {selectedLead.createdAt ? formatDate(selectedLead.createdAt) : "Unknown"}
                    </p>
                  </div>
                </div>

                {selectedLead.message && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Message</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm">{selectedLead.message}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => sendEmail(selectedLead.email, selectedLead.name)}>
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              <Button onClick={() => window.open(`tel:${selectedLead.phone}`)}>
                <Phone className="h-4 w-4 mr-2" />
                Call Now
              </Button>
            </div>
          </div>
        </DialogContent>
      )}

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
