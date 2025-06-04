import clientPromise from "./mongodb"
import type { Country, VisaApplication, Testimonial, LeadCapture } from "./types"
import { sampleCountries } from "./seed-data"
import type { MongoClient } from "mongodb"

const DB_NAME = "jmtvisa"

export async function getDatabase() {
  try {
    if (!clientPromise) {
      throw new Error("MongoDB connection not available")
    }
    const client = await clientPromise
    return client.db(DB_NAME)
  } catch (error) {
    console.error("Error getting database:", error)
    throw error
  }
}

// Check if database is available
export async function isDatabaseAvailable(): Promise<boolean> {
  try {
    if (!clientPromise) {
      console.log("No MongoDB client promise available")
      return false
    }
    if (typeof window !== "undefined") return false // Client side

    const client = (await Promise.race([
      clientPromise,
      new Promise((_, reject) => setTimeout(() => reject(new Error("Connection timeout")), 10000)),
    ])) as MongoClient

    await client.db(DB_NAME).admin().ping()
    console.log("✅ Database connection successful")
    return true
  } catch (error) {
    console.error("❌ Database not available:", error instanceof Error ? error.message : "Unknown error")
    return false
  }
}

// Countries
export async function getCountries(): Promise<Country[]> {
  console.log("🔍 Fetching countries...")

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

    const processedCountries = countries.map((country) => ({
      ...country,
      _id: country._id.toString(),
    }))

    return processedCountries
  } catch (error) {
    console.error("Error fetching countries, using fallback:", error)
    return fallbackData
  }
}

export async function createCountry(country: Omit<Country, "_id">): Promise<Country> {
  try {
    console.log("🆕 Creating country:", country.name)

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

    // Validate visa categories
    for (const category of country.visaCategories) {
      if (!category.name || !category.type || !category.price || !category.processingTime) {
        throw new Error("Each visa category must have name, type, price, and processing time")
      }
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
    console.log("📝 Updating country:", id)

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

// Lead Capture - Save to 'leads' collection
export async function createLead(lead: Omit<LeadCapture, "_id">): Promise<LeadCapture> {
  try {
    console.log("🆕 Creating lead:", lead.name)

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
    // Return lead with temp ID if database fails
    return {
      ...lead,
      _id: `temp_${Date.now()}`,
      createdAt: new Date(),
    }
  }
}

export async function getLeads(): Promise<LeadCapture[]> {
  try {
    console.log("🔍 Fetching leads...")

    if (!(await isDatabaseAvailable())) {
      console.log("Database not available, returning empty array")
      return []
    }

    const db = await getDatabase()
    const leads = await db.collection("leads").find({}).sort({ createdAt: -1 }).toArray()

    console.log(`Found ${leads.length} leads in database`)

    return leads.map((lead) => ({
      ...lead,
      _id: lead._id.toString(),
    }))
  } catch (error) {
    console.error("❌ Error fetching leads:", error)
    return []
  }
}

// Visa Applications
export async function createVisaApplication(application: Omit<VisaApplication, "_id">): Promise<VisaApplication> {
  try {
    console.log("🆕 Creating visa application for:", application.applicantName)

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
    if (!(await isDatabaseAvailable())) {
      return []
    }

    const db = await getDatabase()
    const applications = await db.collection("visa_applications").find({}).sort({ submittedAt: -1 }).toArray()
    return applications.map((app) => ({
      ...app,
      _id: app._id.toString(),
    }))
  } catch (error) {
    console.error("Error fetching visa applications:", error)
    return []
  }
}

// Testimonials
export async function getTestimonials(): Promise<Testimonial[]> {
  try {
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
    return testimonials.map((testimonial) => ({
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
    if (!(await isDatabaseAvailable())) {
      throw new Error("Database not available")
    }

    const db = await getDatabase()
    const result = await db.collection("testimonials").insertOne({
      ...testimonial,
      createdAt: new Date(),
    })
    return { ...testimonial, _id: result.insertedId.toString() }
  } catch (error) {
    console.error("Error creating testimonial:", error)
    throw error
  }
}

// Additional helper functions
export async function getCountryByCode(code: string): Promise<Country | null> {
  try {
    console.log("🔍 Fetching country by code:", code)

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

export async function deleteCountry(id: string): Promise<boolean> {
  try {
    console.log("🗑️ Deleting country:", id)

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

export async function updateVisaApplicationStatus(id: string, status: string, notes?: string): Promise<boolean> {
  try {
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
    return result.modifiedCount > 0
  } catch (error) {
    console.error("Error updating visa application:", error)
    return false
  }
}

export async function updateTestimonial(id: string, testimonial: Partial<Testimonial>): Promise<boolean> {
  try {
    if (!(await isDatabaseAvailable())) {
      throw new Error("Database not available")
    }

    const db = await getDatabase()
    const { ObjectId } = require("mongodb")
    const result = await db
      .collection("testimonials")
      .updateOne({ _id: new ObjectId(id) }, { $set: { ...testimonial, updatedAt: new Date() } })
    return result.modifiedCount > 0
  } catch (error) {
    console.error("Error updating testimonial:", error)
    throw error
  }
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  try {
    if (!(await isDatabaseAvailable())) {
      throw new Error("Database not available")
    }

    const db = await getDatabase()
    const { ObjectId } = require("mongodb")
    const result = await db.collection("testimonials").deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  } catch (error) {
    console.error("Error deleting testimonial:", error)
    throw error
  }
}
