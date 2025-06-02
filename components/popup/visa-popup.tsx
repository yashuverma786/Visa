"use client"

import type React from "react"

import { useState, useEffect, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Plane, Globe, Star } from "lucide-react"
import Image from "next/image"

export default function VisaPopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    placeToVisit: "",
  })

  useEffect(() => {
    // Check if popup was already shown in this session
    const popupShown = sessionStorage.getItem("visaPopupShown")

    if (!popupShown) {
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 3000) // Show after 3 seconds

      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    sessionStorage.setItem("visaPopupShown", "true")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    startTransition(async () => {
      try {
        const response = await fetch("/api/popup-leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            source: "popup",
          }),
        })

        if (response.ok) {
          alert("Thank you! Our visa expert will contact you within 24 hours.")
          handleClose()
          setFormData({ name: "", email: "", phone: "", placeToVisit: "" })
        }
      } catch (error) {
        alert("Something went wrong. Please try again.")
      }
    })
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative max-w-md w-full mx-4 animate-slideUp">
        <Card className="overflow-hidden border-2 border-blue-500 shadow-2xl">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full p-2 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Header with Animation */}
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-2 left-4 animate-float">
                <Plane className="h-8 w-8" />
              </div>
              <div className="absolute bottom-2 right-4 animate-float-delayed">
                <Globe className="h-6 w-6" />
              </div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse">
                <Star className="h-4 w-4" />
              </div>
            </div>

            <div className="relative z-10">
              <CardTitle className="text-xl font-bold text-center mb-2">🎯 Get Your Visa in 15 Days!</CardTitle>
              <p className="text-blue-100 text-center text-sm">Free consultation with visa experts</p>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* Visa Images */}
            <div className="flex justify-center space-x-2 mb-4">
              <div className="relative w-12 h-8 rounded overflow-hidden animate-bounce">
                <Image src="/placeholder.svg?height=32&width=48" alt="USA Flag" fill className="object-cover" />
              </div>
              <div className="relative w-12 h-8 rounded overflow-hidden animate-bounce delay-100">
                <Image src="/placeholder.svg?height=32&width=48" alt="UK Flag" fill className="object-cover" />
              </div>
              <div className="relative w-12 h-8 rounded overflow-hidden animate-bounce delay-200">
                <Image src="/placeholder.svg?height=32&width=48" alt="Canada Flag" fill className="object-cover" />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  placeholder="Your Full Name *"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="border-blue-200 focus:border-blue-500"
                />
              </div>

              <div>
                <Input
                  type="email"
                  placeholder="Email Address *"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="border-blue-200 focus:border-blue-500"
                />
              </div>

              <div>
                <Input
                  type="tel"
                  placeholder="Phone Number *"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="border-blue-200 focus:border-blue-500"
                />
              </div>

              <div>
                <Input
                  placeholder="Which country do you want to visit? *"
                  value={formData.placeToVisit}
                  onChange={(e) => setFormData({ ...formData, placeToVisit: e.target.value })}
                  required
                  className="border-blue-200 focus:border-blue-500"
                />
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 animate-pulse"
              >
                {isPending ? "Submitting..." : "🚀 Get Free Consultation"}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">✅ 98% Success Rate • ⚡ Fast Processing • 🔒 100% Secure</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(50px) scale(0.9);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float 3s ease-in-out infinite;
          animation-delay: 1.5s;
        }
      `}</style>
    </div>
  )
}
