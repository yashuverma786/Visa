import type { Country, Testimonial, BlogPost } from "./types"

export const sampleCountries: Country[] = [
  {
    _id: "sample_usa",
    name: "United States",
    slug: "usa",
    description:
      "Experience the land of opportunities with our comprehensive US visa services. From tourist visas to business and student visas, we handle all types of US visa applications with expert guidance.",
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
          "Visa application fee receipt",
          "Passport-style photograph",
          "Interview appointment letter",
          "Supporting documents (bank statements, employment letter, etc.)",
        ],
        processSteps: [
          "Complete DS-160 online application",
          "Pay visa application fee",
          "Schedule visa interview",
          "Attend visa interview at US Embassy/Consulate",
          "Wait for visa processing",
          "Collect passport with visa",
        ],
        eligibility: [
          "Valid passport with at least 6 months validity",
          "Proof of financial support",
          "Strong ties to home country",
          "No criminal background",
          "Clear intent to return after visit",
        ],
        additionalInfo: "Tourist visas are for leisure, visiting family/friends, or medical treatment.",
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
          "Visa application fee receipt",
          "Business invitation letter",
          "Company registration documents",
          "Financial statements",
        ],
        processSteps: [
          "Obtain business invitation from US company",
          "Complete DS-160 online application",
          "Pay visa application fee",
          "Schedule and attend visa interview",
          "Submit required business documents",
          "Wait for visa approval",
        ],
        eligibility: [
          "Valid business purpose",
          "Invitation from US business partner",
          "Sufficient funds for trip",
          "Intent to return to home country",
          "No intention to work in the US",
        ],
        additionalInfo: "For business meetings, conferences, and negotiations only.",
      },
    ],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    _id: "sample_uk",
    name: "United Kingdom",
    slug: "uk",
    description:
      "Discover the rich history and culture of the UK with our expert visa assistance. We provide comprehensive support for all UK visa categories including tourist, business, and student visas.",
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
          "Completed application form",
          "Passport photographs",
          "Bank statements (3 months)",
          "Employment letter",
          "Travel itinerary",
          "Accommodation proof",
        ],
        processSteps: [
          "Complete online application",
          "Pay application fee",
          "Book biometric appointment",
          "Attend biometric appointment",
          "Submit supporting documents",
          "Wait for decision",
        ],
        eligibility: [
          "Genuine visitor with intent to leave UK",
          "Sufficient funds for stay",
          "No intention to work",
          "Meet health requirements",
          "No criminal convictions",
        ],
        additionalInfo: "For tourism, visiting family/friends, or short business trips.",
      },
    ],
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02"),
  },
  {
    _id: "sample_canada",
    name: "Canada",
    slug: "canada",
    description:
      "Explore the beautiful landscapes of Canada with our professional visa services. We assist with all types of Canadian visas including visitor visas, work permits, and study permits.",
    image: "/placeholder.svg?height=300&width=400&text=Canada+Flag",
    currency: "CAD",
    visaCategories: [
      {
        id: "ca_visitor",
        name: "Visitor Visa (TRV)",
        type: "Tourist",
        price: 100,
        currency: "CAD",
        processingTime: "20-30 days",
        validity: "Up to 10 years",
        entries: "Multiple",
        requiredDocuments: [
          "Valid passport",
          "Completed application forms",
          "Photographs",
          "Proof of financial support",
          "Letter of invitation (if applicable)",
          "Travel history",
        ],
        processSteps: [
          "Determine eligibility",
          "Gather required documents",
          "Complete application online",
          "Pay fees",
          "Submit biometrics",
          "Wait for processing",
        ],
        eligibility: [
          "Valid travel document",
          "Good health",
          "No criminal record",
          "Convince officer you will leave Canada",
          "Sufficient funds",
        ],
        additionalInfo: "Required for most foreign nationals visiting Canada.",
      },
    ],
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-01-03"),
  },
]

