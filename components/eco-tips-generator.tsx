"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, Leaf, Recycle, Zap } from "lucide-react"

const ecoTipsDatabase = {
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
  transport: [
    "Use public transportation, bike, or walk for short trips",
    "Carpool or use ride-sharing services to reduce emissions",
    "Consider electric or hybrid vehicles for your next car purchase",
    "Work from home when possible to reduce commuting",
  ],
  waste: [
    "Compost organic waste to create nutrient-rich soil",
    "Donate or sell items instead of throwing them away",
    "Buy products with recyclable or biodegradable packaging",
    "Repair items instead of replacing them when possible",
  ],
}

export function EcoTipsGenerator() {
  const [keyword, setKeyword] = useState("")
  const [tips, setTips] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const generateTips = () => {
    setIsLoading(true)

    setTimeout(() => {
      const searchKey = keyword.toLowerCase()
      let foundTips: string[] = []

      // Find matching tips
      for (const [category, categoryTips] of Object.entries(ecoTipsDatabase)) {
        if (category.includes(searchKey) || searchKey.includes(category)) {
          foundTips = categoryTips
          break
        }
      }

      // If no direct match, provide general tips
      if (foundTips.length === 0) {
        foundTips = [
          "Reduce, reuse, and recycle to minimize environmental impact",
          "Choose sustainable and locally-sourced products when possible",
          "Conserve energy by using efficient appliances and lighting",
          "Support businesses with strong environmental commitments",
        ]
      }

      setTips(foundTips)
      setIsLoading(false)
    }, 1000)
  }

  const getIconForTip = (index: number) => {
    const icons = [Leaf, Recycle, Zap, Lightbulb]
    const IconComponent = icons[index % icons.length]
    return <IconComponent className="h-5 w-5 text-green-600" />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Eco Tips Generator</h1>
        <p className="text-gray-600">Get personalized sustainability recommendations</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Generate Eco-Friendly Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Enter a topic (e.g., solar, plastic, water, energy)"
              className="flex-1"
            />
            <Button onClick={generateTips} disabled={!keyword.trim() || isLoading}>
              {isLoading ? "Generating..." : "Get Tips"}
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {Object.keys(ecoTipsDatabase).map((category) => (
              <Badge
                key={category}
                variant="outline"
                className="cursor-pointer hover:bg-green-50"
                onClick={() => setKeyword(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {tips.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Sustainability Tips for "{keyword}"</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {tips.map((tip, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                  {getIconForTip(index)}
                  <p className="text-sm text-gray-700">{tip}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
