"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Users, FileText, Globe, PenTool, MessageSquare, TrendingUp, Calendar, Activity } from "lucide-react"
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
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-blue-100">Manage your visa application system efficiently</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Applications</CardTitle>
            <FileText className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalApplications}</div>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="destructive" className="text-xs">
                {stats.pendingApplications} pending
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {stats.recentApplications} this week
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Countries</CardTitle>
            <Globe className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalCountries}</div>
            <p className="text-xs text-gray-500 mt-2">Visa destinations available</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Blog Posts</CardTitle>
            <PenTool className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalBlogs}</div>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="default" className="text-xs">
                {stats.publishedBlogs} published
              </Badge>
              <Badge variant="outline" className="text-xs">
                {stats.totalBlogs - stats.publishedBlogs} drafts
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Customer Leads</CardTitle>
            <Users className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalLeads}</div>
            <p className="text-xs text-gray-500 mt-2">Total inquiries received</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">New Applications</span>
                <Badge variant="secondary">{stats.recentApplications}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pending Reviews</span>
                <Badge variant="destructive">{stats.pendingApplications}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Published Blogs</span>
                <Badge variant="default">{stats.publishedBlogs}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <MessageSquare className="h-5 w-5 mr-2 text-blue-500" />
              Customer Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.totalTestimonials}</div>
              <p className="text-sm text-gray-600">Total testimonials</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Calendar className="h-5 w-5 mr-2 text-purple-500" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600 mb-1">All Systems Operational</div>
              <p className="text-sm text-gray-600">Last updated: {new Date().toLocaleTimeString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Management Tabs */}
      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="applications" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger value="applications" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Applications
              </TabsTrigger>
              <TabsTrigger value="countries" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Countries
              </TabsTrigger>
              <TabsTrigger value="blogs" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Blogs
              </TabsTrigger>
              <TabsTrigger value="testimonials" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Testimonials
              </TabsTrigger>
              <TabsTrigger value="leads" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Leads
              </TabsTrigger>
            </TabsList>

            <TabsContent value="applications" className="space-y-4">
              <ApplicationsManager />
            </TabsContent>

            <TabsContent value="countries" className="space-y-4">
              <CountriesManager />
            </TabsContent>

            <TabsContent value="blogs" className="space-y-4">
              <BlogsManager />
            </TabsContent>

            <TabsContent value="testimonials" className="space-y-4">
              <TestimonialsManager />
            </TabsContent>

            <TabsContent value="leads" className="space-y-4">
              <LeadsManager />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
