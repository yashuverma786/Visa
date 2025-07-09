"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [emailTest, setEmailTest] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const runDebug = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/debug")
      const data = await response.json()
      setDebugInfo(data)
    } catch (error) {
      setDebugInfo({ error: "Failed to fetch debug info" })
    }
    setLoading(false)
  }

  const testEmail = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/test-email", { method: "POST" })
      const data = await response.json()
      setEmailTest(data)
    } catch (error) {
      setEmailTest({ error: "Failed to test email" })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Debug Information</h1>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Debug</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={runDebug} disabled={loading} className="mb-4">
                {loading ? "Running..." : "Run Debug Check"}
              </Button>

              {debugInfo && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Database Status</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Badge variant={debugInfo.database?.available ? "default" : "destructive"}>
                          {debugInfo.database?.available ? "Connected" : "Disconnected"}
                        </Badge>
                      </div>
                      <div>
                        <Badge variant={debugInfo.database?.configured ? "default" : "destructive"}>
                          {debugInfo.database?.configured ? "Configured" : "Not Configured"}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">URI: {debugInfo.database?.uri_preview || "Not set"}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Email Status</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Badge variant={debugInfo.email?.configured ? "default" : "destructive"}>
                          {debugInfo.email?.configured ? "Configured" : "Not Configured"}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm">Host: {debugInfo.email?.smtp_host}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Countries Data</h3>
                    <p>Total Countries: {debugInfo.countries?.count || 0}</p>
                    {debugInfo.countries?.sample && (
                      <div className="mt-2">
                        <h4 className="text-sm font-medium">Sample Countries:</h4>
                        {debugInfo.countries.sample.map((country: any, index: number) => (
                          <div key={index} className="text-sm text-gray-600">
                            {country.name} ({country.code}) - {country.categories} categories
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
                    {JSON.stringify(debugInfo, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Email Test</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={testEmail} disabled={loading} className="mb-4">
                {loading ? "Sending..." : "Send Test Email"}
              </Button>

              {emailTest && (
                <div>
                  <Badge variant={emailTest.success ? "default" : "destructive"}>
                    {emailTest.success ? "Success" : "Failed"}
                  </Badge>
                  <p className="text-sm mt-2">{emailTest.message || emailTest.error}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
