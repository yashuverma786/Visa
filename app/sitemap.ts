import type { MetadataRoute } from "next"
import { getCountries } from "@/lib/database"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://visaa.in"

  // Get all countries for dynamic routes
  let countries = []
  try {
    countries = await getCountries()
  } catch (error) {
    console.error("Error fetching countries for sitemap:", error)
  }

  // Static routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/visa-types`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/countries`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/visa-assistance`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
  ]

  // Dynamic country routes using slug
  const countryRoutes = countries.map((country) => ({
    url: `${baseUrl}/countries/${
      country.slug ||
      country.name
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
    }`,
    lastModified: new Date(country.updatedAt || country.createdAt || new Date()),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  return [...staticRoutes, ...countryRoutes]
}
