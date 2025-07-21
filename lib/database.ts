import type { Country, VisaApplication, Testimonial, LeadCapture } from "./types"
import { sampleCountries } from "./seed-data"

// This file should only be used on the server side
if (typeof window !== "undefined") {
  throw new Error("Database functions should only be used on the server side")
}

const { MongoClient } = require("mongodb")

const uri = process.env.MONGODB_URI || "mongodb+srv://visaajmt:PCCuvYy4jAd16fpx@visaadatabase.jyvzcin.mongodb.net/"
const DB_NAME = "visaadatabase"

let client: any
let clientPromise: Promise<any>

if (!uri) {
  console.warn("MongoDB URI not found, using fallback data")
  clientPromise = Promise.reject(new Error("No MongoDB URI"))
} else {
  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<any>
    }

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri)
      globalWithMongo._mongoClientPromise = client.connect()
    }
    clientPromise = globalWithMongo._mongoClientPromise
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri)
    clientPromise = client.connect()
  }
}

export async function getMongoClient() {
  return await clientPromise
}

export async function getDatabase() {
  try {
    const client = await getMongoClient()
    return client.db(DB_NAME)
  } catch (error) {
    console.error("Error getting database:", error)
    throw error
  }
}

// Check if database is available
export async function isDatabaseAvailable(): Promise<boolean> {
  try {
    const client = await Promise.race([
      clientPromise,
      new Promise((_, reject) => setTimeout(() => reject(new Error("Connection timeout")), 15000)),
    ])

    // Test connection with the correct database
    const db = client.db(DB_NAME)
    await db.admin().ping()
    console.log("✅ Database connection successful to:", DB_NAME)
    return true
  } catch (error) {
    console.error("❌ Database not available:", error instanceof Error ? error.message : "Unknown error")
    return false
  }
}

