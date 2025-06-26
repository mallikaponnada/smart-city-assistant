<<<<<<< HEAD
# smart-city-assistant
=======
# 🏙️ Smart City Assistant - Comprehensive Platform

A modular AI-powered Smart City Assistant with web dashboard, mobile app, and comprehensive integrations for urban sustainability management.

## 🚀 Features

### Web Dashboard
- **City Health Dashboard** - Real-time KPI monitoring with interactive charts
- **Citizen Feedback System** - Issue reporting with status tracking
- **AI Policy Summarizer** - Intelligent document analysis with OpenAI integration
- **Eco Tips Generator** - Personalized sustainability recommendations
- **Anomaly Detection** - Smart pattern recognition in city data
- **KPI Forecaster** - Predictive analytics with machine learning
- **AI Chat Assistant** - Natural language interaction with GPT-4
- **Report Generator** - Automated sustainability report creation

### Mobile App (React Native)
- Cross-platform iOS/Android compatibility
- Offline-capable dashboard viewing
- Mobile-optimized feedback submission
- Push notifications for city updates
- Biometric authentication support

### Integrations & AI Features
- **Supabase** - Real-time database and authentication
- **OpenAI GPT-4** - Advanced natural language processing
- **Vercel AI SDK** - Streamlined AI model integration
- **Real-time Analytics** - Live data processing and visualization

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Modern component library
- **Recharts** - Interactive data visualization

### Backend & Database
- **Supabase** - PostgreSQL database with real-time subscriptions
- **Vercel Functions** - Serverless API endpoints
- **AI SDK** - OpenAI and other AI model integrations

### Mobile
- **React Native** - Cross-platform mobile development
- **Expo** - Development and deployment platform
- **AsyncStorage** - Local data persistence

## 📱 Demo Accounts

The platform includes pre-configured demo accounts for testing:

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Admin** | admin@smartcity.gov | admin123 | Full system access, user management |
| **Citizen** | citizen@example.com | citizen123 | Feedback submission, personal dashboard |
| **Analyst** | analyst@smartcity.gov | analyst123 | Data analysis, reporting tools |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (for database)
- OpenAI API key (for AI features)

### Environment Setup

1. **Clone the repository**
\`\`\`bash
git clone <repository-url>
cd smart-city-assistant
\`\`\`

2. **Install dependencies**
\`\`\`bash
npm install
\`\`\`

3. **Environment Variables**
Create a `.env.local` file:
\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Optional: Other AI Providers
GROQ_API_KEY=your_groq_api_key
XAI_API_KEY=your_xai_api_key
\`\`\`

4. **Database Setup**
Run the SQL scripts to create tables:
\`\`\`bash
# Execute the SQL in your Supabase SQL editor
cat scripts/create-tables.sql
\`\`\`

5. **Start Development Server**
\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` and use any demo account to login.

### Mobile App Setup

