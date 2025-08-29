import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { connectToDatabase } from "@/lib/mongodb"

interface Blog {
  _id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  featuredImageUrl?: string
  category?: string
  tags?: string[]
  publishedAt?: string
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params   // ✅ await is required in App Router
  const { db } = await connectToDatabase()

  const blog = await db.collection("blogs").findOne<Blog>({ slug })

  if (!blog) {
    notFound()
  }

  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
  <div className="relative w-full">
  <img
    src={
      blog.featuredImageUrl
        ? `${process.env.NEXT_PUBLIC_DOMAIN}${blog.featuredImageUrl}`
        : "/placeholder.svg"
    }
    alt={blog.title}
    className="w-full h-99 object-contain transition-transform duration-500 group-hover:scale-105"
  />

        <div className="absolute inset-0 bg-black/60 flex items-center justify-center px-4">
          <h1 className="text-2xl md:text-4xl font-bold text-white text-center">
            {blog.title}
          </h1>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-4 text-sm text-gray-500">
        <Link href="/" className="hover:underline text-blue-600">Home</Link> /
        <Link href="/blogs" className="hover:underline text-blue-600 ml-1">Blogs</Link> /
        <span className="ml-1">{blog.title.slice(0, 50)}...</span>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <article className="lg:col-span-2 prose max-w-none prose-blue">
          <p className="text-sm text-gray-500 mb-2">
            {blog.publishedAt
              ? new Date(blog.publishedAt).toLocaleDateString()
              : ""}
          </p>
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </article>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-5 shadow-sm">
            <h2 className="text-base font-semibold mb-3 text-blue-700 text-center">
              Need Visa Help?
            </h2>
            <form className="space-y-3">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full border px-3 py-2 rounded text-sm"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full border px-3 py-2 rounded text-sm"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm"
              >
                Request Call
              </button>
            </form>
          </div>

          {blog.category && (
            <div className="bg-green-50 border border-green-100 rounded-lg p-5 shadow-sm">
              <h2 className="text-base font-semibold mb-3 text-green-700">
                Blog Category
              </h2>
              <p className="text-sm text-green-700">{blog.category}</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
