import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, Clock, Mail, Phone, ArrowLeft, Share2 } from "lucide-react"
import type { Blog } from "@/lib/types"

interface BlogPageProps {
  params: Promise<{ slug: string }>
}

async function getBlog(slug: string): Promise<Blog | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000"
    const response = await fetch(`${baseUrl}/api/blogs/${slug}`, {
      cache: "no-store",
    })

    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.error("Error fetching blog:", error)
  }

  return null
}

async function getLatestBlogs(): Promise<Blog[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000"
    const response = await fetch(`${baseUrl}/api/blogs`, {
      cache: "no-store",
    })

    if (response.ok) {
      const blogs = await response.json()
      return blogs.slice(0, 5)
    }
  } catch (error) {
    console.error("Error fetching latest blogs:", error)
  }

  return []
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params
  const blog = await getBlog(slug)

  if (!blog) {
    return {
      title: "Blog Not Found",
    }
  }

  return {
    title: `${blog.title} - Visaa.in Blog`,
    description: blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      images: blog.featuredImage ? [blog.featuredImage] : [],
    },
  }
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params
  const blog = await getBlog(slug)
  const latestBlogs = await getLatestBlogs()

  if (!blog) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <Link href="/blogs">
                <Button variant="outline" size="sm" className="mb-4 bg-transparent">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Blogs
                </Button>
              </Link>
            </div>

            <article className="bg-white rounded-lg shadow-sm overflow-hidden">
              {blog.featuredImage && (
                <div className="relative h-64 md:h-80 w-full">
                  <Image
                    src={blog.featuredImage || "/placeholder.svg"}
                    alt={blog.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="p-8">
                <div className="flex flex-wrap gap-2 mb-4">
                  {blog.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>

                <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      <span>{blog.author}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{Math.ceil(blog.content.split(" ").length / 200)} min read</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>

                <div className="prose prose-lg max-w-none">
                  {blog.content.split("\n").map((paragraph, index) => (
                    <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Latest Blogs */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Latest Blogs</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {latestBlogs
                  .filter((b) => b.slug !== blog.slug)
                  .slice(0, 4)
                  .map((latestBlog) => (
                    <div key={latestBlog._id} className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0">
                      <h4 className="font-medium text-sm mb-1 line-clamp-2">
                        <Link href={`/blogs/${latestBlog.slug}`} className="hover:text-blue-600 transition-colors">
                          {latestBlog.title}
                        </Link>
                      </h4>
                      <p className="text-xs text-gray-500">
                        {new Date(latestBlog.publishedAt || latestBlog.createdAt).toLocaleDateString()}
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
