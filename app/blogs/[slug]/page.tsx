import type { Metadata } from "next"
import BlogClientPage from "./BlogClientPage"

interface BlogPageProps {
  params: {
    slug: string
  }
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

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const blog = await getBlog(params.slug)

  if (!blog) {
    return {
      title: "Blog Not Found | Visaa.in",
    }
  }

  return {
    title: blog.metaTitle || blog.title,
    description: blog.metaDescription || blog.excerpt,
    openGraph: {
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || blog.excerpt,
      images: blog.featuredImage ? [blog.featuredImage] : [],
    },
  }
}

export default function BlogPage({ params }: BlogPageProps) {
  return <BlogClientPage params={params} />
}
