import { Suspense } from "react"
import HeroSection from "@/components/home/hero-section"
import FeaturesSection from "@/components/home/features-section"
import CountriesPreview from "@/components/home/countries-preview"
import TestimonialsSection from "@/components/home/testimonials-section"
import CTASection from "@/components/home/cta-section"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <Suspense fallback={<div className="py-20 text-center">Loading countries...</div>}>
        <CountriesPreview />
      </Suspense>
      <Suspense fallback={<div className="py-20 text-center">Loading testimonials...</div>}>
        <TestimonialsSection />
      </Suspense>
      <CTASection />
    </>
  )
}
