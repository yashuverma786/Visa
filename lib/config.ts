export const config = {
  mongodb: {
    uri: process.env.MONGODB_URI,
    isAvailable: !!process.env.MONGODB_URI,
  },
  email: {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number.parseInt(process.env.SMTP_PORT || "587"),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    isAvailable: !!(process.env.SMTP_USER && process.env.SMTP_PASS),
  },
  app: {
    name: "JMT Travel",
    domain: process.env.NEXT_PUBLIC_DOMAIN || "https://visaa.in",
    supportEmail: "visa@journeymytrip.com",
  },
}

export function getBaseUrl() {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  if (process.env.NEXT_PUBLIC_DOMAIN) {
    return process.env.NEXT_PUBLIC_DOMAIN
  }
  return "http://localhost:3000"
}
