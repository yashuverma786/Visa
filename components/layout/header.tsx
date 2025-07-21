"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Plane, Phone } from "lucide-react"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const handleGetStarted = () => {
    window.location.href = "tel:+919599076202"
  }

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Countries", href: "/countries" },
    { name: "Visa Types", href: "/visa-types" },
    { name: "Blogs", href: "/blogs" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
              <Plane className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Visaa.in</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Get Started Button */}
          <div className="hidden md:flex">
            <Button onClick={handleGetStarted} className="bg-blue-600 hover:bg-blue-700">
              <Phone className="h-4 w-4 mr-2" />
              Get Started
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-4 mt-8">
                <Link href="/" className="flex items-center space-x-2 mb-6">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
                    <Plane className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-900">Visaa.in</span>
                </Link>

                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-600 hover:text-blue-600 transition-colors font-medium py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

                <div className="pt-4 border-t">
                  <Button onClick={handleGetStarted} className="w-full bg-blue-600 hover:bg-blue-700">
                    <Phone className="h-4 w-4 mr-2" />
                    Get Started
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
