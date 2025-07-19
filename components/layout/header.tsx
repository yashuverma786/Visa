"use client"

import Link from "next/link"
import { useState } from "react"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto py-4 px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Travel App
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link href="/countries" className="text-gray-700 hover:text-blue-600 transition-colors">
              Countries
            </Link>
            <Link href="/blogs" className="text-gray-700 hover:text-blue-600 transition-colors">
              Blogs
            </Link>
            <Link href="/visa-assistance" className="text-gray-700 hover:text-blue-600 transition-colors">
              Visa Assistance
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">
              Contact
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button onClick={toggleMenu} className="md:hidden text-gray-700 hover:text-blue-600 focus:outline-none">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"} bg-gray-100`}>
        <div className="px-6 py-4">
          <Link href="/" className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">
            Home
          </Link>
          <Link href="/countries" className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">
            Countries
          </Link>
          <Link href="/blogs" className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">
            Blogs
          </Link>
          <Link href="/visa-assistance" className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">
            Visa Assistance
          </Link>
          <Link href="/about" className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">
            About
          </Link>
          <Link href="/contact" className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header
