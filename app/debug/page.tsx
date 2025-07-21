"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Database, Server, CheckCircle, XCircle } from "lucide-react"

interface DebugInfo {
  status: string
  timestamp: string
  database: string
  collections?: Record<string, number>
  environment: string
  error?: string
}

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

  const fetchDebugInfo = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/debug")
      const data = await response.json()
      setDebugInfo(data)
      setLastRefresh(new Date())
    } catch (error) {
      console.error("Error fetching debug info:", error)
      setDebugInfo({
        status: "error",
        timestamp: new Date().toISOString(),
        database: "disconnected",
        environment: "unknown",
        error: "Failed to fetch debug information",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDebugInfo()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ok":
        return "text-green-600"
      case "error":
        return "text-red-600"
      default:
        return "text-yellow-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ok":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <Server className="h-5 w-5 text-yellow-600" />
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Debug</h1>
          <p className="text-gray-600 mt-2">System status and diagnostic information</p>
        </div>
        <Button onClick={fetchDebugInfo} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {debugInfo && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* System Status */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
              {getStatusIcon(debugInfo.status)}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getStatusColor(debugInfo.status)}`}>
                {debugInfo.status.toUpperCase()}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Last checked: {new Date(debugInfo.timestamp).toLocaleString()}
              </p>
            </CardContent>
          </Card>

          {/* Database Status */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Database</CardTitle>
              <Database className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${getStatusColor(debugInfo.database === "connected" ? "ok" : "error")}`}
              >
                {debugInfo.database.toUpperCase()}
              </div>
              <p className="text-xs text-gray-500 mt-1">MongoDB Connection Status</p>
            </CardContent>
          </Card>

          {/* Environment */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Environment</CardTitle>
              <Server className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{debugInfo.environment.toUpperCase()}</div>
              <p className="text-xs text-gray-500 mt-1">Current Environment</p>
            </CardContent>
          </Card>

          {/* Collections */}
          {debugInfo.collections && (
            <Card className="md:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle>Database Collections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(debugInfo.collections).map(([name, count]) => (
                    <div key={name} className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{count}</div>
                      <div className="text-sm text-gray-600 capitalize">{name}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error Information */}
          {debugInfo.error && (
            <Card className="md:col-span-2 lg:col-span-3 border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600">Error Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-red-800 font-mono text-sm">{debugInfo.error}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Last Refresh */}
          {lastRefresh && (
            <Card className="md:col-span-2 lg:col-span-3">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Last Refresh</p>
                    <p className="text-lg font-semibold">{lastRefresh.toLocaleString()}</p>
                  </div>
                  <Badge variant="outline">Auto-refresh available</Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {loading && !debugInfo && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading debug information...</p>
          </div>
        </div>
      )}
    </div>
  )
}
