import type { Country, Testimonial, BlogPost } from "@/lib/types"

export const sampleCountries: Country[] = [
  {
    _id: "sample_usa",
    name: "United States",
    slug: "usa",
    description:
      "Get your US visa with our expert assistance. We handle all types of US visas including tourist, business, student, and work visas.",
    image: "/placeholder.svg?height=300&width=400&text=USA+Flag",
    currency: "USD",
    visaCategories: [
      {
        id: "us_tourist",
        name: "Tourist Visa (B-2)",
        type: "Tourist",
        price: 185,
        currency: "USD",
        processingTime: "15-30 days",
        validity: "Up to 10 years",
        entries: "Multiple",
        requiredDocuments: [
          "Valid passport",
          "DS-160 form",
          "Passport photos",
          "Bank statements",
          "Employment letter",
          "Travel itinerary",
        ],
        processSteps: [
          "Fill DS-160 form online",
          "Pay visa fee",
          "Schedule interview",
          "Attend embassy interview",
          "Receive passport with visa",
        ],
        eligibility: [
          "Valid passport with 6+ months validity",
          "Sufficient funds for travel",
          "Strong ties to home country",
          "No criminal record",
        ],
        additionalInfo: "Interview required for most applicants",
      },
      {
        id: "us_business",
        name: "Business Visa (B-1)",
        type: "Business",
        price: 185,
        currency: "USD",
        processingTime: "15-30 days",
        validity: "Up to 10 years",
        entries: "Multiple",
        requiredDocuments: [
          "Valid passport",
          "DS-160 form",
          "Business invitation letter",
          "Company registration",
          "Bank statements",
          "Employment verification",
        ],
        processSteps: [
          "Obtain invitation from US company",
          "Fill DS-160 form",
          "Pay visa fee",
          "Schedule interview",
          "Attend embassy interview",
        ],
        eligibility: [
          "Valid business purpose",
          "Invitation from US company",
          "Sufficient funds",
          "Intent to return home",
        ],
        additionalInfo: "Business meetings, conferences, and negotiations allowed",
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "sample_uk",
    name: "United Kingdom",
    slug: "uk",
    description: "UK visa services for tourism, business, study, and work. Expert guidance for all UK visa categories.",
    image: "/placeholder.svg?height=300&width=400&text=UK+Flag",
    currency: "GBP",
    visaCategories: [
      {
        id: "uk_tourist",
        name: "Standard Visitor Visa",
        type: "Tourist",
        price: 115,
        currency: "GBP",
        processingTime: "15-20 days",
        validity: "6 months",
        entries: "Multiple",
        requiredDocuments: [
          "Valid passport",
          "Online application form",
          "Passport photos",
          "Bank statements",
          "Travel itinerary",
          "Accommodation proof",
        ],
        processSteps: [
          "Complete online application",
          "Pay visa fee",
          "Book biometric appointment",
          "Attend biometric appointment",
          "Receive decision",
        ],
        eligibility: ["Genuine visitor", "Sufficient funds", "Intent to leave UK", "No work allowed"],
        additionalInfo: "Tourism, business meetings, and short courses allowed",
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "sample_canada",
    name: "Canada",
    slug: "canada",
    description:
      "Canadian visa assistance for visitors, students, and workers. Professional guidance for all Canadian immigration programs.",
    image: "/placeholder.svg?height=300&width=400&text=Canada+Flag",
    currency: "CAD",
    visaCategories: [
      {
        id: "canada_tourist",
        name: "Visitor Visa (TRV)",
        type: "Tourist",
        price: 100,
        currency: "CAD",
        processingTime: "20-30 days",
        validity: "Up to 10 years",
        entries: "Multiple",
        requiredDocuments: [
          "Valid passport",
          "Application form",
          "Passport photos",
          "Financial proof",
          "Travel itinerary",
          "Invitation letter (if applicable)",
        ],
        processSteps: [
          "Complete application online",
          "Pay fees",
          "Submit biometrics",
          "Wait for processing",
          "Receive passport request",
        ],
        eligibility: ["Valid travel document", "Good health", "No criminal record", "Sufficient funds"],
        additionalInfo: "May require medical exam and police certificate",
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export const sampleTestimonials: Testimonial[] = [
  {
    _id: "testimonial_1",
    name: "Rajesh Kumar",
    content:
      "Excellent service! Got my US tourist visa approved in just 20 days. The team was very professional and guided me through every step.",
    country: "India",
    rating: 5,
    image: "/placeholder.svg?height=100&width=100&text=RK",
    isApproved: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    _id: "testimonial_2",
    name: "Priya Sharma",
    content:
      "Amazing experience with JMT Travel. They helped me get my UK student visa without any hassle. Highly recommended!",
    country: "India",
    rating: 5,
    image: "/placeholder.svg?height=100&width=100&text=PS",
    isApproved: true,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    _id: "testimonial_3",
    name: "Mohammed Ali",
    content:
      "Professional and reliable service. Got my Canada visitor visa approved quickly. Thank you JMT Travel team!",
    country: "Pakistan",
    rating: 5,
    image: "/placeholder.svg?height=100&width=100&text=MA",
    isApproved: true,
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05"),
  },
]

export const sampleBlogPosts: BlogPost[] = [
  {
    _id: "blog_1",
    title: "Complete Guide to US Tourist Visa Application",
    slug: "us-tourist-visa-guide",
    excerpt:
      "Everything you need to know about applying for a US B-2 tourist visa, including requirements, process, and tips for approval.",
    content: `
# Complete Guide to US Tourist Visa Application

Getting a US tourist visa can seem daunting, but with proper preparation and guidance, the process becomes much more manageable. This comprehensive guide will walk you through everything you need to know.

## What is a US Tourist Visa?

The B-2 tourist visa allows foreign nationals to visit the United States temporarily for tourism, vacation, or visiting family and friends.

## Requirements

- Valid passport with at least 6 months validity
- Completed DS-160 form
- Visa application fee payment
- Passport-style photographs
- Supporting documents

## Application Process

1. **Complete DS-160 Form**: Fill out the online application form
2. **Pay Visa Fee**: Pay the required fee online
3. **Schedule Interview**: Book your embassy appointment
4. **Prepare Documents**: Gather all required paperwork
5. **Attend Interview**: Visit the US embassy or consulate

## Tips for Success

- Be honest and consistent in your application
- Demonstrate strong ties to your home country
- Show sufficient financial resources
- Prepare for the interview thoroughly

Contact JMT Travel for expert assistance with your US visa application!
    `,
    image: "/placeholder.svg?height=400&width=600&text=US+Visa+Guide",
    author: "JMT Travel Team",
    tags: ["USA", "Tourist Visa", "B-2 Visa", "Travel"],
    isPublished: true,
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    _id: "blog_2",
    title: "UK Visa Requirements for Indian Citizens",
    slug: "uk-visa-requirements-indian-citizens",
    excerpt:
      "Detailed information about UK visa requirements specifically for Indian passport holders, including documents and process.",
    content: `
# UK Visa Requirements for Indian Citizens

Indian citizens planning to visit the UK need to understand the specific requirements and process for obtaining a UK visa.

## Types of UK Visas

- Standard Visitor Visa
- Student Visa
- Work Visa
- Family Visa

## Required Documents

- Valid Indian passport
- Completed online application
- Biometric information
- Financial documents
- Travel itinerary

## Processing Time

Standard processing time is 15-20 working days, with priority services available for faster processing.

## Common Reasons for Rejection

- Insufficient funds
- Incomplete documentation
- Lack of travel history
- Unclear purpose of visit

Let JMT Travel help you navigate the UK visa process successfully!
    `,
    image: "/placeholder.svg?height=400&width=600&text=UK+Visa+Requirements",
    author: "Visa Expert",
    tags: ["UK", "Visa Requirements", "Indian Citizens", "Travel"],
    isPublished: true,
    createdAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-01-18"),
  },
]