export const sampleTestimonials: Testimonial[] = [
  {
    _id: "testimonial_1",
    name: "Priya Sharma",
    country: "India",
    rating: 5,
    comment:
      "Excellent service! JMT Travel made my US visa process so smooth. Their team was very professional and guided me through every step. Highly recommended!",
    visaType: "US Tourist Visa",
    image: "/placeholder.svg?height=100&width=100&text=PS",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    _id: "testimonial_2",
    name: "Rajesh Kumar",
    country: "India",
    rating: 5,
    comment:
      "Got my UK visa approved in just 18 days! The documentation support was outstanding. Thank you JMT Travel for making my dream trip possible.",
    visaType: "UK Standard Visitor Visa",
    image: "/placeholder.svg?height=100&width=100&text=RK",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    _id: "testimonial_3",
    name: "Anita Patel",
    country: "India",
    rating: 4,
    comment:
      "Professional service with quick response times. They helped me get my Canada visitor visa without any hassles. Great experience overall!",
    visaType: "Canada Visitor Visa",
    image: "/placeholder.svg?height=100&width=100&text=AP",
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date("2024-01-25"),
  },
]

export const sampleBlogs: BlogPost[] = [
  {
    _id: "blog_1",
    title: "Complete Guide to US Tourist Visa Application 2024",
    slug: "us-tourist-visa-guide-2024",
    excerpt:
      "Everything you need to know about applying for a US tourist visa, including requirements, process, and tips for approval.",
    content: `
# Complete Guide to US Tourist Visa Application 2024

The United States remains one of the most popular travel destinations worldwide. If you're planning to visit the US for tourism, you'll need a B-2 tourist visa. This comprehensive guide will walk you through everything you need to know about the US tourist visa application process.

## What is a US Tourist Visa?

A US Tourist Visa (B-2) is a non-immigrant visa that allows foreign nationals to enter the United States temporarily for tourism, vacation, or visiting family and friends.

## Requirements

- Valid passport
- Completed DS-160 form
- Visa application fee
- Passport-style photograph
- Supporting documents

## Application Process

1. Complete the DS-160 online application
2. Pay the visa application fee
3. Schedule your visa interview
4. Attend the visa interview
5. Wait for processing
6. Collect your passport

## Tips for Approval

- Be honest and consistent in your application
- Provide strong ties to your home country
- Show sufficient financial resources
- Prepare for the interview thoroughly

Contact JMT Travel for expert assistance with your US visa application!
    `,
    author: "JMT Travel Team",
    publishedAt: new Date("2024-01-10"),
    tags: ["USA", "Tourist Visa", "Travel", "Immigration"],
    featured: true,
    image: "/placeholder.svg?height=400&width=600&text=US+Visa+Guide",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    _id: "blog_2",
    title: "UK Visa Requirements: What You Need to Know",
    slug: "uk-visa-requirements-guide",
    excerpt:
      "A detailed overview of UK visa requirements, application process, and essential documents needed for a successful application.",
    content: `
# UK Visa Requirements: What You Need to Know

Planning a trip to the United Kingdom? Understanding the visa requirements is crucial for a successful application. This guide covers everything you need to know about UK visa requirements.

## Types of UK Visas

- Standard Visitor Visa
- Business Visitor Visa
- Student Visa
- Work Visa

## General Requirements

- Valid passport
- Completed application form
- Biometric information
- Supporting documents
- Application fee

## Application Process

The UK visa application process involves several steps that must be completed carefully to ensure success.

## Common Mistakes to Avoid

- Incomplete documentation
- Insufficient financial proof
- Poor travel history
- Inadequate accommodation proof

Get professional help from JMT Travel for your UK visa application!
    `,
    author: "Visa Expert",
    publishedAt: new Date("2024-01-12"),
    tags: ["UK", "Visa Requirements", "Travel", "Documentation"],
    featured: false,
    image: "/placeholder.svg?height=400&width=600&text=UK+Visa",
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-12"),
  },
]
