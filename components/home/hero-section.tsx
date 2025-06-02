"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Plane, Globe, Clock, Shield } from "lucide-react"

export default function HeroSection() {
  const [isPending, startTransition] = useTransition()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    visaType: "",
    country: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    startTransition(async () => {
      try {
        const response = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })

        if (response.ok) {
          alert("Thank you! We will contact you soon.")
          setFormData({ name: "", email: "", phone: "", visaType: "", country: "", message: "" })
        }
      } catch (error) {
        alert("Something went wrong. Please try again.")
      }
    })
  }

  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 animate-float">
          <Plane className="h-12 w-12 text-blue-300 opacity-20" />
        </div>
        <div className="absolute top-40 right-20 animate-float-delayed">
          <Globe className="h-16 w-16 text-blue-300 opacity-20" />
        </div>
        <div className="absolute bottom-20 left-1/4 animate-float">
          <Clock className="h-10 w-10 text-blue-300 opacity-20" />
        </div>
        <div className="absolute bottom-40 right-1/3 animate-float-delayed">
          <Shield className="h-14 w-14 text-blue-300 opacity-20" />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Your Visa Journey
                <span className="block text-yellow-400">Starts Here</span>
              </h1>
              <p className="text-xl text-blue-100 max-w-lg">
                Fast, reliable, and hassle-free visa processing for all countries. Expert guidance every step of the
                way.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Clock className="h-6 w-6 text-yellow-400" />
                <span className="text-sm">Quick Processing</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6 text-yellow-400" />
                <span className="text-sm">100% Secure</span>
              </div>
              <div className="flex items-center space-x-3">
                <Globe className="h-6 w-6 text-yellow-400" />
                <span className="text-sm">All Countries</span>
              </div>
              <div className="flex items-center space-x-3">
                <Plane className="h-6 w-6 text-yellow-400" />
                <span className="text-sm">Expert Support</span>
              </div>
            </div>
          </div>

          {/* Lead Capture Form */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-6 text-center">Get Your Visa Quote</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                  />
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                  />
                </div>

                <Input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    value={formData.visaType}
                    onValueChange={(value) => setFormData({ ...formData, visaType: value })}
                  >
                    <SelectTrigger className="bg-white/20 border-white/30 text-white">
                      <SelectValue placeholder="Visa Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tourist">Tourist Visa</SelectItem>
                      <SelectItem value="business">Business Visa</SelectItem>
                      <SelectItem value="family">Family Visit Visa</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder="Destination Country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                  />
                </div>

                <Textarea
                  placeholder="Additional Message (Optional)"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                  rows={3}
                />

                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                >
                  {isPending ? "Submitting..." : "Get Free Quote"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float 6s ease-in-out infinite;
          animation-delay: 3s;
        }
      `}</style>
    </section>
  )
}
