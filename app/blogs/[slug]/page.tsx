import type { Metadata } from "next";
import BlogClientPage from "./BlogClientPage";

interface BlogPageParams {
  slug: string;
}

async function getBlog(slug: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN}/api/blogs/${slug}`,
      {
        cache: "no-store",
      }
    );
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error("Error fetching blog:", error);
    return null;
  }
}

// FIX #1: yaha params ko await karo
export async function generateMetadata({
  params,
}: {
  params: Promise<BlogPageParams>;
}): Promise<Metadata> {
  const { slug } = await params; // <-- await kiya
  const blog = await getBlog(slug);

  if (!blog) {
    return {
      title: "Blog Not Found | Visaa.in",
    };
  }

  return {
    title: blog.metaTitle || blog.title,
    description: blog.metaDescription || blog.excerpt,
    openGraph: {
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || blog.excerpt,
      images: blog.featuredImage ? [blog.featuredImage] : [],
    },
  };
}

// FIX #2: yaha bhi params ko await karo
export default async function BlogPage({
  params,
}: {
  params: Promise<BlogPageParams>;
}) {
  const { slug } = await params; // <-- await kiya
  const blog = await getBlog(slug);

  if (!blog) {
    return <div>Blog not found.</div>;
  }

  return <BlogClientPage params={{ slug }} />;

}
