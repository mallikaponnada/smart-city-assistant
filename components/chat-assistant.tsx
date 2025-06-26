"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, User, Send, Sparkles } from "lucide-react"
import { AIService } from "@/lib/ai-service"
import { useAuth } from "@/components/auth/auth-provider"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
  isAI?: boolean
}

export function ChatAssistant() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: `Hello ${user?.name}! I'm your AI-powered Smart City Assistant. I can help you with questions about sustainability, energy efficiency, waste management, urban planning, and more. How can I assist you today?`,
      sender: "bot",
      timestamp: new Date(),
      isAI: true,
    },
  ])
  const [inputText, setInputText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [conversationContext, setConversationContext] = useState<string[]>([])

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async () => {
    if (!inputText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = inputText
    setInputText("")
    setIsTyping(true)

    // Update conversation context
    const newContext = [...conversationContext, currentInput].slice(-5) // Keep last 5 messages for context
    setConversationContext(newContext)

    try {
      // Use AI service for enhanced responses
      const botResponse = await AIService.getChatResponse(currentInput, newContext)

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
        isAI: true,
      }

      setMessages((prev) => [...prev, botMessage])
      setConversationContext([...newContext, botResponse])
    } catch (error) {
      console.error("Error getting AI response:", error)

      // Fallback response
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I'm having trouble connecting to my AI services right now. Please try again later, or ask me about basic sustainability topics that I can help with using my built-in knowledge.",
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, fallbackMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const quickQuestions = [
    "How can I reduce my carbon footprint?",
    "What are smart city technologies?",
    "Tell me about renewable energy options",
    "How can cities improve air quality?",
    "What is sustainable urban planning?",
  ]

  const handleQuickQuestion = (question: string) => {
    setInputText(question)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">AI Chat Assistant</h1>
        <p className="text-gray-600">Get intelligent answers about sustainability and smart city living</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3 h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-600" />
              Smart City AI Assistant
              <Sparkles className="h-4 w-4 text-yellow-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 ${message.sender === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`p-2 rounded-full ${
                        message.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {message.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                        {message.isAI && <Sparkles className="h-3 w-3 text-yellow-500 flex-shrink-0" />}
                      </div>
                      <p className={`text-xs ${message.sender === "user" ? "text-blue-100" : "text-gray-500"}`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-gray-200 text-gray-600">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                        <Sparkles className="h-3 w-3 text-yellow-500 animate-pulse" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="flex gap-2 mt-4">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about sustainability, smart cities, environment..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button onClick={sendMessage} disabled={!inputText.trim() || isTyping}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full text-left justify-start h-auto p-3 whitespace-normal"
                  onClick={() => handleQuickQuestion(question)}
                  disabled={isTyping}
                >
                  {question}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
