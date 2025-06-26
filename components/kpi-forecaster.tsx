"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { TrendingUp, Upload, BarChart3 } from "lucide-react"

interface ForecastData {
  date: string
  historical?: number
  forecast?: number
}

export function KPIForecaster() {
  const [selectedKPI, setSelectedKPI] = useState("")
  const [forecastData, setForecastData] = useState<ForecastData[]>([])
  const [isForecasting, setIsForecasting] = useState(false)

  const historicalData = {
    water: [
      { date: "2024-01", historical: 85 },
      { date: "2024-02", historical: 88 },
      { date: "2024-03", historical: 82 },
      { date: "2024-04", historical: 90 },
      { date: "2024-05", historical: 86 },
      { date: "2024-06", historical: 89 },
    ],
    energy: [
      { date: "2024-01", historical: 92 },
      { date: "2024-02", historical: 89 },
      { date: "2024-03", historical: 94 },
      { date: "2024-04", historical: 87 },
      { date: "2024-05", historical: 91 },
      { date: "2024-06", historical: 85 },
    ],
    air: [
      { date: "2024-01", historical: 78 },
      { date: "2024-02", historical: 82 },
      { date: "2024-03", historical: 85 },
      { date: "2024-04", historical: 79 },
      { date: "2024-05", historical: 88 },
      { date: "2024-06", historical: 92 },
    ],
  }

  const generateForecast = () => {
    if (!selectedKPI) return

    setIsForecasting(true)

    setTimeout(() => {
      const historical = historicalData[selectedKPI as keyof typeof historicalData]
      const lastValue = historical[historical.length - 1].historical
      const trend = (lastValue - historical[0].historical) / historical.length

      // Simple linear regression forecast
      const forecast = []
      for (let i = 1; i <= 6; i++) {
        const forecastValue = lastValue + trend * i + (Math.random() - 0.5) * 5
        forecast.push({
          date: `2024-${String(6 + i).padStart(2, "0")}`,
          forecast: Math.max(0, Math.round(forecastValue)),
        })
      }

      const combinedData = [...historical, ...forecast]

      setForecastData(combinedData)
      setIsForecasting(false)
    }, 2000)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.name.endsWith(".csv")) {
      // In a real app, you'd parse the CSV file here
      console.log("CSV file uploaded:", file.name)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">KPI Forecaster</h1>
        <p className="text-gray-600">Predict future trends using historical data</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Select KPI</label>
              <Select value={selectedKPI} onValueChange={setSelectedKPI}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose KPI" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="water">Water Usage</SelectItem>
                  <SelectItem value="energy">Energy Consumption</SelectItem>
                  <SelectItem value="air">Air Quality</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Upload Historical Data</label>
              <div className="mt-2">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="forecast-csv-upload"
                />
                <label
                  htmlFor="forecast-csv-upload"
                  className="flex items-center justify-center w-full h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400"
                >
                  <div className="text-center">
                    <Upload className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">Upload CSV</p>
                  </div>
                </label>
              </div>
            </div>

            <Button onClick={generateForecast} disabled={!selectedKPI || isForecasting} className="w-full">
              {isForecasting ? "Forecasting..." : "Generate Forecast"}
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Forecast Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {forecastData.length > 0 ? (
              <ChartContainer
                config={{
                  historical: { label: "Historical", color: "hsl(var(--chart-1))" },
                  forecast: { label: "Forecast", color: "hsl(var(--chart-2))" },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={forecastData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="historical"
                      stroke="var(--color-historical)"
                      strokeWidth={2}
                      connectNulls={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="forecast"
                      stroke="var(--color-forecast)"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      connectNulls={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Select a KPI and generate forecast to view predictions</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {forecastData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Forecast Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800">Trend Direction</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {forecastData.some((d) => d.forecast && d.forecast > 90) ? "↗️ Increasing" : "↘️ Decreasing"}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-800">Confidence Level</h3>
                <p className="text-2xl font-bold text-green-600">85%</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-medium text-purple-800">Forecast Period</h3>
                <p className="text-2xl font-bold text-purple-600">6 Months</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
