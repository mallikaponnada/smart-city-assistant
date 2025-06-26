"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, User, Calendar, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { DatabaseService } from "@/lib/database"
import { useToast } from "@/hooks/use-toast"
import type { Feedback } from "@/lib/supabase"

export function CitizenFeedback() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: user?.name || "",
    category: "",
    message: "",
  })

  useEffect(() => {
    loadFeedbacks()
  }, [user])

  const loadFeedbacks = async () => {
    try {
      const data = await DatabaseService.getFeedback(user?.role === "citizen" ? user.id : undefined)
      setFeedbacks(data || [])
    } catch (error) {
      console.error("Error loading feedbacks:", error)
      toast({
        title: "Error",
        description: "Failed to load feedback data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.category || !formData.message) return

    setIsSubmitting(true)
    try {
      await DatabaseService.createFeedback({
        user_id: user!.id,
        name: formData.name,
        category: formData.category,
        message: formData.message,
        status: "new",
      })

      toast({
        title: "Success",
        description: "Feedback submitted successfully!",
      })

      setFormData({ name: user?.name || "", category: "", message: "" })
      loadFeedbacks()
    } catch (error) {
      console.error("Error submitting feedback:", error)
      toast({
        title: "Error",
        description: "Failed to submit feedback",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateStatus = async (id: string, status: Feedback["status"]) => {
    try {
      await DatabaseService.updateFeedbackStatus(id, status)
      toast({
        title: "Success",
        description: "Feedback status updated!",
      })
      loadFeedbacks()
    } catch (error) {
      console.error("Error updating status:", error)
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new":
        return <AlertCircle className="h-4 w-4 text-blue-600" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Citizen Feedback</h1>
        <p className="text-gray-600">Report issues and track community concerns</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Submit Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your full name"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select issue category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Water">Water</SelectItem>
                    <SelectItem value="Waste">Waste Management</SelectItem>
                    <SelectItem value="Transport">Transportation</SelectItem>
                    <SelectItem value="Energy">Energy</SelectItem>
                    <SelectItem value="Roads">Roads & Infrastructure</SelectItem>
                    <SelectItem value="Environment">Environment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe the issue in detail..."
                  rows={4}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{user?.role === "citizen" ? "Your Feedback" : "All Feedback"}</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading feedback...</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {feedbacks.map((feedback) => (
                  <div key={feedback.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{feedback.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(feedback.status)}
                        <Badge className={getStatusColor(feedback.status)}>{feedback.status}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MessageSquare className="h-4 w-4" />
                      <span>{feedback.category}</span>
                      <Calendar className="h-4 w-4 ml-2" />
                      <span>{new Date(feedback.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-gray-700">{feedback.message}</p>

                    {user?.role === "admin" && feedback.status !== "resolved" && (
                      <div className="flex gap-2 mt-3">
                        {feedback.status === "new" && (
                          <Button size="sm" variant="outline" onClick={() => updateStatus(feedback.id, "in-progress")}>
                            Start Progress
                          </Button>
                        )}
                        <Button size="sm" onClick={() => updateStatus(feedback.id, "resolved")}>
                          Mark Resolved
                        </Button>
                      </div>
                    )}
                  </div>
                ))}

                {feedbacks.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No feedback submitted yet</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
