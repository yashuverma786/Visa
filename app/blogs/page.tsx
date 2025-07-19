import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, Phone, Mail, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Visa & Travel Blogs | Visaa.in",
  description:
    "Read the latest visa guides, travel tips, and country-specific information to help with your visa applications.",
}

async function getBlogs() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/blogs`, {
      cache: "no-store",
    })
    if (response.ok) {
      return await response.json()
    }
    return []
  } catch (error) {
    console.error("Error fetching blogs:", error)
    return []
  }
}

export default async function BlogsPage() {
  const blogs = await getBlogs()
  const publishedBlogs = blogs.filter((blog: any) => blog.published)
  const latestBlogs = publishedBlogs.slice(0, 5)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Visa & Travel Blogs</h1>
              <p className="text-gray-600">
                Stay updated with the latest visa guides, travel tips, and country-specific information to help with
                your visa applications.
              </p>
            </div>

            {publishedBlogs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No blogs published yet. Check back soon!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {publishedBlogs.map((blog: any) => (
                  <Card key={blog._id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        {blog.featuredImage && (
                          <div className="md:w-1/3">
                            <img
                              src={blog.featuredImage || "/placeholder.svg"}
                              alt={blog.title}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                          </div>
                        )}
                        <div className={blog.featuredImage ? "md:w-2/3" : "w-full"}>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {blog.author}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            <Link href={`/blogs/${blog.slug}`} className="hover:text-blue-600 transition-colors">
                              {blog.title}
                            </Link>
                          </h2>
                          <p className="text-gray-600 mb-4 line-clamp-3">{blog.excerpt}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-2">
                              {blog.tags.slice(0, 3).map((tag: string, index: number) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <Link href={`/blogs/${blog.slug}`}>
                              <Button variant="outline" size="sm">
                                Read More
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Latest Blogs */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Latest Blogs</h3>
                  <div className="space-y-4">
                    {latestBlogs.map((blog: any) => (
                      <div key={blog._id} className="border-b border-gray-200 pb-4 last:border-b-0">
                        <Link href={`/blogs/${blog.slug}`} className="block hover:text-blue-600 transition-colors">
                          <h4 className="font-medium text-sm mb-2 line-clamp-2">{blog.title}</h4>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Calendar className="h-3 w-3" />
                            {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Need Help Section */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Need Help?</h3>
                  <p className="text-blue-800 text-sm mb-4">
                    Our visa experts are here to assist you with your application.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-blue-800">
                      <Mail className="h-4 w-4" />
                      <a href="mailto:visa@journeymytrip.com" className="hover:underline">
                        visa@journeymytrip.com
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-blue-800">
                      <Phone className="h-4 w-4" />
                      <a href="tel:+919599076202" className="hover:underline">
                        +91 9599076202
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-blue-800">
                      <Clock className="h-4 w-4" />
                      <span>9 AM - 6 PM (Mon-Sat)</span>
                    </div>
                  </div>
                  <Button asChild className="w-full mt-4">
                    <a href="tel:+919599076202">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Now
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
