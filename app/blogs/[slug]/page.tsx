"use client";

import Image from "next/image";
import Link from "next/link";

// Dummy blog data
const blog = {
  title: "Apply for an Australia Tourist or Family Visit Visa – Complete Guide by JMT Travel",
  date: "2025-08-02",
  banner: "/australia.jpg",
  content: `
    <p>Planning a trip to Australia? Whether you’re visiting family or exploring the sights...</p>
    <h2>Required Documents</h2>
    <ul>
      <li>Valid Passport</li>
      <li>Visa application form</li>
      <li>Photographs</li>
      <li>Proof of Funds</li>
    </ul>
    <p>JMT Travel ensures a smooth visa process for you.</p>
    <h3>Ready to Apply?</h3>
    <p>Contact us and we'll assist with the documentation, booking, and filing.</p>
  `,
  related: [
    {
      slug: "uk-visa",
      title: "UK Tourist Visa Guide",
      banner: "/uk.jpg",
    },
    {
      slug: "canada-visa",
      title: "Canada Visitor Visa Guide",
      banner: "/canada.jpg",
    },
    {
      slug: "dubai-visa",
      title: "Dubai Tourist Visa Made Easy",
      banner: "/dubai.jpg",
    },
  ],
  categories: [
    { slug: "tourist-visas", name: "Tourist Visas" },
    { slug: "family-visits", name: "Family Visit Visas" },
  ],
};

export default function BlogDetailPage() {
  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <div className="relative w-full h-60 md:h-80">
        <Image
          src={blog.banner}
          alt={blog.title}
          fill
          className="object-cover"
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
            {new Date(blog.date).toLocaleDateString()}
          </p>
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </article>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Contact Form */}
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

          {/* Visa Categories */}
          <div className="bg-green-50 border border-green-100 rounded-lg p-5 shadow-sm">
            <h2 className="text-base font-semibold mb-3 text-green-700">
              Visa Categories
            </h2>
            <ul className="space-y-2 text-sm">
              {blog.categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/visa-types/${cat.slug}`}
                    className="text-green-700 hover:underline"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      {/* Related Blogs Bottom Section */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pb-16">
        <h2 className="text-xl font-semibold mb-4">Related Articles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {blog.related.map((rel) => (
            <Link
              href={`/blogs/${rel.slug}`}
              key={rel.slug}
              className="block bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <div className="relative w-full h-40 rounded-t-lg overflow-hidden">
                <Image
                  src={rel.banner}
                  alt={rel.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-sm font-medium text-blue-700 hover:underline">
                  {rel.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
