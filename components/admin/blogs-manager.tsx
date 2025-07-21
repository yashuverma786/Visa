"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash, Search, RefreshCw, Upload, X } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

interface Blog {
  _id?: string
  title: string
  slug: string
  content: string
  excerpt: string
  featuredImage: string
  featuredImageAlt: string
  metaTitle: string
  metaDescription: string
  tags: string[]
  category: string
  status: "draft" | "published"
  publishedAt?: Date
  createdAt?: Date
  updatedAt?: Date
}

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
  const [imagePreview, setImagePreview] = useState<string>("")
  const [tagInput, setTagInput] = useState("")
  const { toast } = useToast()

  const categories = ["Visa Guide", "Travel Tips", "Country Info", "News", "General"]

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
        toast({
          title: "Error",
          description: "Failed to fetch blogs",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching blogs:", error)
      toast({
        title: "Error",
        description: "Error fetching blogs",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive",
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size should be less than 5MB",
        variant: "destructive",
      })
      return
    }

    try {
      setUploadingImage(true)

      // Create preview immediately
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const { url } = await response.json()
        setCurrentBlog((prev) => (prev ? { ...prev, featuredImage: url } : null))
        setImagePreview(url)
        toast({
          title: "Success",
          description: "Image uploaded successfully",
        })
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: `Failed to upload image: ${errorData.error}`,
          variant: "destructive",
        })
        setImagePreview("")
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Error",
        description: "Error uploading image",
        variant: "destructive",
      })
      setImagePreview("")
    } finally {
      setUploadingImage(false)
    }
  }

  const handleAddBlog = () => {
    setCurrentBlog({
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      featuredImage: "",
      featuredImageAlt: "",
      metaTitle: "",
      metaDescription: "",
      tags: [],
      category: "General",
      status: "draft",
    })
    setImagePreview("")
    setTagInput("")
    setIsEditing(false)
    setIsDialogOpen(true)
  }

  const handleEditBlog = (blog: Blog) => {
    setCurrentBlog(blog)
    setImagePreview(blog.featuredImage)
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
          description: "Blog deleted successfully",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to delete blog",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting blog:", error)
      toast({
        title: "Error",
        description: "Error deleting blog",
        variant: "destructive",
      })
    } finally {
      setIsConfirmDeleteOpen(false)
      setCurrentBlog(null)
    }
  }

  const handleSaveBlog = async () => {
    if (!currentBlog) return

    if (!currentBlog.title.trim() || !currentBlog.content.trim()) {
      toast({
        title: "Validation Error",
        description: "Title and content are required",
        variant: "destructive",
      })
      return
    }

    const slug = currentBlog.slug || generateSlug(currentBlog.title)
    const tags = tagInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)

    const blogData = {
      ...currentBlog,
      slug,
      tags,
      metaTitle: currentBlog.metaTitle || currentBlog.title,
      metaDescription: currentBlog.metaDescription || currentBlog.excerpt,
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
          setBlogs([...blogs, savedBlog])
        }
        toast({
          title: "Success",
          description: `Blog ${isEditing ? "updated" : "created"} successfully`,
        })
        setIsDialogOpen(false)
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || `Failed to ${isEditing ? "update" : "create"} blog`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving blog:", error)
      toast({
        title: "Error",
        description: "Error saving blog",
        variant: "destructive",
      })
    }
  }

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
            <CardHeader className="p-0">
              {blog.featuredImage && (
                <div className="relative h-48 w-full">
                  <Image
                    src={blog.featuredImage || "/placeholder.svg"}
                    alt={blog.featuredImageAlt || blog.title}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant={blog.status === "published" ? "default" : "secondary"}>{blog.status}</Badge>
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold line-clamp-2">{blog.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">{blog.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{blog.category}</span>
                  <span>{blog.tags.length} tags</span>
                </div>
                <div className="text-xs text-gray-400">URL: /blogs/{blog.slug}</div>
              </div>
              <div className="flex space-x-2 mt-4">
                <Button variant="outline" size="sm" onClick={() => handleEditBlog(blog)} className="flex-1">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteBlog(blog)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBlogs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No blogs found matching your criteria.</p>
        </div>
      )}

      {/* Blog Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {currentBlog && (
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Edit Blog" : "Add New Blog"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={currentBlog.title}
                    onChange={(e) => {
                      const title = e.target.value
                      setCurrentBlog({
                        ...currentBlog,
                        title,
                        slug: currentBlog.slug || generateSlug(title),
                      })
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={currentBlog.slug}
                    onChange={(e) => setCurrentBlog({ ...currentBlog, slug: e.target.value })}
                    placeholder="auto-generated-from-title"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    URL: /blogs/
                    {currentBlog.slug || (currentBlog.title ? generateSlug(currentBlog.title) : "your-slug")}
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={currentBlog.excerpt}
                  onChange={(e) => setCurrentBlog({ ...currentBlog, excerpt: e.target.value })}
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={currentBlog.content}
                  onChange={(e) => setCurrentBlog({ ...currentBlog, content: e.target.value })}
                  rows={8}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={currentBlog.category}
                    onValueChange={(value) => setCurrentBlog({ ...currentBlog, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="visa, travel, guide"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="featuredImage">Featured Image</Label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                    disabled={uploadingImage}
                  />
                  <Button type="button" variant="outline" asChild disabled={uploadingImage}>
                    <label htmlFor="image-upload" className="cursor-pointer flex items-center">
                      <Upload className="h-4 w-4 mr-2" />
                      {uploadingImage ? "Uploading..." : "Upload Image"}
                    </label>
                  </Button>
                  {(imagePreview || currentBlog.featuredImage) && (
                    <div className="relative w-32 h-24">
                      <Image
                        src={imagePreview || currentBlog.featuredImage || "/placeholder.svg"}
                        alt="Preview"
                        fill
                        className="object-cover rounded"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                        onClick={() => {
                          setCurrentBlog({ ...currentBlog, featuredImage: "" })
                          setImagePreview("")
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="featuredImageAlt">Featured Image Alt Text</Label>
                <Input
                  id="featuredImageAlt"
                  value={currentBlog.featuredImageAlt}
                  onChange={(e) => setCurrentBlog({ ...currentBlog, featuredImageAlt: e.target.value })}
                  placeholder="Describe the image for accessibility"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    value={currentBlog.metaTitle}
                    onChange={(e) => setCurrentBlog({ ...currentBlog, metaTitle: e.target.value })}
                    placeholder="SEO title (defaults to blog title)"
                  />
                </div>
                <div>
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Input
                    id="metaDescription"
                    value={currentBlog.metaDescription}
                    onChange={(e) => setCurrentBlog({ ...currentBlog, metaDescription: e.target.value })}
                    placeholder="SEO description (defaults to excerpt)"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="status"
                  checked={currentBlog.status === "published"}
                  onCheckedChange={(checked) =>
                    setCurrentBlog({ ...currentBlog, status: checked ? "published" : "draft" })
                  }
                />
                <Label htmlFor="status">Publish immediately</Label>
              </div>
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
