export const config = {
  app: {
    name: "JMT Travel - Visa Services",
    description: "Professional visa assistance and travel services",
    url: process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000",
    version: "1.0.0",
  },
  database: {
    mongodb: {
      uri: process.env.MONGODB_URI || "",
      dbName: "visa_app",
    },
  },
  email: {
    smtp: {
      host: process.env.SMTP_HOST || "",
      port: Number.parseInt(process.env.SMTP_PORT || "587"),
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || "",
    },
    from: {
      name: "JMT Travel",
      address: process.env.SMTP_USER || "noreply@jmttravel.com",
    },
  },
  admin: {
    username: process.env.ADMIN_USERNAME || "admin",
    password: process.env.ADMIN_PASSWORD || "admin123",
  },
  features: {
    enableRegistration: true,
    enableEmailNotifications: true,
    enableFileUploads: true,
    maxFileSize: 5 * 1024 * 1024, // 5MB
  },
}

export default config
