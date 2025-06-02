import clientPromise from "./mongodb"
import type { Country, VisaApplication, Testimonial, LeadCapture } from "./types"
import { sampleCountries } from "./seed-data"
import type { MongoClient } from "mongodb"

const DB_NAME = "visa_immigration"

export async function getDatabase() {
  if (!clientPromise) {
    throw new Error("MongoDB connection not available")
  }
  const client = await clientPromise
  return client.db(DB_NAME)
}

// Check if database is available
export async function isDatabaseAvailable(): Promise<boolean> {
  try {
    if (!clientPromise) return false
    if (typeof window !== "undefined") return false // Client side

    const client = (await Promise.race([
      clientPromise,
      new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 5000)),
    ])) as MongoClient

    await client.db(DB_NAME).admin().ping()
    return true
  } catch (error) {
    console.log("Database not available:", error.message)
    return false
  }
}

// Countries
export async function getCountries(): Promise<Country[]> {
  try {
    if (!(await isDatabaseAvailable())) {
      // Return sample data if database is not available
      return sampleCountries.map((country, index) => ({
        ...country,
        _id: `sample_${index}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    }

    const db = await getDatabase()
    const countries = await db.collection("countries").find({}).toArray()

    if (!countries || countries.length === 0) {
      // Return sample data if no countries in database
      return sampleCountries.map((country, index) => ({
        ...country,
        _id: `sample_${index}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    }

    return countries.map((country) => ({
      ...country,
      _id: country._id.toString(),
    }))
  } catch (error) {
    console.error("Error fetching countries:", error)
    // Always return sample data as fallback
    return sampleCountries.map((country, index) => ({
      ...country,
      _id: `sample_${index}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
  }
}

export async function getCountryByCode(code: string): Promise<Country | null> {
  try {
    if (!(await isDatabaseAvailable())) {
      // Return sample data if database is not available
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

    const db = await getDatabase()
    const country = await db.collection("countries").findOne({ code: code.toUpperCase() })

    if (!country) {
      // Fallback to sample data
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

    return { ...country, _id: country._id.toString() }
  } catch (error) {
    console.error("Error fetching country:", error)
    // Fallback to sample data
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
    if (!(await isDatabaseAvailable())) {
      throw new Error("Database not available")
    }

    const db = await getDatabase()
    const result = await db.collection("countries").insertOne({
      ...country,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    return { ...country, _id: result.insertedId.toString() }
  } catch (error) {
    console.error("Error creating country:", error)
    throw error
  }
}

export async function updateCountry(id: string, country: Partial<Country>): Promise<boolean> {
  try {
    if (!(await isDatabaseAvailable())) {
      throw new Error("Database not available")
    }

    const db = await getDatabase()
    const { ObjectId } = require("mongodb")
    const result = await db
      .collection("countries")
      .updateOne({ _id: new ObjectId(id) }, { $set: { ...country, updatedAt: new Date() } })
    return result.modifiedCount > 0
  } catch (error) {
    console.error("Error updating country:", error)
    throw error
  }
}

export async function deleteCountry(id: string): Promise<boolean> {
  try {
    if (!(await isDatabaseAvailable())) {
      throw new Error("Database not available")
    }

    const db = await getDatabase()
    const { ObjectId } = require("mongodb")
    const result = await db.collection("countries").deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  } catch (error) {
    console.error("Error deleting country:", error)
    throw error
  }
}

// Visa Applications
export async function createVisaApplication(application: Omit<VisaApplication, "_id">): Promise<VisaApplication> {
  try {
    if (!(await isDatabaseAvailable())) {
      // If database is not available, just return the application with a generated ID
      console.log("Database not available, application would be stored:", application)
      return {
        ...application,
        _id: `temp_${Date.now()}`,
        submittedAt: new Date(),
        status: "pending",
      }
    }

    const db = await getDatabase()
    const result = await db.collection("visa_applications").insertOne({
      ...application,
      submittedAt: new Date(),
      status: "pending",
    })
    return { ...application, _id: result.insertedId.toString(), submittedAt: new Date(), status: "pending" }
  } catch (error) {
    console.error("Error creating visa application:", error)
    // Return application with temp ID if database fails
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
      // Return sample testimonials if database is not available
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

// Lead Capture
export async function createLead(lead: Omit<LeadCapture, "_id">): Promise<LeadCapture> {
  try {
    if (!(await isDatabaseAvailable())) {
      // If database is not available, just log the lead and return with temp ID
      console.log("Database not available, lead would be stored:", lead)
      return {
        ...lead,
        _id: `temp_${Date.now()}`,
        createdAt: new Date(),
      }
    }

    const db = await getDatabase()
    const result = await db.collection("leads").insertOne({
      ...lead,
      createdAt: new Date(),
    })
    return { ...lead, _id: result.insertedId.toString() }
  } catch (error) {
    console.error("Error creating lead:", error)
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
    if (!(await isDatabaseAvailable())) {
      return []
    }

    const db = await getDatabase()
    const leads = await db.collection("leads").find({}).sort({ createdAt: -1 }).toArray()
    return leads.map((lead) => ({
      ...lead,
      _id: lead._id.toString(),
    }))
  } catch (error) {
    console.error("Error fetching leads:", error)
    return []
  }
}

// Update visa application status
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

// Update testimonial
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

// Delete testimonial
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
