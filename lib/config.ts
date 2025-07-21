export const config = {
  app: {
    name: "JMT Travel - Visa Services",
    description: "Professional visa assistance and travel services",
    url: process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000",
    version: "1.0.0",
  },
  database: {
    mongodb: {
      uri: process.env.MONGODB_URI || "mongodb://localhost:27017/visa-app",
      dbName: "visa-app",
    },
  },
  auth: {
    admin: {
      username: process.env.ADMIN_USERNAME || "admin",
      password: process.env.ADMIN_PASSWORD || "admin123",
    },
    session: {
      secret: process.env.SESSION_SECRET || "your-secret-key",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  },
  email: {
    smtp: {
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number.parseInt(process.env.SMTP_PORT || "587"),
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || "",
    },
    from: {
      name: "JMT Travel",
      email: process.env.SMTP_USER || "noreply@jmttravel.com",
    },
  },
  upload: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
    destination: "/tmp/uploads",
  },
  api: {
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    },
  },
}

export default config
