import { supabase, type Feedback, type KPIData, type Report } from "./supabase"

export class DatabaseService {
  // Feedback operations
  static async createFeedback(feedback: Omit<Feedback, "id" | "created_at" | "updated_at">) {
    const { data, error } = await supabase.from("feedback").insert([feedback]).select().single()

    if (error) throw error
    return data
  }

  static async getFeedback(userId?: string) {
    let query = supabase.from("feedback").select("*").order("created_at", { ascending: false })

    if (userId) {
      query = query.eq("user_id", userId)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  }

  static async updateFeedbackStatus(id: string, status: Feedback["status"]) {
    const { data, error } = await supabase
      .from("feedback")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // KPI operations
  static async saveKPIData(kpiData: Omit<KPIData, "id" | "created_at">) {
    const { data, error } = await supabase.from("kpi_data").insert([kpiData]).select().single()

    if (error) throw error
    return data
  }

  static async getKPIData(limit = 30) {
    const { data, error } = await supabase.from("kpi_data").select("*").order("date", { ascending: false }).limit(limit)

    if (error) throw error
    return data
  }

  // Report operations
  static async saveReport(report: Omit<Report, "id" | "created_at">) {
    const { data, error } = await supabase.from("reports").insert([report]).select().single()

    if (error) throw error
    return data
  }

  static async getReports(userId: string) {
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  }
}
