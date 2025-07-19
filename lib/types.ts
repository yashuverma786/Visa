import type { ObjectId } from "mongodb"

export interface Task {
  id: string
  title: string
  description: string
  status: "pending" | "in-progress" | "completed"
  createdAt: Date
  updatedAt: Date
}

export interface CreateTaskData {
  title: string
  description: string
  status: "pending" | "in-progress" | "completed"
}

export interface UpdateTaskData extends CreateTaskData {
  id: string
}

export interface VisaCategory {
  id: string
  name: string
  type: string // e.g., "Tourist", "Business", "Student", "Work", "Family"
  price: number
  currency: string // e.g., "USD", "CAD", "AUD", "EUR", "INR"
  processingTime: string
  validity: string
  entries: "Single" | "Multiple"
  requiredDocuments: string[]
  processSteps: string[]
  additionalInfo?: string
  eligibility: string[]
  restrictions?: string[]
}

export interface Country {
  _id?: string | ObjectId
  name: string
  code: string
  slug: string // URL slug based on country name
  flagEmoji?: string
  visaFee?: string
  currency?: string // Default currency for the country
  processingTime?: string
  description?: string
  requirements?: string // General requirements
  imageUrl?: string
  visaTypes?: VisaType[] // Array of specific visa types for this country
  generalDocuments?: string // General documents for the country
  generalProcess?: string // General process for the country
  createdAt?: Date
  updatedAt?: Date
}

export interface VisaType {
  type: string // e.g., "Tourist Visa", "Business Visa"
  price?: string
  currency?: string // Currency for this specific visa type
  processingTime?: string
  validity?: string // e.g., "6 months", "1 year"
  entryType?: string // e.g., "Single Entry", "Multiple Entry"
  documents: string[] // List of required documents for this specific visa type
  process: string[] // Step-by-step process for this specific visa type
  eligibility: string[] // Eligibility criteria for this specific visa type
}

export interface Blog {
  _id?: string | ObjectId
  title: string
  slug: string
  content: string
  excerpt: string
  metaTitle?: string // SEO meta title
  metaDescription?: string // SEO meta description
  featuredImage?: string
  featuredImageAlt?: string // ALT text for featured image
  images?: string[] // Additional images for the blog
  author: string
  tags: string[]
  published: boolean
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface VisaApplication {
  _id?: string | ObjectId
  applicantName: string
  email: string
  phone: string
  country: string
  visaCategory: string
  documents: UploadedDocument[]
  status: "pending" | "processing" | "approved" | "rejected"
  submittedAt: Date
  notes?: string
  dateOfBirth?: string
  nationality?: string
  passportNumber?: string
  travelDate?: string
  purpose?: string
  additionalInfo?: string
}

export interface UploadedDocument {
  name: string
  url: string
  type: string
  size: number
}

export interface Testimonial {
  _id?: string | ObjectId
  customerName: string
  country: string
  rating: number // 1-5
  feedback: string
  imageUrl?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface LeadCapture {
  _id?: string | ObjectId
  name: string
  email: string
  phone: string
  placeToVisit?: string
  visaType?: string
  message?: string
  source: "popup" | "hero" | "contact"
  documents?: { name: string; url: string; type: string; size: number }[]
  createdAt?: Date
}

export interface PopupLead {
  name: string
  email: string
  phone: string
  placeToVisit: string
}

export interface AdminUser {
  username: string
  password: string
}

export interface Application {
  _id?: string | ObjectId
  applicantName: string
  email: string
  phone: string
  countryApplyingFor: string
  visaType: string
  status: "pending" | "approved" | "rejected" | "in-review"
  submittedAt: Date
  documents: { name: string; url: string; type: string; size: number }[]
  notes?: string
}
