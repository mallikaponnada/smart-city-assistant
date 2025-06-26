"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from "recharts"
import { AlertTriangle, Upload, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface DataPoint {
  date: string
  value: number
  isAnomaly: boolean
}

export function AnomalyDetection() {
  const [data, setData] = useState<DataPoint[]>([])
  const [threshold, setThreshold] = useState(100)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [anomalies, setAnomalies] = useState<DataPoint[]>([])

  // Sample data for demonstration
  const sampleData = [
    { date: "2024-01-01", value: 85 },
    { date: "2024-01-02", value: 92 },
    { date: "2024-01-03", value: 88 },
    { date: "2024-01-04", value: 125 }, // Anomaly
    { date: "2024-01-05", value: 90 },
    { date: "2024-01-06", value: 87 },
    { date: "2024-01-07", value: 145 }, // Anomaly
    { date: "2024-01-08", value: 89 },
    { date: "2024-01-09", value: 91 },
    { date: "2024-01-10", value: 86 },
  ]

  const loadSampleData = () => {
    setIsAnalyzing(true)

    setTimeout(() => {
      const processedData = sampleData.map((point) => ({
        ...point,
        isAnomaly: point.value > threshold,
      }))

      setData(processedData)
      setAnomalies(processedData.filter((point) => point.isAnomaly))
      setIsAnalyzing(false)
    }, 1500)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.name.endsWith(".csv")) {
      // In a real app, you'd parse the CSV file here
      loadSampleData() // For demo, just load sample data
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Anomaly Detection</h1>
        <p className="text-gray-600">Identify unusual patterns in KPI data</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Data Input
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Threshold Value</label>
              <Input
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                placeholder="Enter threshold"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Upload CSV Data</label>
              <div className="mt-2">
                <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" id="csv-upload" />
                <label
                  htmlFor="csv-upload"
                  className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400"
                >
                  <div className="text-center">
                    <Upload className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">Upload CSV file</p>
                  </div>
                </label>
              </div>
            </div>

            <Button onClick={loadSampleData} className="w-full" disabled={isAnalyzing}>
              {isAnalyzing ? "Analyzing..." : "Use Sample Data"}
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Data Visualization
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.length > 0 ? (
              <ChartContainer
                config={{
                  value: { label: "Value", color: "hsl(var(--chart-1))" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ReferenceLine y={threshold} stroke="red" strokeDasharray="5 5" />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="var(--color-value)"
                      strokeWidth={2}
                      dot={(props) => {
                        const { cx, cy, payload } = props
                        return payload.isAnomaly ? (
                          <circle cx={cx} cy={cy} r={4} fill="red" />
                        ) : (
                          <circle cx={cx} cy={cy} r={2} fill="var(--color-value)" />
                        )
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Upload data or use sample data to detect anomalies</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {anomalies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Detected Anomalies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {anomalies.map((anomaly, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-red-800">Anomaly Detected</p>
                    <p className="text-sm text-red-600">Date: {anomaly.date}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="destructive">{anomaly.value}</Badge>
                    <p className="text-xs text-red-600 mt-1">Above threshold ({threshold})</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
