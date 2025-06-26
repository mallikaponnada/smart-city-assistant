import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Detect whether a real OpenAI key is present
const hasOpenAIKey = Boolean(process.env.OPENAI_API_KEY)

export class AIService {
  static async summarizePolicy(policyText: string): Promise<string> {
    // Use live model only when the key is available
    if (hasOpenAIKey) {
      try {
        const { text } = await generateText({
          model: openai("gpt-4o"),
          system:
            "You are an expert policy analyst. Summarize the given policy document focusing on key sustainability initiatives, environmental regulations, and citizen impact. Provide 3-5 key points.",
          prompt: `Please summarize this policy document:\n\n${policyText}`,
        })
        return text
      } catch (error) {
        console.error("AI summarization failed:", error)
        // fall through to fallback
      }
    } else {
      console.warn("[ai-service] OPENAI_API_KEY missing – using fallback summarization.")
    }
    return AIService.fallbackSummarization(policyText)
  }

  static async generateEcoTips(topic: string): Promise<string[]> {
    if (hasOpenAIKey) {
      try {
        const { text } = await generateText({
          model: openai("gpt-4o"),
          system:
            "You are a sustainability expert. Generate 4 practical, actionable eco-friendly tips for the given topic. Each tip should be concise and implementable.",
          prompt: `Generate eco-friendly tips for: ${topic}`,
        })
        return text.split("\n").filter(Boolean).slice(0, 4)
      } catch (error) {
        console.error("AI tip generation failed:", error)
      }
    } else {
      console.warn("[ai-service] OPENAI_API_KEY missing – using fallback eco tips.")
    }
    return AIService.fallbackEcoTips(topic)
  }

  static async getChatResponse(message: string, context: string[]): Promise<string> {
    if (hasOpenAIKey) {
      try {
        const { text } = await generateText({
          model: openai("gpt-4o"),
          system:
            "You are a helpful Smart City Assistant focused on sustainability, urban planning, and environmental issues. Provide clear, accurate answers.",
          prompt: `Context:\n${context.join("\n")}\n\nUser: ${message}`,
        })
        return text
      } catch (error) {
        console.error("AI chat response failed:", error)
      }
    } else {
      console.warn("[ai-service] OPENAI_API_KEY missing – using fallback chat response.")
    }
    return AIService.fallbackChatResponse(message)
  }

  static async analyzeAnomalies(
    anomalies: string[],
    threshold: number,
  ): Promise<{ anomalies: string[]; insights: string }> {
    let insights = ""
    if (hasOpenAIKey) {
      try {
        const { text } = await generateText({
          model: openai("gpt-4o"),
          system:
            "You are a data analyst specialising in urban KPI analysis. Analyse anomalies and provide potential causes and recommendations.",
          prompt: `Anomalies: ${anomalies.join(", ")} (threshold: ${threshold}). Provide insights.`,
        })
        insights = text
      } catch (error) {
        console.error("AI anomaly analysis failed:", error)
      }
    } else {
      console.warn("[ai-service] OPENAI_API_KEY missing – using fallback anomaly insights.")
    }
    if (!insights) {
      insights = `Detected ${anomalies.length} anomalies above threshold ${threshold}. Possible causes include seasonal effects, equipment faults or special events. Investigate further.`
    }
    return { anomalies, insights }
  }

  private static fallbackSummarization(policyText: string): string {
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
      .map((sentence, index) => `${index + 1}. ${sentence.trim()}.`)

    return keyPoints.length > 0
      ? `Key Policy Points:\n\n${keyPoints.join("\n\n")}`
      : "Summary: This policy document focuses on urban sustainability initiatives and environmental regulations."
  }

  private static fallbackEcoTips(topic: string): string[] {
    const tipDatabase: Record<string, string[]> = {
      solar: [
        "Install solar panels on your roof to reduce electricity bills by up to 70%",
        "Use solar-powered outdoor lighting for your garden and pathways",
        "Consider solar water heaters to reduce energy consumption",
        "Join community solar programs if individual installation isn't feasible",
      ],
      plastic: [
        "Replace single-use plastic bags with reusable cloth or canvas bags",
        "Use a refillable water bottle instead of buying bottled water",
        "Choose products with minimal plastic packaging",
        "Participate in local plastic recycling programs",
      ],
      water: [
        "Install low-flow showerheads and faucets to reduce water usage",
        "Collect rainwater for watering plants and gardens",
        "Fix leaky pipes and faucets immediately to prevent waste",
        "Use drought-resistant plants in your landscaping",
      ],
      energy: [
        "Switch to LED light bulbs to reduce energy consumption by 75%",
        "Unplug electronics when not in use to eliminate phantom loads",
        "Use programmable thermostats to optimize heating and cooling",
        "Air-dry clothes instead of using the dryer when possible",
      ],
    }

    return (
      tipDatabase[topic.toLowerCase()] || [
        "Reduce, reuse, and recycle to minimize environmental impact",
        "Choose sustainable and locally-sourced products when possible",
        "Conserve energy by using efficient appliances and lighting",
        "Support businesses with strong environmental commitments",
      ]
    )
  }

