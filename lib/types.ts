export interface Task {
  _id: string
  title: string
  description: string
  status: "pending" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  createdAt: Date
  updatedAt: Date
}

export interface VisaCategory {
  id: string
  name: string
  type: "Tourist" | "Business" | "Student" | "Work" | "Family" | "Transit" | "Medical"
  price: number
  currency: string
  processingTime: string
  validity: string
  entries: "Single" | "Multiple"
  requiredDocuments: string[]
  processSteps: string[]
  eligibility: string[]
  additionalInfo: string
}

export interface Country {
  _id?: string
  name: string
  code: string
  slug: string
  flagEmoji?: string
  description: string
  image: string
  visaFee?: string
  currency?: string
  processingTime?: string
  requirements?: string
  imageUrl?: string
  visaTypes?: VisaType[]
  visaCategories: VisaCategory[]
  createdAt?: Date
  updatedAt?: Date
}

export interface VisaType {
  type: string
  price: string
  currency: string
  processingTime: string
  validity: string
  entryType: string
  documents: string[]
  process: string[]
  eligibility: string[]
}

export interface VisaApplication {
  _id: string
  fullName: string
  email: string
  phone: string
  country: string
  visaType: string
  travelDate: string
  purpose: string
  documents: string[]
  status: "pending" | "processing" | "approved" | "rejected"
  submittedAt: Date
  notes?: string
}

export interface Testimonial {
  _id: string
  name: string
  country: string
  rating: number
  comment: string
  imageUrl?: string
  isApproved: boolean
  createdAt: Date
}

export interface Lead {
  _id: string
  name: string
  email: string
  phone: string
  country?: string
  visaType?: string
  message?: string
  source: "popup" | "form" | "contact"
  status: "new" | "contacted" | "converted" | "closed"
  createdAt: Date
  notes?: string
}

export interface Blog {
  _id: string
  title: string
  slug: string
  content: string
  excerpt: string
  featuredImage: string
  featuredImageAlt: string
  metaTitle: string
  metaDescription: string
  tags: string[]
  author: string
  published: boolean
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
  readTime?: number
}
