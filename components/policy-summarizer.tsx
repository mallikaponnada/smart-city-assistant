"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Upload, Lightbulb } from "lucide-react"

export function PolicySummarizer() {
  const [policyText, setPolicyText] = useState("")
  const [summary, setSummary] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const summarizePolicy = () => {
    setIsLoading(true)

    // Simple summarization logic - extract key sentences
    setTimeout(() => {
      const sentences = policyText.split(/[.!?]+/).filter((s) => s.trim().length > 20)
      const keywords = [
        "sustainable",
        "environment",
        "energy",
        "water",
        "waste",
        "transport",
        "green",
        "carbon",
        "renewable",
      ]

      const keyPoints = sentences
        .filter((sentence) => keywords.some((keyword) => sentence.toLowerCase().includes(keyword)))
        .slice(0, 3)
        .map((sentence) => sentence.trim())
        .filter((sentence) => sentence.length > 0)

      const generatedSummary =
        keyPoints.length > 0
          ? `Key Policy Points:\n\n${keyPoints.map((point, index) => `${index + 1}. ${point}.`).join("\n\n")}`
          : "Summary: This policy document focuses on urban sustainability initiatives and environmental regulations."

      setSummary(generatedSummary)
      setIsLoading(false)
    }, 1500)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "text/plain") {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPolicyText(e.target?.result as string)
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Policy Summarizer</h1>
        <p className="text-gray-600">Upload and analyze policy documents</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Policy Document
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Upload Text File</label>
              <div className="mt-2">
                <input type="file" accept=".txt" onChange={handleFileUpload} className="hidden" id="file-upload" />
                <label
                  htmlFor="file-upload"
                  className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400"
                >
                  <div className="text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload .txt file</p>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Or Paste Text</label>
              <Textarea
                value={policyText}
                onChange={(e) => setPolicyText(e.target.value)}
                placeholder="Paste your policy document text here..."
                rows={8}
                className="mt-2"
              />
            </div>

            <Button onClick={summarizePolicy} disabled={!policyText.trim() || isLoading} className="w-full">
              {isLoading ? "Analyzing..." : "Summarize Policy"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Policy Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            {summary ? (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700">{summary}</pre>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Upload or paste a policy document to generate a summary</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
