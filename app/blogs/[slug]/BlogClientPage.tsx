"use client"

import { notFound } from "next/navigation"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, Clock, ArrowLeft, Share2 } from "lucide-react"
import { useEffect, useState } from "react"

interface BlogPageProps {
  params: {
    slug: string
  }
}

interface Blog {
  title: string
  metaTitle?: string
  metaDescription?: string
  excerpt?: string
  featuredImage?: string
  featuredImageAlt?: string
  tags: string[]
  author: string
  publishedAt: string
  readTime?: string
  content: string
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

export default function BlogClientPage({ params }: BlogPageProps) {
  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlog = async () => {
      const fetchedBlog = await getBlog(params.slug)
      if (fetchedBlog) {
        setBlog(fetchedBlog)
      }
      setLoading(false)
    }

    fetchBlog()
  }, [params.slug])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!blog) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link href="/blogs">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blogs
            </Button>
          </Link>

          {/* Featured Image */}
          {blog.featuredImage && (
            <div className="w-full h-64 md:h-96 overflow-hidden rounded-lg mb-8">
              <img
                src={blog.featuredImage || "/placeholder.svg"}
                alt={blog.featuredImageAlt || blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Header */}
          <article className="prose prose-lg max-w-none">
            <div className="mb-8">
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {blog.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>

              {/* Meta Info */}
              <div className="flex items-center justify-between border-b pb-4 mb-8">
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    <span>{blog.author}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
                  </div>
                  {blog.readTime && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{blog.readTime} min read</span>
                    </div>
                  )}
                </div>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>

              {/* Excerpt */}
              {blog.excerpt && <p className="text-xl text-gray-600 mb-8 font-medium leading-relaxed">{blog.excerpt}</p>}
            </div>

            {/* Content */}
            <div
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900"
              dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, "<br>") }}
            />
          </article>

          {/* Call to Action */}
          <div className="mt-12 p-6 bg-blue-50 rounded-lg text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Need Help with Your Visa Application?</h3>
            <p className="text-gray-600 mb-4">Our experts are here to guide you through the entire process</p>
            <Button
              onClick={() => (window.location.href = "tel:+919599076202")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Get Expert Assistance
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
