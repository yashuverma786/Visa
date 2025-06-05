import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Phone, Mail, MessageCircle } from "lucide-react"

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Visa Journey?</h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Get expert guidance and fast processing for your visa application. Our team is here to make your travel
            dreams come true.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Phone className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Call Us</h3>
            <p className="text-blue-100 mb-4">Speak directly with our visa experts</p>
            <a href="tel:+919312540202" className="font-semibold hover:text-blue-200 transition-colors">
              +91 9312540202
            </a>
          </div>

          <div className="text-center">
            <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Email Us</h3>
            <p className="text-blue-100 mb-4">Send us your queries anytime</p>
            <a href="mailto:visa@journeymytrip.com" className="font-semibold hover:text-blue-200 transition-colors">
              visa@journeymytrip.com
            </a>
          </div>

          <div className="text-center">
            <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Live Chat</h3>
            <p className="text-blue-100 mb-4">Get instant support online</p>
            <p className="font-semibold">Available 9 AM - 6 PM</p>
          </div>
        </div>

        <div className="text-center space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
            <Link href="/contact">Get Free Consultation</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="w-full sm:w-auto text-white border-white hover:bg-white hover:text-blue-600"
          >
            <Link href="/countries">Browse Countries</Link>
          </Button>
        </div>

        <div className="mt-12 text-center">
          <p className="text-blue-100 text-sm">
            Trusted by 5000+ customers • 98% success rate • Available in 50+ countries
          </p>
        </div>
      </div>
    </section>
  )
}
