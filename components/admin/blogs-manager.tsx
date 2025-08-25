"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { toast } from "@/hooks/use-toast";

// ✅ CKEditor4 wrapper
function CKEditor4Wrapper({
  content,
  setContent,
}: {
  content: string;
  setContent: (v: string) => void;
}) {
  useEffect(() => {
    const loadCk = async () => {
      if (!(window as any).CKEDITOR) {
        const script = document.createElement("script");
        script.id = "ckeditor-script";
        script.src = "https://cdn.ckeditor.com/4.22.1/full-all/ckeditor.js";
        script.onload = () => initEditor();
        document.body.appendChild(script);
      } else {
        initEditor();
      }
    };

    const initEditor = () => {
      const ck = (window as any).CKEDITOR;
      if (!ck.instances.editor1) {
        ck.replace("editor1", {
          height: 400,
          extraPlugins: "colorbutton,font,justify",
          removePlugins: "elementspath",
          resize_enabled: true,
          toolbar: [
            ["Bold", "Italic", "Underline", "Strike"],
            ["NumberedList", "BulletedList"],
            ["Link", "Unlink"],
            ["JustifyLeft", "JustifyCenter", "JustifyRight", "JustifyBlock"],
            ["TextColor", "BGColor"],
            ["Font", "FontSize"],
            ["Source", "Maximize"],
          ],
        });

        ck.instances.editor1.setData(content);

        ck.instances.editor1.on("change", function (this: any) {
          setContent(this.getData());
        });
      }
    };

    loadCk();

    // ✅ cleanup on unmount
    return () => {
      const ck = (window as any).CKEDITOR;
      if (ck?.instances?.editor1) {
        ck.instances.editor1.destroy(true);
      }
    };
  }, []);

  return <textarea id="editor1" defaultValue={content}></textarea>;
}

// ---------------------------------------------------

export default function BlogsManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [countries, setCountries] = useState<
    { _id: string; name: string; slug: string }[]
  >([]);
  const [content, setContent] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [blogs, setBlogs] = useState<any[]>([]);
  
  const fetchBlogs = async () => {
    const res = await fetch("/api/admin/blogs");
    const data = await res.json();
    setBlogs(data);
  };

  // Fetch countries
  useEffect(() => {
    fetch("/api/countries")
      .then((res) => res.json())
      .then((data) => setCountries(data))
      .catch(() => setCountries([]));
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFeaturedImage(file);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("excerpt", excerpt);
    if (featuredImage) formData.append("featuredImage", featuredImage);
    formData.append("country", selectedCountry);
    formData.append("content", content);
    formData.append("metaTitle", metaTitle);
    formData.append("metaDescription", metaDescription);
    const res = await fetch("/api/admin/blogs", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const savedBlog = await res.json();
      await fetchBlogs(); // Refetch all blogs from the server
      toast({
        title: "Success",
        description: `Blog created successfully`,
      });
      setIsOpen(false);
    } else {
      alert("Error saving blog ❌");
    }
  };

  useEffect(() => {
    async function fetchBlogs() {
      const response = await fetch("/api/admin/blogs");
      const data = await response.json();
      setBlogs(data);
    }
    fetchBlogs();
  }, []);

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
      >
        ✍️ New Blog
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-[95%] max-w-3xl p-6 overflow-y-auto max-h-[90vh]">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">📝 Add New Blog</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✖
              </button>
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Blog Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded border p-2"
              />
              <input
                type="text"
                placeholder="Slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full rounded border p-2"
              />
              <input
                type="text"
                placeholder="Excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="col-span-2 w-full rounded border p-2"
              />
              <div>
                <label className="block text-sm font-medium mb-1">
                  Blog Thumbnail
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Select Country
                </label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full rounded border p-2"
                >
                  <option value="">Select Country</option>
                  {countries.map((c) => (
                    <option key={c._id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Content Editor */}
            <div className="mt-6">
              <label className="block text-sm font-medium mb-2">
                Blog Content
              </label>
              <div className="border rounded-lg min-h-[300px]">
                <CKEditor4Wrapper content={content} setContent={setContent} />
              </div>
            </div>

            {/* Meta Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <input
                type="text"
                placeholder="Meta Title"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                className="w-full rounded border p-2"
              />
              <input
                type="text"
                placeholder="Meta Description"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                className="w-full rounded border p-2"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded border"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded bg-blue-600 text-white shadow hover:bg-blue-700"
              >
                Save Blog
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Blogs List */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">📚 All Blogs</h2>
        {blogs.map(blog => (
          <div key={blog._id} className="flex items-center gap-4 border-b py-3">
            {blog.featuredImageUrl && (
              <img src={blog.featuredImageUrl} alt={blog.title} className="w-16 h-16 object-cover rounded" />
            )}
            <div className="flex-1">
              <h3 className="font-bold">{blog.title}</h3>
              <p className="text-sm text-gray-600">{blog.excerpt}</p>
            </div>
            <button className="px-2 py-1 bg-yellow-500 text-white rounded mr-2" onClick={() => {/* TODO: Edit logic */}}>Edit</button>
            <button className="px-2 py-1 bg-red-600 text-white rounded" onClick={async () => {
              if (confirm('Delete this blog?')) {
                const res = await fetch(`/api/admin/blogs/${blog._id}`, { method: 'DELETE' });
                if (res.ok) {
                  toast({ title: 'Deleted', description: 'Blog deleted.' });
                  await fetchBlogs();
                } else {
                  alert('Error deleting blog');
                }
              }
            }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
