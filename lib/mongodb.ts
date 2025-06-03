import { MongoClient } from "mongodb"

let client: MongoClient | null = null
let clientPromise: Promise<MongoClient> | null = null

// Check if MongoDB URI is available
const uri = process.env.MONGODB_URI

if (uri && typeof window === "undefined") {
  // Only on server side
  const options = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    bufferMaxEntries: 0,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }

  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>
    }

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options)
      globalWithMongo._mongoClientPromise = client.connect().catch((err) => {
        console.error("MongoDB connection failed:", err)
        throw err
      })
    }
    clientPromise = globalWithMongo._mongoClientPromise
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options)
    clientPromise = client.connect().catch((err) => {
      console.error("MongoDB connection failed:", err)
      throw err
    })
  }
} else {
  console.warn("MongoDB URI not found in environment variables")
}

export default clientPromise