export async function getCountries(): Promise<Country[]> {
  console.log("🔍 Fetching countries from database:", DB_NAME)

  const fallbackData = sampleCountries.map((country, index) => ({
    ...country,
    _id: `sample_${index}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  }))

  try {
    const dbAvailable = await isDatabaseAvailable()
    console.log("Database available:", dbAvailable)

    if (!dbAvailable) {
      console.log("Using fallback data")
      return fallbackData
    }

    const db = await getDatabase()
    const countries = await db.collection("countries").find({}).toArray()
    console.log(`Found ${countries.length} countries in database`)

    if (!countries || countries.length === 0) {
      console.log("No countries in database, using fallback")
      return fallbackData
    }

    const processedCountries = countries.map((country: any) => ({
      ...country,
      _id: country._id.toString(),
    }))

    return processedCountries
  } catch (error) {
    console.error("Error fetching countries, using fallback:", error)
    return fallbackData
  }
}

export async function getCountryByCode(code: string): Promise<Country | null> {
  try {
    console.log("🔍 Fetching country by code:", code, "from database:", DB_NAME)

    const sampleCountry = sampleCountries.find((c) => c.code === code.toUpperCase())
    const fallbackCountry = sampleCountry
      ? {
          ...sampleCountry,
          _id: `sample_${code}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      : null

    if (!(await isDatabaseAvailable())) {
      console.log("Database not available, using fallback for country:", code)
      return fallbackCountry
    }

    const db = await getDatabase()
    const country = await db.collection("countries").findOne({ code: code.toUpperCase() })

    if (!country) {
      console.log("Country not found in database, using fallback:", code)
      return fallbackCountry
    }

    console.log("✅ Found country in database:", country.name)
    return { ...country, _id: country._id.toString() }
  } catch (error) {
    console.error("Error fetching country:", error)
    const sampleCountry = sampleCountries.find((c) => c.code === code.toUpperCase())
    return sampleCountry
      ? {
          ...sampleCountry,
          _id: `sample_${code}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      : null
  }
}

export async function createCountry(country: Omit<Country, "_id">): Promise<Country> {
  try {
    console.log("🆕 Creating country:", country.name, "in database:", DB_NAME)

    if (!(await isDatabaseAvailable())) {
      throw new Error("Database not available. Please check your MongoDB connection.")
    }

    // Validate required fields
    if (!country.name || !country.code) {
      throw new Error("Missing required fields: name and code are required")
    }

    if (!country.visaCategories || country.visaCategories.length === 0) {
      throw new Error("At least one visa category is required")
    }

    const db = await getDatabase()

    // Check if country already exists
    const existingCountry = await db.collection("countries").findOne({
      code: country.code.toUpperCase(),
    })

    if (existingCountry) {
      throw new Error(`Country with code ${country.code} already exists`)
    }

    const countryData = {
      ...country,
      code: country.code.toUpperCase(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("countries").insertOne(countryData)
    console.log("✅ Country created successfully:", result.insertedId)

    return { ...countryData, _id: result.insertedId.toString() }
  } catch (error) {
    console.error("❌ Error creating country:", error)
    throw error
  }
}

export async function updateCountry(id: string, country: Partial<Country>): Promise<boolean> {
  try {
    console.log("📝 Updating country:", id, "in database:", DB_NAME)

    if (!(await isDatabaseAvailable())) {
      throw new Error("Database not available")
    }

    const db = await getDatabase()
    const { ObjectId } = require("mongodb")

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid country ID format")
    }

    const updateData = {
      ...country,
      updatedAt: new Date(),
    }

    if (country.code) {
      updateData.code = country.code.toUpperCase()
    }

    const result = await db.collection("countries").updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    console.log("Country update result:", result.modifiedCount)
    return result.modifiedCount > 0
  } catch (error) {
    console.error("❌ Error updating country:", error)
    throw error
  }
}

export async function deleteCountry(id: string): Promise<boolean> {
  try {
    console.log("🗑️ Deleting country:", id, "from database:", DB_NAME)

    if (!(await isDatabaseAvailable())) {
      throw new Error("Database not available")
    }

    const db = await getDatabase()
    const { ObjectId } = require("mongodb")

    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid country ID format")
    }

    const result = await db.collection("countries").deleteOne({ _id: new ObjectId(id) })

    console.log("Country delete result:", result.deletedCount)
    return result.deletedCount > 0
  } catch (error) {
    console.error("❌ Error deleting country:", error)
    throw error
  }
}

// Lead/Customer Management
export async function createLead(lead: Omit<LeadCapture, "_id">): Promise<LeadCapture> {
  try {
    console.log("🆕 Creating lead:", lead.name, "in database:", DB_NAME)

    if (!(await isDatabaseAvailable())) {
      console.log("⚠️ Database not available, creating temporary lead")
      return {
        ...lead,
        _id: `temp_${Date.now()}`,
        createdAt: new Date(),
      }
    }

    const db = await getDatabase()
    const leadData = {
      ...lead,
      createdAt: new Date(),
    }

    const result = await db.collection("leads").insertOne(leadData)
    console.log("✅ Lead created successfully:", result.insertedId)

    return { ...leadData, _id: result.insertedId.toString() }
  } catch (error) {
    console.error("❌ Error creating lead:", error)
    return {
      ...lead,
      _id: `temp_${Date.now()}`,
      createdAt: new Date(),
    }
  }
}

export async function getLeads(): Promise<LeadCapture[]> {
  try {
    console.log("🔍 Fetching leads from database:", DB_NAME)

    if (!(await isDatabaseAvailable())) {
      console.log("Database not available, returning empty array")
      return []
    }

    const db = await getDatabase()
    const leads = await db.collection("leads").find({}).sort({ createdAt: -1 }).toArray()

    console.log(`Found ${leads.length} leads in database`)

    return leads.map((lead: any) => ({
      ...lead,
      _id: lead._id.toString(),
    }))
  } catch (error) {
    console.error("❌ Error fetching leads:", error)
    return []
  }
}

export async function getCustomers(): Promise<LeadCapture[]> {
  return getLeads()
}

// Visa Applications
export async function createVisaApplication(application: Omit<VisaApplication, "_id">): Promise<VisaApplication> {
  try {
    console.log("🆕 Creating visa application for:", application.applicantName, "in database:", DB_NAME)

    if (!(await isDatabaseAvailable())) {
      console.log("⚠️ Database not available, creating temporary application")
      return {
        ...application,
        _id: `temp_${Date.now()}`,
        submittedAt: new Date(),
        status: "pending",
      }
    }

    const db = await getDatabase()
    const applicationData = {
      ...application,
      submittedAt: new Date(),
      status: "pending" as const,
    }

    const result = await db.collection("visa_applications").insertOne(applicationData)
    console.log("✅ Visa application created:", result.insertedId)

    return { ...applicationData, _id: result.insertedId.toString() }
  } catch (error) {
    console.error("❌ Error creating visa application:", error)
    return {
      ...application,
      _id: `temp_${Date.now()}`,
      submittedAt: new Date(),
      status: "pending",
    }
  }
}

export async function getVisaApplications(): Promise<VisaApplication[]> {
  try {
    console.log("🔍 Fetching visa applications from database:", DB_NAME)

    if (!(await isDatabaseAvailable())) {
      return []
    }

    const db = await getDatabase()
    const applications = await db.collection("visa_applications").find({}).sort({ submittedAt: -1 }).toArray()

    console.log(`Found ${applications.length} visa applications in database`)

    return applications.map((app: any) => ({
      ...app,
      _id: app._id.toString(),
    }))
  } catch (error) {
    console.error("Error fetching visa applications:", error)
    return []
  }
}

export async function updateVisaApplicationStatus(id: string, status: string, notes?: string): Promise<boolean> {
  try {
    console.log("📝 Updating visa application status:", id, "to:", status, "in database:", DB_NAME)

    if (!(await isDatabaseAvailable())) {
      console.log("Database not available, would update application:", { id, status, notes })
      return true
    }

    const db = await getDatabase()
    const { ObjectId } = require("mongodb")
    const result = await db.collection("visa_applications").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status,
          notes: notes || "",
          updatedAt: new Date(),
        },
      },
    )

    console.log("Application status update result:", result.modifiedCount)
    return result.modifiedCount > 0
  } catch (error) {
    console.error("Error updating visa application:", error)
    return false
  }
}

// Testimonials
export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    console.log("🔍 Fetching testimonials from database:", DB_NAME)

    if (!(await isDatabaseAvailable())) {
      return [
        {
          _id: "sample_1",
          name: "Priya Sharma",
          country: "USA Visa",
          rating: 5,
          comment:
            "JMT Travel made my US visa process incredibly smooth. Their team guided me through every step and I got my visa approved in just 20 days!",
          image: "/placeholder.svg?height=60&width=60",
          createdAt: new Date(),
        },
        {
          _id: "sample_2",
          name: "Rajesh Kumar",
          country: "Canada Visa",
          rating: 5,
          comment:
            "Excellent service! The documentation support was outstanding and the processing was faster than expected. Highly recommended for Canada visa.",
          image: "/placeholder.svg?height=60&width=60",
          createdAt: new Date(),
        },
      ]
    }

    const db = await getDatabase()
    const testimonials = await db.collection("testimonials").find({}).sort({ createdAt: -1 }).toArray()

    console.log(`Found ${testimonials.length} testimonials in database`)

    return testimonials.map((testimonial: any) => ({
      ...testimonial,
      _id: testimonial._id.toString(),
    }))
  } catch (error) {
    console.error("Error fetching testimonials:", error)
    return []
  }
}

export async function createTestimonial(testimonial: Omit<Testimonial, "_id">): Promise<Testimonial> {
  try {
    console.log("🆕 Creating testimonial for:", testimonial.name, "in database:", DB_NAME)

    if (!(await isDatabaseAvailable())) {
      throw new Error("Database not available")
    }

    const db = await getDatabase()
    const result = await db.collection("testimonials").insertOne({
      ...testimonial,
      createdAt: new Date(),
    })

    console.log("✅ Testimonial created successfully:", result.insertedId)

    return { ...testimonial, _id: result.insertedId.toString() }
  } catch (error) {
    console.error("Error creating testimonial:", error)
    throw error
  }
}

export async function updateTestimonial(id: string, testimonial: Partial<Testimonial>): Promise<boolean> {
  try {
    console.log("📝 Updating testimonial:", id, "in database:", DB_NAME)

    if (!(await isDatabaseAvailable())) {
      throw new Error("Database not available")
    }

    const db = await getDatabase()
    const { ObjectId } = require("mongodb")
    const result = await db
      .collection("testimonials")
      .updateOne({ _id: new ObjectId(id) }, { $set: { ...testimonial, updatedAt: new Date() } })

    console.log("Testimonial update result:", result.modifiedCount)
    return result.modifiedCount > 0
  } catch (error) {
    console.error("Error updating testimonial:", error)
    throw error
  }
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  try {
    console.log("🗑️ Deleting testimonial:", id, "from database:", DB_NAME)

    if (!(await isDatabaseAvailable())) {
      throw new Error("Database not available")
    }

    const db = await getDatabase()
    const { ObjectId } = require("mongodb")
    const result = await db.collection("testimonials").deleteOne({ _id: new ObjectId(id) })

    console.log("Testimonial delete result:", result.deletedCount)
    return result.deletedCount > 0
  } catch (error) {
    console.error("Error deleting testimonial:", error)
    throw error
  }
}

export default clientPromise
