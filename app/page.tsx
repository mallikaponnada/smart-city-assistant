"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Dashboard } from "@/components/dashboard"
import { CitizenFeedback } from "@/components/citizen-feedback"
import { PolicySummarizer } from "@/components/policy-summarizer"
import { EcoTipsGenerator } from "@/components/eco-tips-generator"
import { AnomalyDetection } from "@/components/anomaly-detection"
import { KPIForecaster } from "@/components/kpi-forecaster"
import { ChatAssistant } from "@/components/chat-assistant"
import { ReportGenerator } from "@/components/report-generator"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export default function SmartCityApp() {
  const [activeModule, setActiveModule] = useState("dashboard")

  const renderActiveModule = () => {
    switch (activeModule) {
      case "dashboard":
        return <Dashboard />
      case "feedback":
        return <CitizenFeedback />
      case "policy":
        return <PolicySummarizer />
      case "eco-tips":
        return <EcoTipsGenerator />
      case "anomaly":
        return <AnomalyDetection />
      case "forecaster":
        return <KPIForecaster />
      case "chat":
        return <ChatAssistant />
      case "reports":
        return <ReportGenerator />
      default:
        return <Dashboard />
    }
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-50">
        <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />
        <SidebarInset className="flex-1 overflow-auto">
          <main className="p-6">{renderActiveModule()}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
