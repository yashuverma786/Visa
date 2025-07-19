"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Users, FileText, Globe, MessageSquare, TrendingUp, Calendar, BookOpen } from "lucide-react"
import ApplicationsManager from "./applications-manager"
import CountriesManager from "./countries-manager"
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

      // Calculate stats
      const now = new Date()
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

      const recentApplications = applications.filter((app: any) => new Date(app.submittedAt) >= sevenDaysAgo).length

      const pendingApplications = applications.filter((app: any) => app.status === "pending").length

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
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your visa application system</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="countries">Countries</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          <TabsTrigger value="blogs">Blogs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalApplications}</div>
                <p className="text-xs text-muted-foreground">
                  <Badge variant="secondary" className="mr-1">
                    {stats.pendingApplications}
                  </Badge>
                  pending review
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Countries</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCountries}</div>
                <p className="text-xs text-muted-foreground">visa destinations available</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customer Leads</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalLeads}</div>
                <p className="text-xs text-muted-foreground">potential customers</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Testimonials</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalTestimonials}</div>
                <p className="text-xs text-muted-foreground">customer reviews</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.recentApplications}</div>
                <p className="text-xs text-muted-foreground">applications in last 7 days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalBlogs}</div>
                <p className="text-xs text-muted-foreground">
                  <Badge variant="default" className="mr-1">
                    {stats.publishedBlogs}
                  </Badge>
                  published
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Status</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Online</div>
                <p className="text-xs text-muted-foreground">all systems operational</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="countries">
          <CountriesManager />
        </TabsContent>

        <TabsContent value="applications">
          <ApplicationsManager />
        </TabsContent>

        <TabsContent value="customers">
          <LeadsManager />
        </TabsContent>

        <TabsContent value="testimonials">
          <TestimonialsManager />
        </TabsContent>

        <TabsContent value="blogs">
          <BlogsManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}
