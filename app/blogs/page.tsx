import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Visa & Travel Blogs | Visaa.in",
  description: "Read the latest visa guides, travel tips, and immigration news from our experts at Visaa.in",
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Visa & Travel Blog</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest visa guides, travel tips, and immigration news
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No blog posts available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog: any) => (
              <Card key={blog._id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  {blog.featuredImage && (
                    <div className="w-full h-48 overflow-hidden rounded-t-lg">
                      <img
                        src={blog.featuredImage || "/placeholder.svg"}
                        alt={blog.featuredImageAlt || blog.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {blog.tags.slice(0, 2).map((tag: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                    <Link href={`/blogs/${blog.slug}`} className="hover:text-blue-600 transition-colors">
                      {blog.title}
                    </Link>
                  </h2>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{blog.excerpt}</p>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        <span>{blog.author}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {blog.readTime && (
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{blog.readTime} min read</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
