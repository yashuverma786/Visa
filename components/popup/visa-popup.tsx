"use client"

import type React from "react"

import { useState, useEffect, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Plane, Globe, Star, ChevronRight, Check } from "lucide-react"
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
      <div className="relative max-w-md w-full mx-4 animate-zoom-in">
        <Card className="overflow-hidden border-2 border-blue-500 shadow-2xl">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full p-2 transition-colors hover:rotate-90 transition-transform duration-300"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Header with Animation */}
          <CardHeader className="gradient-blue-dark text-white relative overflow-hidden p-6">
            <div className="absolute inset-0">
              <svg
                className="absolute top-0 left-0 w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1440 320"
                preserveAspectRatio="none"
              >
                <path
                  fill="rgba(255,255,255,0.1)"
                  fillOpacity="1"
                  d="M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,197.3C672,224,768,224,864,197.3C960,171,1056,117,1152,117.3C1248,117,1344,171,1392,197.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                  className="animate-pulse-slow"
                ></path>
              </svg>

              <div className="absolute top-2 left-4 animate-float">
                <Plane className="h-8 w-8 text-white opacity-20" />
              </div>
              <div className="absolute bottom-2 right-4 animate-float-delayed">
                <Globe className="h-6 w-6 text-white opacity-20" />
              </div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse-slow">
                <Star className="h-4 w-4 text-yellow-300 opacity-70" />
              </div>
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-center mb-2">
                <div className="relative">
                  <Plane className="h-10 w-10 text-white animate-bounce-custom" />
                  <div className="absolute inset-0 bg-white rounded-full opacity-20 animate-pulse-slow"></div>
                </div>
              </div>
              <CardTitle className="text-xl font-bold text-center mb-2">🎯 Get Your Visa in 15 Days!</CardTitle>
              <p className="text-blue-100 text-center text-sm">Free consultation with visa experts</p>
            </div>
          </CardHeader>

          <CardContent className="p-6 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-blue-100 rounded-full opacity-20"></div>
            <div className="absolute -top-8 -left-8 w-24 h-24 bg-yellow-100 rounded-full opacity-20"></div>

            {/* Visa Images */}
            <div className="flex justify-center space-x-2 mb-4">
              <div className="relative w-12 h-8 rounded overflow-hidden animate-bounce hover-lift">
                <Image src="/placeholder.svg?height=32&width=48" alt="USA Flag" fill className="object-cover" />
              </div>
              <div className="relative w-12 h-8 rounded overflow-hidden animate-bounce delay-100 hover-lift">
                <Image src="/placeholder.svg?height=32&width=48" alt="UK Flag" fill className="object-cover" />
              </div>
              <div className="relative w-12 h-8 rounded overflow-hidden animate-bounce delay-200 hover-lift">
                <Image src="/placeholder.svg?height=32&width=48" alt="Canada Flag" fill className="object-cover" />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
              <div>
                <Input
                  placeholder="Your Full Name *"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                />
              </div>

              <div>
                <Input
                  type="email"
                  placeholder="Email Address *"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                />
              </div>

              <div>
                <Input
                  type="tel"
                  placeholder="Phone Number *"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                />
              </div>

              <div>
                <Input
                  placeholder="Which country do you want to visit? *"
                  value={formData.placeToVisit}
                  onChange={(e) => setFormData({ ...formData, placeToVisit: e.target.value })}
                  required
                  className="border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                />
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full gradient-black-shine text-white border-0 py-3 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group"
              >
                {isPending ? (
                  "Submitting..."
                ) : (
                  <span className="flex items-center justify-center">
                    🚀 Get Free Consultation
                    <ChevronRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-500">
                <div className="flex items-center">
                  <Check className="h-3 w-3 text-green-500 mr-1" />
                  <span>98% Success Rate</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-3 w-3 text-green-500 mr-1" />
                  <span>Fast Processing</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-3 w-3 text-green-500 mr-1" />
                  <span>100% Secure</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

