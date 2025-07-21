"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Database, Mail, Cloud, Settings } from "lucide-react"

interface DebugInfo {
  timestamp: string
  environment: string
  domain: string
  mongodb: string
  smtp: {
    host: string
    user: string
    pass: string
  }
  blob: string
}

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDebugInfo = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/debug")
      if (response.ok) {
        const data = await response.json()
        setDebugInfo(data)
      } else {
        setError("Failed to fetch debug information")
      }
    } catch (err) {
      setError("Error fetching debug information")
      console.error("Debug fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDebugInfo()
  }, [])

  const getStatusBadge = (status: string) => {
    return status === "configured" ? (
      <Badge className="bg-green-100 text-green-800">Configured</Badge>
    ) : (
      <Badge variant="destructive">Not Configured</Badge>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          Loading debug information...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <p>{error}</p>
              <Button onClick={fetchDebugInfo} className="mt-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">System Debug Information</h1>
        <Button onClick={fetchDebugInfo} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {debugInfo && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Environment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Environment:</span>
                <Badge variant={debugInfo.environment === "production" ? "default" : "secondary"}>
                  {debugInfo.environment}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Domain:</span>
                <span className="text-sm text-gray-600">{debugInfo.domain}</span>
              </div>
              <div className="flex justify-between">
                <span>Timestamp:</span>
                <span className="text-sm text-gray-600">{new Date(debugInfo.timestamp).toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Database
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <span>MongoDB:</span>
                {getStatusBadge(debugInfo.mongodb)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Email Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>SMTP Host:</span>
                {getStatusBadge(debugInfo.smtp.host)}
              </div>
              <div className="flex justify-between">
                <span>SMTP User:</span>
                {getStatusBadge(debugInfo.smtp.user)}
              </div>
              <div className="flex justify-between">
                <span>SMTP Password:</span>
                {getStatusBadge(debugInfo.smtp.pass)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Cloud className="h-5 w-5 mr-2" />
                Storage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <span>Blob Storage:</span>
                {getStatusBadge(debugInfo.blob)}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
