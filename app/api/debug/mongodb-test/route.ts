import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"

export async function GET() {
  try {
    console.log("🔍 Testing MongoDB connection with new URI...")

    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        {
          status: "error",
          message: "MONGODB_URI environment variable is not set",
          timestamp: new Date().toISOString(),
        },
        { status: 500 },
      )
    }

    // Parse the connection string to get components (without exposing password)
    const uri = process.env.MONGODB_URI
    const uriParts = new URL(uri)

    console.log("Connection details:", {
      host: uriParts.hostname,
      protocol: uriParts.protocol,
      username: uriParts.username || "not provided",
    })

    // Create a new client for this test
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    })

    console.log("Attempting to connect to MongoDB...")
    await client.connect()

    // Test the connection with a simple command
    const adminDb = client.db().admin()
    const result = await adminDb.ping()

    // Get server info
    const serverInfo = await adminDb.serverInfo()

    // List databases
    const dbList = await adminDb.listDatabases()

    // Test specific database access
    const visaaDb = client.db("visaadatabase")
    const collections = await visaaDb.listCollections().toArray()

    // Close the connection
    await client.close()

    return NextResponse.json({
      status: "success",
      message: "MongoDB connection successful",
      ping: result.ok === 1 ? "successful" : "failed",
      serverVersion: serverInfo.version,
      databases: dbList.databases.map((db) => ({
        name: db.name,
        sizeOnDisk: db.sizeOnDisk,
      })),
      visaaDatabaseCollections: collections.map((col) => col.name),
      connectionDetails: {
        host: uriParts.hostname,
        protocol: uriParts.protocol,
        pathname: uriParts.pathname,
        username: uriParts.username ? "provided" : "not provided",
        password: uriParts.password ? "provided" : "not provided",
      },
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    })
  } catch (error: any) {
    console.error("❌ MongoDB test connection failed:", error)

    // Determine error type for better diagnostics
    let errorType = "unknown"
    let suggestion = ""

    if (error.message.includes("Authentication failed")) {
      errorType = "authentication"
      suggestion = "Check your username and password in the connection string"
    } else if (error.message.includes("getaddrinfo") || error.message.includes("connect ETIMEDOUT")) {
      errorType = "network"
      suggestion = "Check your network connection, firewall settings, or IP access list in MongoDB Atlas"
    } else if (error.message.includes("failed to resolve")) {
      errorType = "dns"
      suggestion = "Check the hostname in your connection string"
    } else if (error.message.includes("Server selection timed out")) {
      errorType = "timeout"
      suggestion = "MongoDB server might be down or unreachable. Check your IP access list in MongoDB Atlas"
    }

    return NextResponse.json(
      {
        status: "error",
        message: error.message,
        errorType,
        suggestion,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
