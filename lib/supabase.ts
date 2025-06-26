import { createClient, type SupabaseClient } from "@supabase/supabase-js"

// ⚠️  If the required env vars are missing we fall back to a no-op mock client
// so that the project can still boot in the preview / Storybook sandbox.
// Supply real values (NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY)
// in `.env.local` or in your Vercel dashboard for full functionality.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

function createMockClient(): SupabaseClient {
  /* A minimal, chainable stub with the handful of methods the demo calls.
     Each method logs a warning and returns an empty success response so
     app logic that expects arrays/objects continues to work. */
  const warn = (method: string) =>
    console.warn(`[supabase-mock] ${method} called – supply real env vars to enable Supabase.`)

  const mockResponse = { data: [], error: null }

  const builder: any = {
    // Query methods ─ all chain back to the same builder
    select: () => builder,
    order: () => builder,
    limit: () => builder,
    eq: () => builder,
    insert: () => {
      warn("insert()")
      return Promise.resolve(mockResponse)
    },
    update: () => ({
      eq: () => {
        warn("update().eq()")
        return Promise.resolve(mockResponse)
      },
    }),
    single: () => {
      warn("single()")
      return Promise.resolve({ ...mockResponse, data: {} })
    },
    /* make the builder await-able so `await supabase.from(...).select(...).order(...)`
       works just like in the real client. */
    then: (resolve: (value: typeof mockResponse) => unknown) => {
      warn("await query")
      return resolve(mockResponse)
    },
  }

  return {
    from: () => builder,
  } as unknown as SupabaseClient
}

// Use the real client when env vars are present, otherwise the mock
export const supabase: SupabaseClient =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : (() => {
        console.warn("[supabase] Environment variables missing – using mock client.")
        return createMockClient()
      })()

// Database types
export interface Feedback {
  id: string
  user_id: string
  name: string
  category: string
  message: string
  status: "new" | "in-progress" | "resolved"
  created_at: string
  updated_at: string
}

export interface KPIData {
  id: string
  date: string
  water_usage: number
  energy_consumption: number
  air_quality: number
  temperature: number
  created_at: string
}

export interface Report {
  id: string
  user_id: string
  city_name: string
  report_type: string
  content: string
  created_at: string
}
