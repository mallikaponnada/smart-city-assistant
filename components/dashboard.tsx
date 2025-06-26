"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from "recharts"
import { Droplets, Zap, Wind, Thermometer } from "lucide-react"

const kpiData = [
  { name: "Jan", water: 85, energy: 92, air: 78 },
  { name: "Feb", water: 88, energy: 89, air: 82 },
  { name: "Mar", water: 82, energy: 94, air: 85 },
  { name: "Apr", water: 90, energy: 87, air: 79 },
  { name: "May", water: 86, energy: 91, air: 88 },
  { name: "Jun", water: 89, energy: 85, air: 92 },
]

const currentKPIs = [
  { title: "Water Usage", value: "89%", change: "+2.1%", icon: Droplets, color: "text-blue-600" },
  { title: "Energy Consumption", value: "85%", change: "-1.5%", icon: Zap, color: "text-yellow-600" },
  { title: "Air Quality Index", value: "92", change: "+4.2%", icon: Wind, color: "text-green-600" },
  { title: "Temperature", value: "24°C", change: "+0.8°C", icon: Thermometer, color: "text-red-600" },
]

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">City Health Dashboard</h1>
        <p className="text-gray-600">Monitor key urban sustainability indicators</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentKPIs.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground">{kpi.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>KPI Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                water: { label: "Water Usage", color: "hsl(var(--chart-1))" },
                energy: { label: "Energy", color: "hsl(var(--chart-2))" },
                air: { label: "Air Quality", color: "hsl(var(--chart-3))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={kpiData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="water" stroke="var(--color-water)" strokeWidth={2} />
                  <Line type="monotone" dataKey="energy" stroke="var(--color-energy)" strokeWidth={2} />
                  <Line type="monotone" dataKey="air" stroke="var(--color-air)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: { label: "Value", color: "hsl(var(--chart-1))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={kpiData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="water" fill="var(--color-value)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
