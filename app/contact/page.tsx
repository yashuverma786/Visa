import type { Metadata } from "next"
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import ContactFormWithUpload from "@/components/forms/contact-form-with-upload"

export const metadata: Metadata = {
  title: "Contact Us - JMT Travel | Visa & Immigration Services",
  description: "Get in touch with JMT Travel for all your visa and immigration needs. Located in Noida, Uttar Pradesh.",
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact JMT Travel</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Your trusted partner for visa and immigration services. We're here to help make your travel dreams come
              true.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Details */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
                <p className="text-lg text-gray-600 mb-8">
                  Ready to start your visa journey? Contact our expert team for personalized assistance with your visa
                  application.
                </p>
              </div>

              <div className="space-y-6">
                {/* Address */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <MapPin className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Office Address</h3>
                        <p className="text-gray-600">
                          <strong>JMT Travel</strong>
                          <br />
                          D-22 Ground and First Floor
                          <br />
                          Sector 3, Noida 201301
                          <br />
                          Uttar Pradesh, India
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Phone Numbers */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-green-100 p-3 rounded-lg">
                        <Phone className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone Numbers</h3>
                        <div className="space-y-2">
                          <p className="text-gray-600">
                            <a href="tel:+919312540202" className="hover:text-blue-600 transition-colors">
                              +91 9312540202
                            </a>
                          </p>
                          <p className="text-gray-600">
                            <a href="tel:+919599076202" className="hover:text-blue-600 transition-colors">
                              +91 9599076202
                            </a>
                          </p>
                          <p className="text-gray-600">
                            <a href="tel:+919717540883" className="hover:text-blue-600 transition-colors">
                              +91 9717540883
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Email */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-purple-100 p-3 rounded-lg">
                        <Mail className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Addresses</h3>
                        <div className="space-y-2">
                          <p className="text-gray-600">
                            <a href="mailto:travel@journeymytrip.com" className="hover:text-blue-600 transition-colors">
                              travel@journeymytrip.com
                            </a>
                          </p>
                          <p className="text-gray-600">
                            <a href="mailto:visa@journeymytrip.com" className="hover:text-blue-600 transition-colors">
                              visa@journeymytrip.com
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Business Hours */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-orange-100 p-3 rounded-lg">
                        <Clock className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Business Hours</h3>
                        <div className="space-y-1 text-gray-600">
                          <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                          <p>Saturday: 10:00 AM - 4:00 PM</p>
                          <p>Sunday: Closed</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Quick Actions</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild className="flex-1">
                    <a href="tel:+919312540202">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Now
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="flex-1">
                    <a href="mailto:visa@journeymytrip.com">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <ContactFormWithUpload />
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Find Us</h2>
            <p className="text-lg text-gray-600">
              Visit our office in Noida for in-person consultation and assistance.
            </p>
          </div>

          <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                Interactive map will be loaded here
                <br />
                D-22 Ground and First Floor, Sector 3, Noida 201301
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose JMT Travel?</h2>
            <p className="text-lg text-gray-600">
              We're committed to providing exceptional visa and immigration services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="h-6 w-6 text-blue-600 mr-2" />
                  Expert Consultation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our experienced team provides personalized guidance for your specific visa requirements.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-6 w-6 text-green-600 mr-2" />
                  Fast Processing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We ensure quick and efficient processing of your visa applications with regular updates.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="h-6 w-6 text-purple-600 mr-2" />
                  24/7 Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our support team is available round the clock to assist you with any queries or concerns.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
