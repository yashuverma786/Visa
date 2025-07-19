"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Users, FileText, Globe, PenTool } from "lucide-react"
import CountriesManager from "./countries-manager"
import ApplicationsManager from "./applications-manager"
import TestimonialsManager from "./testimonials-manager"
import LeadsManager from "./leads-manager"
import BlogsManager from "./blogs-manager"

interface DashboardStats {
  totalApplications: number
  totalCountries: number
  totalTestimonials: number
  totalLeads: number
  totalBlogs: number
  publishedBlogs: number
  recentApplications: number
  pendingApplications: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalApplications: 0,
    totalCountries: 0,
    totalTestimonials: 0,
    totalLeads: 0,
    totalBlogs: 0,
    publishedBlogs: 0,
    recentApplications: 0,
    pendingApplications: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setIsLoading(true)

      // Fetch all stats in parallel
      const [applicationsRes, countriesRes, testimonialsRes, leadsRes, blogsRes] = await Promise.all([
        fetch("/api/admin/applications"),
        fetch("/api/admin/countries"),
        fetch("/api/admin/testimonials"),
        fetch("/api/admin/leads"),
        fetch("/api/admin/blogs"),
      ])

      const [applications, countries, testimonials, leads, blogs] = await Promise.all([
        applicationsRes.ok ? applicationsRes.json() : [],
        countriesRes.ok ? countriesRes.json() : [],
        testimonialsRes.ok ? testimonialsRes.json() : [],
        leadsRes.ok ? leadsRes.json() : [],
        blogsRes.ok ? blogsRes.json() : [],
      ])

      // Calculate recent applications (last 7 days)
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      const recentApplications = applications.filter((app: any) => new Date(app.submittedAt) > sevenDaysAgo).length

      // Calculate pending applications
      const pendingApplications = applications.filter((app: any) => app.status === "pending").length

      // Calculate published blogs
      const publishedBlogs = blogs.filter((blog: any) => blog.published).length

      setStats({
        totalApplications: applications.length,
        totalCountries: countries.length,
        totalTestimonials: testimonials.length,
        totalLeads: leads.length,
        totalBlogs: blogs.length,
        publishedBlogs,
        recentApplications,
        pendingApplications,
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading dashboard...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your visa application system</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Badge variant="secondary">{stats.pendingApplications} pending</Badge>
              <Badge variant="outline">{stats.recentApplications} this week</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Countries</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCountries}</div>
            <p className="text-xs text-muted-foreground">Visa destinations available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blogs</CardTitle>
            <PenTool className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBlogs}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Badge variant="default">{stats.publishedBlogs} published</Badge>
              <Badge variant="secondary">{stats.totalBlogs - stats.publishedBlogs} drafts</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLeads}</div>
            <p className="text-xs text-muted-foreground">Total inquiries received</p>
          </CardContent>
        </Card>
      </div>

      {/* Management Tabs */}
      <Tabs defaultValue="applications" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="countries">Countries</TabsTrigger>
          <TabsTrigger value="blogs">Blogs</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
        </TabsList>

        <TabsContent value="applications">
          <ApplicationsManager />
        </TabsContent>

        <TabsContent value="countries">
          <CountriesManager />
        </TabsContent>

        <TabsContent value="blogs">
          <BlogsManager />
        </TabsContent>

        <TabsContent value="testimonials">
          <TestimonialsManager />
        </TabsContent>

        <TabsContent value="leads">
          <LeadsManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}
