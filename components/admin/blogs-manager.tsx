"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash, Search, RefreshCw, Calendar, User, X, Upload } from "lucide-react"
import type { Blog } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export default function BlogsManager() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false)
  const [currentBlog, setCurrentBlog] = useState<Blog | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [tagInput, setTagInput] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/admin/blogs")
      if (response.ok) {
        const data = await response.json()
        setBlogs(data)
      } else {
        console.error("Failed to fetch blogs:", await response.text())
        toast({
          title: "Error",
          description: "Failed to fetch blogs.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching blogs:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred while fetching blogs.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddBlog = () => {
    setCurrentBlog({
      _id: "",
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      featuredImage: "",
      featuredImageAlt: "",
      metaTitle: "",
      metaDescription: "",
      tags: [],
      author: "",
      published: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    setImagePreview(null)
    setTagInput("")
    setIsEditing(false)
    setIsDialogOpen(true)
  }

  const handleEditBlog = (blog: Blog) => {
    setCurrentBlog(blog)
    setImagePreview(blog.featuredImage || null)
    setTagInput(blog.tags.join(", "))
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  const handleDeleteBlog = (blog: Blog) => {
    setCurrentBlog(blog)
    setIsConfirmDeleteOpen(true)
  }

  const confirmDeleteBlog = async () => {
    if (!currentBlog?._id) return

    try {
      const response = await fetch(`/api/admin/blogs/${currentBlog._id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setBlogs(blogs.filter((b) => b._id !== currentBlog._id))
        toast({
          title: "Success",
          description: "Blog deleted successfully.",
        })
      } else {
        console.error("Failed to delete blog:", await response.text())
        toast({
          title: "Error",
          description: "Failed to delete blog.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting blog:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred while deleting the blog.",
        variant: "destructive",
      })
    } finally {
      setIsConfirmDeleteOpen(false)
      setCurrentBlog(null)
    }
  }

  const handleSaveBlog = async () => {
    if (!currentBlog) return

    // Validation
    if (!currentBlog.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Blog title is required.",
        variant: "destructive",
      })
      return
    }

    if (!currentBlog.content.trim()) {
      toast({
        title: "Validation Error",
        description: "Blog content is required.",
        variant: "destructive",
      })
      return
    }

    if (!currentBlog.author.trim()) {
      toast({
        title: "Validation Error",
        description: "Author name is required.",
        variant: "destructive",
      })
      return
    }

    // Generate slug if not provided
    const slug = currentBlog.slug || generateSlug(currentBlog.title)

    // Process tags
    const tags = tagInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)

    // Auto-generate meta fields if not provided
    const metaTitle = currentBlog.metaTitle || currentBlog.title
    const metaDescription =
      currentBlog.metaDescription ||
      currentBlog.excerpt ||
      currentBlog.content.substring(0, 160).replace(/<[^>]*>/g, "")

    const blogData = {
      ...currentBlog,
      slug,
      tags,
      metaTitle,
      metaDescription,
      updatedAt: new Date(),
      publishedAt: currentBlog.published && !isEditing ? new Date() : currentBlog.publishedAt,
    }

    const method = isEditing ? "PUT" : "POST"
    const url = isEditing ? `/api/admin/blogs/${currentBlog._id}` : "/api/admin/blogs"

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blogData),
      })

      if (response.ok) {
        const savedBlog = await response.json()
        if (isEditing) {
          setBlogs(blogs.map((b) => (b._id === savedBlog._id ? savedBlog : b)))
        } else {
          setBlogs([savedBlog, ...blogs])
        }
        toast({
          title: "Success",
          description: `Blog ${isEditing ? "updated" : "created"} successfully.`,
        })
        setIsDialogOpen(false)
      } else {
        const errorData = await response.json()
        console.error("Failed to save blog:", errorData)
        toast({
          title: "Error",
          description: errorData.error || `Failed to ${isEditing ? "update" : "create"} blog.`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving blog:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred while saving the blog.",
        variant: "destructive",
      })
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Create preview immediately
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    setUploadingImage(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setCurrentBlog((prev) => (prev ? { ...prev, featuredImage: data.url } : null))
        toast({
          title: "Success",
          description: "Image uploaded successfully.",
        })
      } else {
        console.error("Failed to upload image:", await response.text())
        toast({
          title: "Error",
          description: "Failed to upload image.",
          variant: "destructive",
        })
        // Reset preview on error
        setImagePreview(null)
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred during image upload.",
        variant: "destructive",
      })
      // Reset preview on error
      setImagePreview(null)
    } finally {
      setUploadingImage(false)
    }
  }

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  if (isLoading) {
    return <div className="text-center py-8">Loading blogs...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Blog Management</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline" size="sm" onClick={fetchBlogs}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          <Button onClick={handleAddBlog}>
            <Plus className="h-4 w-4 mr-1" />
            Add Blog
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBlogs.map((blog) => (
          <Card key={blog._id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              {blog.featuredImage && (
                <div className="w-full h-32 mb-3 rounded-md overflow-hidden">
                  <img
                    src={blog.featuredImage || "/placeholder.svg"}
                    alt={blog.featuredImageAlt || blog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex items-center justify-between">
                <Badge variant={blog.published ? "default" : "secondary"}>
                  {blog.published ? "Published" : "Draft"}
                </Badge>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditBlog(blog)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteBlog(blog)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <h3 className="text-lg font-semibold mb-2 line-clamp-2">{blog.title}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{blog.excerpt}</p>

              <div className="flex items-center text-xs text-gray-500 mb-2">
                <User className="h-3 w-3 mr-1" />
                <span className="mr-3">{blog.author}</span>
                <Calendar className="h-3 w-3 mr-1" />
                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
              </div>

              {blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {blog.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {blog.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{blog.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              <div className="text-xs text-gray-400">URL: /blogs/{blog.slug || generateSlug(blog.title)}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBlogs.length === 0 && (
        <div className="text-center py-12">
          <div className="h-12 w-12 text-gray-400 mx-auto mb-4"></div>
          <p className="text-gray-500">No blogs found matching your criteria.</p>
        </div>
      )}

      {/* Blog Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {currentBlog && (
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Edit Blog" : "Create New Blog"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Tabs defaultValue="content">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="seo">SEO & Meta</TabsTrigger>
                  <TabsTrigger value="media">Media</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Blog Title *</Label>
                      <Input
                        id="title"
                        value={currentBlog.title}
                        onChange={(e) => {
                          const title = e.target.value
                          setCurrentBlog({
                            ...currentBlog,
                            title,
                            slug: generateSlug(title),
                          })
                        }}
                        placeholder="Enter blog title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="slug">URL Slug</Label>
                      <Input
                        id="slug"
                        value={currentBlog.slug}
                        onChange={(e) => setCurrentBlog({ ...currentBlog, slug: e.target.value })}
                        placeholder="auto-generated-from-title"
                      />
                      {currentBlog.title && (
                        <p className="text-xs text-gray-500 mt-1">
                          URL: /blogs/{currentBlog.slug || generateSlug(currentBlog.title)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      value={currentBlog.excerpt}
                      onChange={(e) => setCurrentBlog({ ...currentBlog, excerpt: e.target.value })}
                      rows={3}
                      placeholder="Brief description of the blog post"
                    />
                  </div>

                  <div>
                    <Label htmlFor="content">Content *</Label>
                    <Textarea
                      id="content"
                      value={currentBlog.content}
                      onChange={(e) => setCurrentBlog({ ...currentBlog, content: e.target.value })}
                      rows={12}
                      placeholder="Write your blog content here..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="author">Author *</Label>
                      <Input
                        id="author"
                        value={currentBlog.author}
                        onChange={(e) => setCurrentBlog({ ...currentBlog, author: e.target.value })}
                        placeholder="Author name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Input
                        id="tags"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="visa, travel, tips"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="published"
                      checked={currentBlog.published}
                      onCheckedChange={(checked) => setCurrentBlog({ ...currentBlog, published: checked })}
                    />
                    <Label htmlFor="published">Publish immediately</Label>
                  </div>
                </TabsContent>

                <TabsContent value="seo" className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Search Engine Preview</h4>
                    <div className="bg-white p-3 rounded border">
                      <div className="text-blue-600 text-lg hover:underline cursor-pointer">
                        {currentBlog.metaTitle || currentBlog.title || "Blog Title"}
                      </div>
                      <div className="text-green-700 text-sm">
                        visaa.in/blogs/{currentBlog.slug || generateSlug(currentBlog.title || "blog-title")}
                      </div>
                      <div className="text-gray-600 text-sm mt-1">
                        {currentBlog.metaDescription || currentBlog.excerpt || "Blog description will appear here..."}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="metaTitle">Meta Title</Label>
                    <Input
                      id="metaTitle"
                      value={currentBlog.metaTitle}
                      onChange={(e) => setCurrentBlog({ ...currentBlog, metaTitle: e.target.value })}
                      placeholder="SEO optimized title (auto-generated from title if empty)"
                      maxLength={60}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {currentBlog.metaTitle.length}/60 characters (recommended: 50-60)
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="metaDescription">Meta Description</Label>
                    <Textarea
                      id="metaDescription"
                      value={currentBlog.metaDescription}
                      onChange={(e) => setCurrentBlog({ ...currentBlog, metaDescription: e.target.value })}
                      rows={3}
                      placeholder="SEO description for search results (auto-generated from excerpt if empty)"
                      maxLength={160}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {currentBlog.metaDescription.length}/160 characters (recommended: 150-160)
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="media" className="space-y-4">
                  <div>
                    <Label htmlFor="featuredImage">Featured Image</Label>
                    <div className="mt-2">
                      <div className="flex items-center gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById("blog-image-upload")?.click()}
                          disabled={uploadingImage}
                          className="flex items-center gap-2"
                        >
                          <Upload className="h-4 w-4" />
                          {uploadingImage ? "Uploading..." : "Upload Image"}
                        </Button>
                        <input
                          id="blog-image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>

                      {imagePreview && (
                        <div className="mt-4 relative w-full max-w-md">
                          <img
                            src={imagePreview || "/placeholder.svg"}
                            alt="Featured Image Preview"
                            className="w-full h-48 object-cover rounded-md border"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                            onClick={() => {
                              setImagePreview(null)
                              setCurrentBlog((prev) => (prev ? { ...prev, featuredImage: "" } : null))
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {imagePreview && (
                    <div>
                      <Label htmlFor="featuredImageAlt">Featured Image ALT Text (SEO)</Label>
                      <Input
                        id="featuredImageAlt"
                        value={currentBlog.featuredImageAlt}
                        onChange={(e) => setCurrentBlog({ ...currentBlog, featuredImageAlt: e.target.value })}
                        placeholder="Describe the image for accessibility and SEO"
                      />
                      <p className="text-xs text-gray-500 mt-1">Helps with SEO and accessibility for screen readers</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveBlog}>{isEditing ? "Update Blog" : "Create Blog"}</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Are you sure you want to delete "{currentBlog?.title}"? This action cannot be undone.
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteBlog}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
