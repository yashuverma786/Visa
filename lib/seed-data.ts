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
        price: 15000,
        currency: "INR",
        processingTime: "15-30 days",
        validity: "Up to 10 years",
        entries: "Multiple",
        requiredDocuments: ["Valid passport", "DS-160 form", "Passport photos", "Bank statements", "Employment letter"],
        processSteps: [
          "Fill DS-160 form online",
          "Pay visa fee",
          "Schedule interview",
          "Attend interview",
          "Receive passport with visa",
        ],
        eligibility: [
          "Valid passport with 6+ months validity",
          "Sufficient funds for travel",
          "Strong ties to home country",
          "No criminal record",
        ],
        additionalInfo: "Interview required for first-time applicants",
      },
      {
        id: "us_business",
        name: "Business Visa (B-1)",
        type: "Business",
        price: 18000,
        currency: "INR",
        processingTime: "15-30 days",
        validity: "Up to 10 years",
        entries: "Multiple",
        requiredDocuments: [
          "Valid passport",
          "DS-160 form",
          "Business invitation letter",
          "Company registration",
          "Bank statements",
        ],
        processSteps: [
          "Obtain invitation letter",
          "Fill DS-160 form",
          "Pay visa fee",
          "Schedule interview",
          "Attend interview",
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
    description:
      "UK visa services for tourism, business, and study. Expert guidance for all UK visa categories with high success rates.",
    image: "/placeholder.svg?height=300&width=400&text=UK+Flag",
    currency: "GBP",
    visaCategories: [
      {
        id: "uk_tourist",
        name: "Standard Visitor Visa",
        type: "Tourist",
        price: 12000,
        currency: "INR",
        processingTime: "15-20 days",
        validity: "6 months",
        entries: "Multiple",
        requiredDocuments: [
          "Valid passport",
          "Online application form",
          "Passport photos",
          "Bank statements",
          "Travel itinerary",
        ],
        processSteps: [
          "Complete online application",
          "Pay visa fee",
          "Book biometric appointment",
          "Attend biometric appointment",
          "Receive decision",
        ],
        eligibility: ["Genuine visitor", "Sufficient funds", "Intent to leave UK", "No immigration history issues"],
        additionalInfo: "No interview required for most applicants",
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
        id: "ca_tourist",
        name: "Visitor Visa (TRV)",
        type: "Tourist",
        price: 8000,
        currency: "INR",
        processingTime: "20-30 days",
        validity: "Up to 10 years",
        entries: "Multiple",
        requiredDocuments: [
          "Valid passport",
          "Application form",
          "Passport photos",
          "Financial proof",
          "Travel purpose letter",
        ],
        processSteps: [
          "Complete application online",
          "Pay fees",
          "Submit biometrics",
          "Wait for processing",
          "Receive passport request",
        ],
        eligibility: ["Valid travel document", "Good health", "No criminal record", "Sufficient funds"],
        additionalInfo: "eTA may be sufficient for some nationalities",
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export const sampleTestimonials: Testimonial[] = [
  {
    _id: "testimonial_1",
    name: "Priya Sharma",
    content:
      "JMT Travel made my US visa process so smooth. Their team guided me through every step and I got my visa approved in just 20 days!",
    rating: 5,
    country: "USA",
    image: "/placeholder.svg?height=100&width=100&text=PS",
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "testimonial_2",
    name: "Rajesh Kumar",
    content:
      "Excellent service for UK visa. Very professional team and they handled all the documentation perfectly. Highly recommended!",
    rating: 5,
    country: "UK",
    image: "/placeholder.svg?height=100&width=100&text=RK",
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "testimonial_3",
    name: "Anita Patel",
    content:
      "Got my Canada visitor visa through JMT Travel. They were very helpful and responsive throughout the process.",
    rating: 4,
    country: "Canada",
    image: "/placeholder.svg?height=100&width=100&text=AP",
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export const sampleBlogs: BlogPost[] = [
  {
    _id: "blog_1",
    title: "Complete Guide to US Tourist Visa Application 2024",
    slug: "us-tourist-visa-guide-2024",
    excerpt:
      "Everything you need to know about applying for a US tourist visa in 2024, including requirements, process, and tips for approval.",
    content: `
# Complete Guide to US Tourist Visa Application 2024

Getting a US tourist visa can seem daunting, but with proper preparation and guidance, the process becomes much smoother. Here's everything you need to know about applying for a US B-2 tourist visa in 2024.

## Requirements

### Basic Requirements
- Valid passport with at least 6 months validity
- Completed DS-160 form
- Visa application fee payment
- Passport-style photograph
- Supporting documents

### Financial Requirements
- Bank statements for the last 6 months
- Income tax returns
- Employment letter
- Property documents (if applicable)

## Application Process

### Step 1: Complete DS-160 Form
The DS-160 is an online form that must be completed accurately. Take your time and ensure all information is correct.

### Step 2: Pay Visa Fee
Pay the non-refundable visa application fee through approved payment methods.

### Step 3: Schedule Interview
Book your visa interview appointment at the nearest US consulate or embassy.

### Step 4: Prepare Documents
Gather all required documents and organize them properly for your interview.

### Step 5: Attend Interview
Arrive on time for your interview and answer questions honestly and confidently.

## Tips for Success

1. **Be Honest**: Always provide truthful information
2. **Show Strong Ties**: Demonstrate your intention to return to your home country
3. **Financial Stability**: Prove you can afford your trip
4. **Clear Purpose**: Have a clear reason for your visit
5. **Proper Documentation**: Ensure all documents are complete and organized

## Common Reasons for Rejection

- Insufficient financial proof
- Lack of strong ties to home country
- Incomplete or incorrect application
- Previous immigration violations
- Inability to demonstrate genuine tourist intent

## Conclusion

With proper preparation and the right guidance, obtaining a US tourist visa is achievable. Consider working with experienced visa consultants like JMT Travel to increase your chances of approval.
    `,
    author: "Visa Expert Team",
    publishedAt: new Date("2024-01-15"),
    tags: ["USA", "Tourist Visa", "Travel", "Immigration"],
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "blog_2",
    title: "UK Visa Requirements: What You Need to Know",
    slug: "uk-visa-requirements-guide",
    excerpt:
      "Comprehensive guide to UK visa requirements for Indian citizens, including document checklist and application tips.",
    content: `
# UK Visa Requirements: What You Need to Know

Planning a trip to the United Kingdom? Understanding the visa requirements is crucial for a successful application. This guide covers everything Indian citizens need to know about UK visa requirements.

## Types of UK Visas

### Standard Visitor Visa
The most common visa for tourists, business visitors, and those visiting family or friends.

### Student Visa
For those planning to study in the UK for more than 6 months.

### Work Visa
Various categories for skilled workers, entrepreneurs, and investors.

## Document Requirements

### Basic Documents
- Valid passport
- Completed online application
- Biometric information
- Passport photographs
- Supporting documents

### Financial Documents
- Bank statements (6 months)
- Salary slips
- Income tax returns
- Sponsorship letters (if applicable)

### Travel Documents
- Flight itinerary
- Hotel bookings
- Travel insurance
- Invitation letters (if visiting someone)

## Application Process

1. **Complete Online Application**: Fill out the application form on the official UK government website
2. **Pay Fees**: Pay the visa fee and healthcare surcharge (if applicable)
3. **Book Appointment**: Schedule your biometric appointment
4. **Attend Appointment**: Submit documents and provide biometrics
5. **Wait for Decision**: Processing times vary by visa type

## Processing Times

- Standard Visitor Visa: 15 working days
- Priority Service: 5 working days (additional fee)
- Super Priority Service: 24 hours (additional fee)

## Tips for Success

- Apply early (at least 3 months before travel)
- Ensure all documents are genuine and up-to-date
- Provide clear evidence of your intention to return
- Be honest in your application
- Consider using professional visa services

## Common Mistakes to Avoid

- Incomplete applications
- Insufficient financial proof
- Poor quality photographs
- Missing supporting documents
- Applying too late

Working with experienced visa consultants can significantly improve your chances of approval and reduce stress during the application process.
    `,
    author: "Immigration Specialist",
    publishedAt: new Date("2024-01-10"),
    tags: ["UK", "Visa Requirements", "Immigration", "Travel"],
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]
