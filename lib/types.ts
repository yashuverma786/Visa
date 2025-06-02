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

export interface Country {
  _id?: string
  name: string
  code: string
  visa?: VisaDetails
  image: string
  description: string
  createdAt?: Date
  updatedAt?: Date
}

export interface VisaDetails {
  type: "B1-B2" // Only B1-B2 visa type
  price: number
  processingTime: string
  requiredDocuments: string[]
  processSteps: string[]
  additionalInfo?: string
}

export interface VisaApplication {
  _id?: string
  applicantName: string
  email: string
  phone: string
  country: string
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
  _id?: string
  name: string
  country: string
  rating: number
  comment: string
  image?: string
  createdAt?: Date
}

export interface LeadCapture {
  _id?: string
  name: string
  email: string
  phone: string
  placeToVisit: string
  message?: string
  source: "popup" | "hero" | "contact"
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
