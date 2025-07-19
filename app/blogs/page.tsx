import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Clock, Mail, Phone } from "lucide-react"
import type { Blog } from "@/lib/types"

export const metadata: Metadata = {
  title: "Visa & Immigration Blog - Expert Tips & Guides",
  description:
    "Stay updated with the latest visa requirements, immigration tips, and travel guides from our visa experts.",
}

async function getBlogs(): Promise<Blog[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000"
    const response = await fetch(`${baseUrl}/api/blogs`, {
      cache: "no-store",
    })

    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.error("Error fetching blogs:", error)
  }

  return []
}

async function getLatestBlogs(): Promise<Blog[]> {
  const blogs = await getBlogs()
  return blogs.slice(0, 5)
}

export default async function BlogsPage() {
  const blogs = await getBlogs()
  const latestBlogs = await getLatestBlogs()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Visa & Immigration Blog</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with the latest visa requirements, immigration tips, and travel guides from our experts
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {blogs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No blog posts available at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {blogs.map((blog) => (
                  <Card key={blog._id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="p-0">
                      {blog.featuredImage && (
                        <div className="relative h-48 w-full">
                          <Image
                            src={blog.featuredImage || "/placeholder.svg"}
                            alt={blog.title}
                            fill
                            className="object-cover rounded-t-lg"
                          />
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {blog.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                        <Link href={`/blogs/${blog.slug}`} className="hover:text-blue-600 transition-colors">
                          {blog.title}
                        </Link>
                      </h2>

                      <p className="text-gray-600 mb-4 line-clamp-3">{blog.excerpt}</p>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            <span>{blog.author}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{Math.ceil(blog.content.split(" ").length / 200)} min read</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Latest Blogs */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Latest Blogs</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {latestBlogs.map((blog) => (
                  <div key={blog._id} className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0">
                    <h4 className="font-medium text-sm mb-1 line-clamp-2">
                      <Link href={`/blogs/${blog.slug}`} className="hover:text-blue-600 transition-colors">
                        {blog.title}
                      </Link>
                    </h4>
                    <p className="text-xs text-gray-500">
                      {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Need Help Section */}
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <h3 className="text-lg font-semibold text-green-800">Need Help?</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-green-700 mb-3">
                  Our visa experts are here to assist you with your application.
                </p>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-green-700" />
                    <strong>Email:</strong>{" "}
                    <a href="mailto:visa@journeymytrip.com" className="ml-1 text-green-700 hover:underline">
                      visa@journeymytrip.com
                    </a>
                  </p>
                  <p className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-green-700" />
                    <strong>Phone:</strong>{" "}
                    <a href="tel:+919599076202" className="ml-1 text-green-700 hover:underline">
                      +91 9599076202
                    </a>
                  </p>
                  <p className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-green-700" />
                    <strong>Hours:</strong> <span className="ml-1">9 AM - 6 PM (Mon-Sat)</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
