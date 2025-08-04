"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";

// Dummy blog data for now — replace with API
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
  `,
  related: [
    { slug: "uk-visa", title: "UK Tourist Visa Guide" },
    { slug: "canada-visa", title: "Canada Visitor Visa Guide" },
  ],
  categories: [
    { slug: "tourist-visas", name: "Tourist Visas" },
    { slug: "family-visits", name: "Family Visit Visas" },
  ],
};

export default function BlogClientPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Banner */}
      <div className="relative w-full h-64 md:h-96">
        <Image
          src={blog.banner}
          alt={blog.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 className="text-2xl md:text-4xl font-bold text-white text-center px-4">
            {blog.title}
          </h1>
        </div>
      </div>

      {/* Main section */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Content */}
        <article className="lg:col-span-2 prose max-w-none">
          <p className="text-sm text-gray-500 mb-4">
            {new Date(blog.date).toLocaleDateString()}
          </p>
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </article>

        {/* Sidebar */}
        <aside className="space-y-8">
          {/* Lead Form */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 shadow-sm">
            <h2 className="text-lg font-semibold mb-3 text-center">
              Need Visa Help?
            </h2>
            <form className="space-y-4">
              <input type="text" placeholder="Full Name" className="w-full border px-3 py-2 rounded" />
              <input type="email" placeholder="Email" className="w-full border px-3 py-2 rounded" />
              <input type="tel" placeholder="Phone Number" className="w-full border px-3 py-2 rounded" />
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                Get Free Consultation
              </button>
            </form>
          </div>

          {/* Visa Categories */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 shadow-sm">
            <h2 className="text-lg font-semibold mb-3">Visa Categories</h2>
            <ul className="space-y-2">
              {blog.categories.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/visa-types/${cat.slug}`} className="text-blue-700 hover:underline">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Related Blogs */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 shadow-sm">
            <h2 className="text-lg font-semibold mb-3">Related Blogs</h2>
            <ul className="space-y-2">
              {blog.related.map((rel) => (
                <li key={rel.slug}>
                  <Link href={`/blogs/${rel.slug}`} className="text-blue-700 hover:underline">
                    {rel.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
