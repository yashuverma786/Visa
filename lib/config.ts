export const config = {
  app: {
    name: "JMT Travel - Visa Services",
    description: "Professional visa assistance and travel services",
    url: process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000",
  },
  database: {
    mongodb: {
      uri: process.env.MONGODB_URI || "mongodb://localhost:27017/visa-app",
    },
  },
  email: {
    smtp: {
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number.parseInt(process.env.SMTP_PORT || "587"),
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || "",
    },
  },
  admin: {
    username: process.env.ADMIN_USERNAME || "admin",
    password: process.env.ADMIN_PASSWORD || "admin123",
  },
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
  },
}

export default config
