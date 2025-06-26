"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileBarChart, Download, FileText } from "lucide-react"

interface ReportData {
  cityName: string
  reportType: string
  waterUsage: string
  energyConsumption: string
  airQuality: string
  additionalNotes: string
}

export function ReportGenerator() {
  const [reportData, setReportData] = useState<ReportData>({
    cityName: "",
    reportType: "",
    waterUsage: "",
    energyConsumption: "",
    airQuality: "",
    additionalNotes: "",
  })
  const [generatedReport, setGeneratedReport] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const generateReport = () => {
    setIsGenerating(true)

    setTimeout(() => {
      const report = `# ${reportData.reportType} Report - ${reportData.cityName}

## Executive Summary
This report provides a comprehensive analysis of sustainability metrics for ${reportData.cityName} as of ${new Date().toLocaleDateString()}.

## Key Performance Indicators

### Water Usage
- Current Level: ${reportData.waterUsage}%
- Status: ${Number(reportData.waterUsage) > 90 ? "High - Requires Attention" : Number(reportData.waterUsage) > 70 ? "Moderate - Monitor Closely" : "Good - Within Normal Range"}
- Recommendation: ${Number(reportData.waterUsage) > 90 ? "Implement water conservation measures immediately" : "Continue current water management practices"}

### Energy Consumption
- Current Level: ${reportData.energyConsumption}%
- Status: ${Number(reportData.energyConsumption) > 90 ? "High - Requires Attention" : Number(reportData.energyConsumption) > 70 ? "Moderate - Monitor Closely" : "Good - Within Normal Range"}
- Recommendation: ${Number(reportData.energyConsumption) > 90 ? "Increase renewable energy adoption and efficiency measures" : "Maintain current energy management strategies"}

### Air Quality Index
- Current Level: ${reportData.airQuality}
- Status: ${Number(reportData.airQuality) > 100 ? "Poor - Immediate Action Required" : Number(reportData.airQuality) > 50 ? "Moderate - Continue Monitoring" : "Good - Healthy Levels"}
- Recommendation: ${Number(reportData.airQuality) > 100 ? "Implement emission reduction strategies and increase green spaces" : "Maintain current air quality management practices"}

## Sustainability Initiatives

### Recommended Actions
1. **Short-term (1-3 months)**
   - Conduct energy audits for public buildings
   - Launch citizen awareness campaigns
   - Implement smart water meters

2. **Medium-term (3-12 months)**
   - Expand renewable energy infrastructure
   - Develop green transportation networks
   - Create urban green spaces

3. **Long-term (1-3 years)**
   - Achieve carbon neutrality goals
   - Implement circular economy principles
   - Develop smart city technologies

## Additional Notes
${reportData.additionalNotes || "No additional notes provided."}

## Conclusion
${reportData.cityName} shows ${
        (Number(reportData.waterUsage) + Number(reportData.energyConsumption)) / 2 > 85
          ? "areas for improvement in resource management"
          : "positive progress in sustainability metrics"
      }. Continued focus on sustainable practices and citizen engagement will be key to achieving long-term environmental goals.

---
*Report generated on ${new Date().toLocaleString()}*
*Smart City Assistant - Sustainability Analytics Platform*`

      setGeneratedReport(report)
      setIsGenerating(false)
    }, 2000)
  }

  const downloadReport = () => {
    const blob = new Blob([generatedReport], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${reportData.cityName}_sustainability_report.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Report Generator</h1>
        <p className="text-gray-600">Generate comprehensive sustainability reports</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileBarChart className="h-5 w-5" />
              Report Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">City Name</label>
              <Input
                value={reportData.cityName}
                onChange={(e) => setReportData({ ...reportData, cityName: e.target.value })}
                placeholder="Enter city name"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Report Type</label>
              <Select
                value={reportData.reportType}
                onValueChange={(value) => setReportData({ ...reportData, reportType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monthly Sustainability">Monthly Sustainability</SelectItem>
                  <SelectItem value="Quarterly Environmental">Quarterly Environmental</SelectItem>
                  <SelectItem value="Annual Sustainability">Annual Sustainability</SelectItem>
                  <SelectItem value="Emergency Assessment">Emergency Assessment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Water Usage (%)</label>
                <Input
                  type="number"
                  value={reportData.waterUsage}
                  onChange={(e) => setReportData({ ...reportData, waterUsage: e.target.value })}
                  placeholder="85"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Energy Consumption (%)</label>
                <Input
                  type="number"
                  value={reportData.energyConsumption}
                  onChange={(e) => setReportData({ ...reportData, energyConsumption: e.target.value })}
                  placeholder="92"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Air Quality Index</label>
              <Input
                type="number"
                value={reportData.airQuality}
                onChange={(e) => setReportData({ ...reportData, airQuality: e.target.value })}
                placeholder="78"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Additional Notes</label>
              <Textarea
                value={reportData.additionalNotes}
                onChange={(e) => setReportData({ ...reportData, additionalNotes: e.target.value })}
                placeholder="Add any specific observations or recommendations..."
                rows={3}
              />
            </div>

            <Button
              onClick={generateReport}
              disabled={!reportData.cityName || !reportData.reportType || isGenerating}
              className="w-full"
            >
              {isGenerating ? "Generating Report..." : "Generate Report"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Generated Report
              {generatedReport && (
                <Button onClick={downloadReport} size="sm" className="ml-auto">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {generatedReport ? (
              <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">{generatedReport}</pre>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Configure report parameters and generate your sustainability report</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
