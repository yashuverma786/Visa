import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import VisaPopup from "@/components/popup/visa-popup"
import ErrorBoundary from "@/components/error-boundary"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "JMT Travel - Visa Immigration Services | Fast & Reliable Visa Processing",
    template: "%s | JMT Travel",
  },
  description:
    "JMT Travel offers comprehensive visa immigration services for business, tourist, and family visit visas. Fast processing, expert guidance, and hassle-free visa applications for all countries.",
  keywords: [
    "visa services",
    "immigration",
    "visa application",
    "tourist visa",
    "business visa",
    "travel visa",
    "JMT Travel",
  ],
  authors: [{ name: "JMT Travel" }],
  creator: "JMT Travel",
  publisher: "JMT Travel",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://visaa.in"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://visaa.in",
    title: "JMT Travel - Visa Immigration Services",
    description:
      "Fast & reliable visa processing services for all countries. Expert guidance for business, tourist, and family visit visas.",
    siteName: "JMT Travel",
  },
  twitter: {
    card: "summary_large_image",
    title: "JMT Travel - Visa Immigration Services",
    description: "Fast & reliable visa processing services for all countries.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1e40af" />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <VisaPopup />
          </div>
        </ErrorBoundary>
      </body>
    </html>
  )
}
