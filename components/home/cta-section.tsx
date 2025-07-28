import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Phone, Mail, MessageCircle, ChevronRight } from "lucide-react"

export default function CTASection() {
  return (
    <section className="py-20 gradient-blue-dark text-white relative overflow-hidden">
      {/* Vector Background */}
      <div className="absolute inset-0">
        <svg
          className="absolute bottom-0 left-0 w-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="rgba(255,255,255,0.05)"
            fillOpacity="1"
            d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,224C672,213,768,171,864,149.3C960,128,1056,128,1152,149.3C1248,171,1344,213,1392,234.7L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>

        {/* Animated circles */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-500 rounded-full opacity-10 animate-pulse-slow"></div>
        <div
          className="absolute -bottom-32 -right-16 w-96 h-96 bg-blue-400 rounded-full opacity-10 animate-pulse-slow"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Visa Journey?</h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Get expert guidance and fast processing for your visa application. Our team is here to make your travel
            dreams come true.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center glass-effect rounded-xl p-6 hover-lift animate-fade-in-up stagger-1">
            <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Phone className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Call Us</h3>
            <p className="text-blue-100 mb-4">Speak directly with our visa experts</p>
            <a
              href="tel:9599076202"
              className="font-semibold hover:text-blue-200 transition-colors inline-flex items-center"
            >
              9599076202
              <ChevronRight className="ml-1 h-4 w-4" />
            </a>
          </div>

          <div className="text-center glass-effect rounded-xl p-6 hover-lift animate-fade-in-up stagger-2">
            <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Email Us</h3>
            <p className="text-blue-100 mb-4">Send us your queries anytime</p>
            <a
              href="mailto:visa@journeymytrip.com"
              className="font-semibold hover:text-blue-200 transition-colors inline-flex items-center"
            >
              info@visaa.in
              <ChevronRight className="ml-1 h-4 w-4" />
            </a>
          </div>

          <div className="text-center glass-effect rounded-xl p-6 hover-lift animate-fade-in-up stagger-3">
            <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Live Chat</h3>
            <p className="text-blue-100 mb-4">Get instant support online</p>
            <p className="font-semibold">Available 9 AM - 6 PM</p>
          </div>
        </div>

        <div className="text-center space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center animate-fade-in-up stagger-4">
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto gradient-black-shine text-white border-0 hover:shadow-xl transition-all duration-300 hover:scale-105 group"
          >
            <Link href="/contact" className="flex items-center">
              Get Free Consultation
              <ChevronRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="w-full sm:w-auto text-white border-white hover:bg-white hover:text-blue-600 transition-all duration-300 hover:scale-105 bg-transparent"
          >
            <Link href="/countries">Browse Countries</Link>
          </Button>
        </div>

        <div className="mt-12 text-center animate-fade-in-up stagger-5">
          <p className="text-blue-100 text-sm">
            Trusted by 5000+ customers • 98% success rate • Available in 50+ countries
          </p>
        </div>
      </div>
    </section>
  )
}