  private static fallbackChatResponse(message: string): string {
    const messageLower = message.toLowerCase()

    // Comprehensive responses for common questions
    const responses: Record<string, string> = {
      "carbon footprint": `Reducing your carbon footprint involves several key strategies:

🏠 **Home & Energy:**
• Switch to renewable energy sources like solar panels
• Use LED lighting and energy-efficient appliances
• Improve home insulation to reduce heating/cooling needs
• Unplug devices when not in use

🚗 **Transportation:**
• Use public transport, bike, or walk when possible
• Consider electric or hybrid vehicles
• Work from home to reduce commuting
• Combine errands into single trips

♻️ **Consumption:**
• Buy local and seasonal products
• Reduce meat consumption
• Choose products with minimal packaging
• Repair items instead of replacing them

🌱 **Daily Habits:**
• Compost organic waste
• Use reusable bags and water bottles
• Plant trees or support reforestation projects
• Choose sustainable brands and services`,

      "smart city": `Smart city technologies transform urban living through:

📊 **Data & Analytics:**
• IoT sensors monitor air quality, traffic, and energy usage
• Real-time data helps optimize city services
• Predictive analytics prevent problems before they occur
• Citizen apps provide instant access to city information

🚦 **Infrastructure:**
• Smart traffic lights reduce congestion and emissions
• Intelligent street lighting saves energy and improves safety
• Smart grids optimize electricity distribution
• Connected public transport systems improve efficiency

🏢 **Services:**
• Digital government services reduce paperwork and wait times
• Smart waste management optimizes collection routes
• Emergency response systems use real-time data
• Public Wi-Fi and digital kiosks improve connectivity

🌍 **Sustainability:**
• Energy management systems reduce consumption
• Water monitoring prevents waste and detects leaks
• Environmental sensors track pollution levels
• Green building standards improve efficiency`,

      "renewable energy": `Renewable energy options for cities and individuals:

☀️ **Solar Power:**
• Rooftop solar panels for homes and businesses
• Community solar gardens for shared benefits
• Solar water heating systems
• Portable solar chargers for devices

💨 **Wind Energy:**
• Urban wind turbines for small-scale generation
• Offshore wind farms for large-scale power
• Micro-wind systems for residential use
• Wind-solar hybrid systems

💧 **Hydroelectric:**
• Small-scale hydro for local communities
• Pumped storage for energy backup
• Run-of-river systems with minimal environmental impact
• Micro-hydro for remote areas

🌱 **Other Options:**
• Geothermal heating and cooling systems
• Biomass from organic waste
• Tidal and wave energy in coastal areas
• Battery storage systems for energy independence

💰 **Benefits:**
• Reduced electricity bills and energy independence
• Lower carbon emissions and environmental impact
• Job creation in green energy sectors
• Energy security and price stability`,

      "air quality": `Cities can improve air quality through multiple approaches:

🚗 **Transportation:**
• Promote electric and hybrid vehicles
• Expand public transportation networks
• Create bike lanes and pedestrian zones
• Implement low-emission zones in city centers
• Encourage carpooling and ride-sharing

🏭 **Industrial Controls:**
• Enforce strict emission standards for factories
• Require pollution control equipment
• Monitor industrial emissions in real-time
• Incentivize clean production technologies

🌳 **Green Infrastructure:**
• Plant trees and create urban forests
• Develop green roofs and walls
• Establish parks and green corridors
• Use air-purifying plants in public spaces

📊 **Monitoring & Policy:**
• Install air quality monitoring networks
• Provide real-time air quality data to citizens
• Implement emergency protocols during high pollution
• Set and enforce air quality standards

🏠 **Individual Actions:**
• Use public transport or electric vehicles
• Support clean energy initiatives
• Plant trees and maintain gardens
• Avoid burning waste or using polluting equipment`,

      "sustainable urban planning": `Sustainable urban planning creates livable, resilient cities:

🏘️ **Mixed-Use Development:**
• Combine residential, commercial, and office spaces
• Reduce travel distances and car dependency
• Create vibrant, walkable neighborhoods
• Support local businesses and community interaction

🚶 **Transit-Oriented Design:**
• Build dense development around public transport
• Create pedestrian and bicycle-friendly infrastructure
• Reduce parking requirements in transit areas
• Connect neighborhoods with efficient transport

🌿 **Green Infrastructure:**
• Integrate parks and green spaces throughout the city
• Use green roofs and walls for insulation and air quality
• Create urban forests and tree-lined streets
• Implement sustainable stormwater management

♻️ **Resource Efficiency:**
• Design for waste reduction and recycling
• Use renewable energy in all new developments
• Implement water conservation and reuse systems
• Choose sustainable building materials

🏢 **Smart Growth Principles:**
• Focus development in existing urban areas
• Preserve natural areas and farmland
• Create compact, connected communities
• Plan for climate change adaptation and resilience`,
    }

    // Find the best matching response
    for (const [key, response] of Object.entries(responses)) {
      if (messageLower.includes(key.replace(/\s+/g, " "))) {
        return response
      }
    }

    // Check for specific question patterns
    if (messageLower.includes("how") && messageLower.includes("reduce")) {
      return responses["carbon footprint"]
    }

    if (messageLower.includes("what") && (messageLower.includes("smart") || messageLower.includes("technology"))) {
      return responses["smart city"]
    }

    if (messageLower.includes("energy") || messageLower.includes("power")) {
      return responses["renewable energy"]
    }

    if (messageLower.includes("air") || messageLower.includes("pollution")) {
      return responses["air quality"]
    }

    if (messageLower.includes("planning") || messageLower.includes("development")) {
      return responses["sustainable urban planning"]
    }

    // Default comprehensive response
    return `I'm your Smart City Assistant, here to help with sustainability and urban living questions! 

I can provide detailed information about:

🌱 **Environmental Topics:**
• Carbon footprint reduction strategies
• Renewable energy options and benefits
• Air quality improvement methods
• Water conservation techniques

🏙️ **Smart City Technologies:**
• IoT sensors and data analytics
• Smart infrastructure and services
• Digital government solutions
• Connected transportation systems

🏗️ **Urban Planning:**
• Sustainable development practices
• Green infrastructure design
• Transit-oriented communities
• Climate resilience planning

Feel free to ask specific questions about any of these topics, and I'll provide detailed, actionable information to help you understand and implement sustainable practices in your community!`
  }
}
