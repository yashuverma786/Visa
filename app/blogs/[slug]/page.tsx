import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, ArrowLeft, Phone, Mail, Clock } from "lucide-react"

interface BlogPageProps {
  params: Promise<{ slug: string }>
}

async function getBlog(slug: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/blogs/${slug}`, {
      cache: "no-store",
    })
    if (response.ok) {
      return await response.json()
    }
    return null
  } catch (error) {
    console.error("Error fetching blog:", error)
    return null
  }
}

async function getLatestBlogs() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/blogs`, {
      cache: "no-store",
    })
    if (response.ok) {
      const blogs = await response.json()
      return blogs.filter((blog: any) => blog.published).slice(0, 5)
    }
    return []
  } catch (error) {
    console.error("Error fetching latest blogs:", error)
    return []
  }
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params
  const blog = await getBlog(slug)

  if (!blog) {
    return {
      title: "Blog Not Found | Visaa.in",
    }
  }

  return {
    title: `${blog.title} | Visaa.in`,
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
  const [blog, latestBlogs] = await Promise.all([getBlog(slug), getLatestBlogs()])

  if (!blog || !blog.published) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <Link
                href="/blogs"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blogs
              </Link>
            </div>

            <article className="bg-white rounded-lg shadow-sm overflow-hidden">
              {blog.featuredImage && (
                <div className="w-full h-64 md:h-96">
                  <img
                    src={blog.featuredImage || "/placeholder.svg"}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-6 md:p-8">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {blog.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>

                <div className="flex flex-wrap gap-2 mb-6">
                  {blog.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="prose prose-lg max-w-none">
                  {blog.content.split("\n").map((paragraph: string, index: number) => (
                    <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Latest Blogs */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Latest Blogs</h3>
                  <div className="space-y-4">
                    {latestBlogs
                      .filter((latestBlog: any) => latestBlog.slug !== blog.slug)
                      .slice(0, 4)
                      .map((latestBlog: any) => (
                        <div key={latestBlog._id} className="border-b border-gray-200 pb-4 last:border-b-0">
                          <Link
                            href={`/blogs/${latestBlog.slug}`}
                            className="block hover:text-blue-600 transition-colors"
                          >
                            <h4 className="font-medium text-sm mb-2 line-clamp-2">{latestBlog.title}</h4>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Calendar className="h-3 w-3" />
                              {new Date(latestBlog.publishedAt || latestBlog.createdAt).toLocaleDateString()}
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
