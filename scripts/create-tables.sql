-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in-progress', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create KPI data table
CREATE TABLE IF NOT EXISTS kpi_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  water_usage DECIMAL(5,2),
  energy_consumption DECIMAL(5,2),
  air_quality DECIMAL(5,2),
  temperature DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  city_name TEXT NOT NULL,
  report_type TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
CREATE INDEX IF NOT EXISTS idx_kpi_data_date ON kpi_data(date);
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id);

-- Insert sample KPI data
INSERT INTO kpi_data (date, water_usage, energy_consumption, air_quality, temperature) VALUES
('2024-01-01', 85.2, 92.1, 78.5, 24.2),
('2024-01-02', 88.1, 89.3, 82.1, 24.8),
('2024-01-03', 82.5, 94.2, 85.3, 23.9),
('2024-01-04', 90.3, 87.8, 79.2, 25.1),
('2024-01-05', 86.7, 91.5, 88.7, 24.5),
('2024-01-06', 89.2, 85.9, 92.1, 23.7)
ON CONFLICT DO NOTHING;