1. **Navigate to mobile directory**
\`\`\`bash
cd mobile
\`\`\`

2. **Install Expo CLI**
\`\`\`bash
npm install -g @expo/cli
\`\`\`

3. **Install dependencies**
\`\`\`bash
npm install
\`\`\`

4. **Start Expo development server**
\`\`\`bash
npm start
\`\`\`

5. **Run on device**
- Install Expo Go app on your phone
- Scan QR code from terminal
- Or use iOS Simulator / Android Emulator

## 🏗️ Architecture

### Database Schema

\`\`\`sql
-- Core Tables
feedback (id, user_id, name, category, message, status, created_at, updated_at)
kpi_data (id, date, water_usage, energy_consumption, air_quality, temperature)
reports (id, user_id, city_name, report_type, content, created_at)

-- Indexes for Performance
idx_feedback_user_id, idx_feedback_status
idx_kpi_data_date, idx_reports_user_id
\`\`\`

### AI Service Architecture

\`\`\`typescript
// Centralized AI service with fallback mechanisms
AIService {
  summarizePolicy() // OpenAI GPT-4 with fallback
  generateEcoTips() // Context-aware recommendations
  getChatResponse() // Conversational AI with memory
  analyzeAnomalies() // Pattern recognition and insights
}
\`\`\`

### Authentication Flow

\`\`\`typescript
// Multi-role authentication system
AuthProvider {
  roles: ['admin', 'citizen', 'analyst']
  permissions: role-based access control
  persistence: localStorage + Supabase sessions
}
\`\`\`

## 🔧 Configuration

### Customizing AI Responses

Edit `lib/ai-service.ts` to modify AI behavior:

\`\`\`typescript
// Customize system prompts
const POLICY_SYSTEM_PROMPT = "You are an expert policy analyst..."
const CHAT_SYSTEM_PROMPT = "You are a helpful Smart City Assistant..."

// Adjust fallback responses
const fallbackResponses = {
  sustainability: "Custom fallback response...",
  // Add more fallback responses
}
\`\`\`

### Adding New KPI Metrics

1. **Update database schema**
\`\`\`sql
ALTER TABLE kpi_data ADD COLUMN new_metric DECIMAL(5,2);
\`\`\`

2. **Update TypeScript interfaces**
\`\`\`typescript
interface KPIData {
  // existing fields...
  new_metric: number
}
\`\`\`

3. **Add to dashboard visualization**
\`\`\`typescript
const kpiCards = [
  // existing cards...
  { title: "New Metric", value: data.new_metric, icon: NewIcon }
]
\`\`\`

### Customizing Mobile App

Edit `mobile/App.tsx` to modify:
- Color scheme and branding
- Available features for mobile users
- Offline data synchronization
- Push notification preferences

## 🔐 Security Features

- **Role-based Access Control** - Different permissions for admin/citizen/analyst
- **Input Validation** - All forms validated on client and server
- **SQL Injection Prevention** - Parameterized queries via Supabase
- **XSS Protection** - Content sanitization and CSP headers
- **Rate Limiting** - API endpoint protection
- **Secure Authentication** - JWT tokens with refresh mechanism

## 📊 Monitoring & Analytics

### Built-in Analytics
- User engagement tracking
- Feature usage statistics
- Performance monitoring
- Error logging and reporting

### Custom Metrics
\`\`\`typescript
// Add custom tracking
analytics.track('feature_used', {
  feature: 'eco_tips_generator',
  user_role: user.role,
  timestamp: new Date()
})
\`\`\`

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect to Vercel**
\`\`\`bash
npm install -g vercel
vercel login
vercel
\`\`\`

2. **Configure Environment Variables**
Add all environment variables in Vercel dashboard

3. **Deploy**
\`\`\`bash
vercel --prod
\`\`\`

### Mobile App Deployment

1. **Build for Production**
\`\`\`bash
cd mobile
expo build:android
expo build:ios
\`\`\`

2. **Submit to App Stores**
- Follow Expo's app store submission guide
- Configure app signing and certificates

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create feature branch**
\`\`\`bash
git checkout -b feature/new-feature
\`\`\`

3. **Make changes and test**
\`\`\`bash
npm run test
npm run lint
\`\`\`

4. **Submit pull request**

### Code Standards
- TypeScript strict mode enabled
- ESLint + Prettier for code formatting
- Comprehensive error handling
- Accessibility compliance (WCAG 2.1)

## 📚 API Documentation

### Core Endpoints

\`\`\`typescript
// Feedback Management
POST /api/feedback - Create new feedback
GET /api/feedback - List feedback (filtered by role)
PATCH /api/feedback/:id - Update feedback status

// KPI Data
GET /api/kpi - Retrieve KPI data
POST /api/kpi - Add new KPI data point

// AI Services
POST /api/ai/summarize - Policy summarization
POST /api/ai/chat - Chat responses
POST /api/ai/tips - Generate eco tips
\`\`\`

### WebSocket Events

\`\`\`typescript
// Real-time updates
'feedback:new' - New feedback submitted
'kpi:update' - KPI data updated
'system:alert' - System-wide notifications
\`\`\`

## 🐛 Troubleshooting

### Common Issues

**Database Connection Errors**
\`\`\`bash
# Check Supabase configuration
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
\`\`\`

**AI Service Failures**
\`\`\`bash
# Verify OpenAI API key
curl -H "Authorization: Bearer $OPENAI_API_KEY" \
  https://api.openai.com/v1/models
\`\`\`

**Mobile App Build Issues**
\`\`\`bash
# Clear Expo cache
expo r -c
# Reinstall dependencies
rm -rf node_modules && npm install
\`\`\`

### Performance Optimization

- **Database Indexing** - Ensure proper indexes on frequently queried columns
- **Image Optimization** - Use Next.js Image component for automatic optimization
- **Code Splitting** - Lazy load components to reduce initial bundle size
- **Caching Strategy** - Implement Redis for frequently accessed data

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- **Vercel** - Hosting and deployment platform
- **Supabase** - Database and authentication services
- **OpenAI** - AI model integration
- **shadcn/ui** - Component library
- **React Native Community** - Mobile development tools

---

**Built with ❤️ for sustainable smart cities**

For support, please open an issue or contact the development team.
\`\`\`

This completes the comprehensive Smart City Assistant platform with:

✅ **Full Authentication System** with role-based access and demo accounts  
✅ **Database Integration** with Supabase for real-time data persistence  
✅ **Enhanced AI Features** using OpenAI GPT-4 with intelligent fallbacks  
✅ **React Native Mobile App** with cross-platform compatibility  
✅ **Complete Documentation** with setup instructions and deployment guides  

The platform now includes enterprise-grade features like real-time data synchronization, advanced AI capabilities, mobile accessibility, and comprehensive security measures - making it a production-ready solution for smart city management.
>>>>>>> 8536589 (Initial commit)
