import Link from "next/link"
import HeroCountrySlider from "./HeroCountrySlider"
import { Calendar } from "lucide-react"

export const dynamic = "force-dynamic"


const latestBlogs = [
  { slug: "sample-latest-1", title: "How to Prepare Visa Documents" },
  { slug: "sample-latest-2", title: "Top 5 Tourist Visa Tips" },
  { slug: "sample-latest-3", title: "Common Visa Rejection Reasons" },
]

async function getBlogs() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/blogs`, {
      cache: "no-store",
      next: { revalidate: 0 },
    })
    if (response.ok) return await response.json()
    return []
  } catch (error) {
    console.error("Error fetching blogs:", error)
    return []
  }
}


export default async function BlogsPage() {
  const blogs = await getBlogs()

  // ---- UNIQUE CATEGORIES ----
  const uniqueCategories: string[] = Array.from(
    new Set(blogs.map((b: any) => b.category))
  ).filter((cat): cat is string => Boolean(cat))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO SECTION */}
      <section
        className="relative h-[300px] flex items-center"
        style={{
          background:
            "linear-gradient(218deg,rgba(153,63,255,1)30%,rgba(10,32,235,1)100%)",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center text-white max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Visa & Travel Blogs
            </h1>
            <p className="text-lg text-blue-100">
              Expert visa guidance, travel tips, and the latest updates for your journey.
            </p>
          </div>
        </div>
      </section>

      {/* COUNTRIES SLIDER */}
      <div className="container mx-auto px-4 py-8">
        <HeroCountrySlider />
      </div>

      {/* BLOG GRID + SIDEBAR */}
      <div className="container mx-auto px-4 pb-16 grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* BLOG GRID */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
          {blogs.map((blog: any) => (
            <Link
              key={blog._id}
              href={`/blogs/${blog.slug}`}
              className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-blue-200"
            >
              {/* IMAGE */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={
                    blog.featuredImageUrl
                      ? `${process.env.NEXT_PUBLIC_DOMAIN}${blog.featuredImageUrl}`
                      : "/placeholder.svg"
                  }
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />


                <div className="absolute inset-0 bg-gradient-to-t from-blue-800/40 to-transparent"></div>
              </div>

              {/* CONTENT */}
              <div
                className="-mt-10 relative z-10 mx-4 p-5 rounded-xl border border-[#3b82f6]
             bg-[#eff6ff] text-[#020817]
             shadow-md transition-all duration-300
             group-hover:-translate-y-3 group-hover:shadow-xl group-hover:scale-105"
              >
                <h3 className="text-lg font-semibold line-clamp-2">
                  {blog.title}

                </h3>
                <div className="flex items-center text-gray-600 text-sm mt-2">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(blog.publishedAt).toLocaleDateString()}
                </div>
                <p className="text-gray-700 text-sm mt-3 line-clamp-2">
                  {blog.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* SIDEBAR */}
        <aside className="lg:col-span-1 space-y-8">
          {/* Categories */}
          <div className="rounded-xl shadow p-4 bg-[#f0fdf4] text-[#166534]">

            <h3 className="font-semibold mb-3">Visa Blog Categories</h3>
            <ul className="space-y-2">
              {uniqueCategories.length === 0 ? (
                <li className="text-gray-500 text-sm">No categories found</li>
              ) : (
                uniqueCategories.map((cat) => (
                  <li key={cat}>
                    <Link
                      href={`/blogs?category=${encodeURIComponent(cat)}`}
                      className="text-blue-600 hover:underline"
                    >
                      {cat}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Latest Blogs */}
          <div className="rounded-xl shadow p-4 bg-[#eff6ff] text-[#1e57c6]">
            <h3 className="font-semibold mb-3">Latest Blogs</h3>
            <ul className="space-y-2">
              {blogs.slice(0, 3).map((lb: any) => (
                <li key={lb.slug}>
                  <Link href={`/blogs/${lb.slug}`} className="hover:underline">
                    {lb.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
