"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Database, Mail, Server, CheckCircle, XCircle } from "lucide-react"

interface DebugInfo {
  timestamp: string
  environment: string
  version: string
  status: string
  database: {
    connected: boolean
    uri: string
  }
  email: {
    configured: boolean
    host: string
  }
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
      if (!response.ok) {
        throw new Error("Failed to fetch debug info")
      }
      const data = await response.json()
      setDebugInfo(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDebugInfo()
  }, [])

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
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{error}</p>
            <Button onClick={fetchDebugInfo} className="mt-4">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
              <Server className="h-4 w-4 ml-auto" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <Badge variant={debugInfo.status === "healthy" ? "default" : "destructive"}>{debugInfo.status}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Environment:</span>
                  <Badge variant="outline">{debugInfo.environment}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Version:</span>
                  <span className="font-mono">{debugInfo.version}</span>
                </div>
                <div className="flex justify-between">
                  <span>Timestamp:</span>
                  <span className="text-sm text-gray-500">{new Date(debugInfo.timestamp).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Database</CardTitle>
              <Database className="h-4 w-4 ml-auto" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Connection:</span>
                  {debugInfo.database.connected ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <div className="flex justify-between">
                  <span>URI:</span>
                  <Badge variant="outline">{debugInfo.database.uri}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Email Service</CardTitle>
              <Mail className="h-4 w-4 ml-auto" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Configured:</span>
                  {debugInfo.email.configured ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <div className="flex justify-between">
                  <span>Host:</span>
                  <Badge variant="outline">{debugInfo.email.host}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
