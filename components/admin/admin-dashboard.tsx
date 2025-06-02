"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Globe, FileText, Users, MessageSquare, Plus, LogOut, BarChart3 } from "lucide-react"
import CountriesManager from "./countries-manager"
import ApplicationsManager from "./applications-manager"
import LeadsManager from "./leads-manager"
import TestimonialsManager from "./testimonials-manager"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" })
    window.location.href = "/admin-console"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Globe className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">JMT Travel Admin</h1>
            </div>
            <Button variant="outline" onClick={handleLogout} className="flex items-center">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="countries" className="flex items-center">
              <Globe className="h-4 w-4 mr-2" />
              Countries
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Applications
            </TabsTrigger>
            <TabsTrigger value="leads" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Leads
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              Testimonials
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Countries</CardTitle>
                  <Globe className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">6</div>
                  <p className="text-xs text-muted-foreground">Active visa destinations</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Applications</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">Pending review</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Leads</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">New inquiries</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Testimonials</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2</div>
                  <p className="text-xs text-muted-foreground">Customer reviews</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button onClick={() => setActiveTab("countries")} className="flex items-center justify-center">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Country
                  </Button>
                  <Button
                    onClick={() => setActiveTab("applications")}
                    variant="outline"
                    className="flex items-center justify-center"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Applications
                  </Button>
                  <Button
                    onClick={() => setActiveTab("leads")}
                    variant="outline"
                    className="flex items-center justify-center"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Manage Leads
                  </Button>
                  <Button
                    onClick={() => setActiveTab("testimonials")}
                    variant="outline"
                    className="flex items-center justify-center"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Add Testimonial
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="countries" className="mt-6">
            <CountriesManager />
          </TabsContent>

          <TabsContent value="applications" className="mt-6">
            <ApplicationsManager />
          </TabsContent>

          <TabsContent value="leads" className="mt-6">
            <LeadsManager />
          </TabsContent>

          <TabsContent value="testimonials" className="mt-6">
            <TestimonialsManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
