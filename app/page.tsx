import HeroSection from "@/components/home/hero-section"
import FeaturesSection from "@/components/home/features-section"
import CountriesPreview from "@/components/home/countries-preview"
import TestimonialsSection from "@/components/home/testimonials-section"
import CTASection from "@/components/home/cta-section"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <CountriesPreview />
      <TestimonialsSection />
      <CTASection />
    </main>
  )
}
