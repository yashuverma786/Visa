"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Plane, Globe, Clock, Shield, ChevronRight } from "lucide-react"

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
    <section className="relative gradient-hero text-white overflow-hidden">
      {/* Vector Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <svg
          className="absolute top-0 left-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="rgba(255,255,255,0.05)"
            fillOpacity="1"
            d="M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,197.3C672,224,768,224,864,197.3C960,171,1056,117,1152,117.3C1248,117,1344,171,1392,197.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            className="animate-pulse-slow"
          ></path>
        </svg>

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

        {/* Animated circles */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-500 rounded-full opacity-10 animate-pulse-slow"></div>
        <div
          className="absolute -bottom-32 -right-16 w-96 h-96 bg-blue-400 rounded-full opacity-10 animate-pulse-slow"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="space-y-8 animate-fade-in-left">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Your Visa Journey
                <span className="block gradient-text-gold">Starts Here</span>
              </h1>
              <p className="text-xl text-blue-100 max-w-lg">
                Fast, reliable, and hassle-free visa processing for all countries. Expert guidance every step of the
                way.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 glass-effect p-2 rounded-lg hover-lift">
                <Clock className="h-6 w-6 text-yellow-400" />
                <span className="text-sm">Quick Processing</span>
              </div>
              <div className="flex items-center space-x-3 glass-effect p-2 rounded-lg hover-lift">
                <Shield className="h-6 w-6 text-yellow-400" />
                <span className="text-sm">100% Secure</span>
              </div>
              <div className="flex items-center space-x-3 glass-effect p-2 rounded-lg hover-lift">
                <Globe className="h-6 w-6 text-yellow-400" />
                <span className="text-sm">All Countries</span>
              </div>
              <div className="flex items-center space-x-3 glass-effect p-2 rounded-lg hover-lift">
                <Plane className="h-6 w-6 text-yellow-400" />
                <span className="text-sm">Expert Support</span>
              </div>
            </div>
          </div>

          {/* Lead Capture Form */}
          <Card className="glass-effect border-white/20 animate-fade-in-right">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-6 text-center">Get Your Visa Quote</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:ring-2 focus:ring-white/50"
                  />
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:ring-2 focus:ring-white/50"
                  />
                </div>

                <Input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:ring-2 focus:ring-white/50"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    value={formData.visaType}
                    onValueChange={(value) => setFormData({ ...formData, visaType: value })}
                  >
                    <SelectTrigger className="bg-white/20 border-white/30 text-white focus:ring-2 focus:ring-white/50">
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
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:ring-2 focus:ring-white/50"
                  />
                </div>

                <Textarea
                  placeholder="Additional Message (Optional)"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:ring-2 focus:ring-white/50"
                  rows={3}
                />

                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full gradient-black-shine text-white border-0 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group"
                >
                  {isPending ? (
                    "Submitting..."
                  ) : (
                    <span className="flex items-center justify-center">
                      Get Free Quote
                      <ChevronRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
