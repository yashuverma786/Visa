import Link from "next/link"
import { Plane, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Plane className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">JMT Travel</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Your trusted partner for visa immigration services. We provide fast, reliable, and hassle-free visa
              processing for all your travel needs.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300">visa@journeymytrip.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300">+91 9876543210</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300">Mumbai, India</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/visa-types" className="text-gray-300 hover:text-white transition-colors">
                  Visa Types
                </Link>
              </li>
              <li>
                <Link href="/countries" className="text-gray-300 hover:text-white transition-colors">
                  Countries
                </Link>
              </li>
              <li>
                <Link href="/visa-assistance" className="text-gray-300 hover:text-white transition-colors">
                  Visa Assistance
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-300">Tourist Visa</span>
              </li>
              <li>
                <span className="text-gray-300">Business Visa</span>
              </li>
              <li>
                <span className="text-gray-300">Family Visit Visa</span>
              </li>
              <li>
                <span className="text-gray-300">Document Assistance</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-300">© {new Date().getFullYear()} JMT Travel. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
