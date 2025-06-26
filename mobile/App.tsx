"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
  StatusBar,
} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

interface User {
  id: string
  email: string
  name: string
  role: string
}

interface KPIData {
  title: string
  value: string
  change: string
  color: string
}

const DEMO_ACCOUNTS = [
  { email: "admin@smartcity.gov", password: "admin123", name: "Sarah Johnson", role: "admin" },
  { email: "citizen@example.com", password: "citizen123", name: "John Doe", role: "citizen" },
  { email: "analyst@smartcity.gov", password: "analyst123", name: "Dr. Maria Rodriguez", role: "analyst" },
]

const KPI_DATA: KPIData[] = [
  { title: "Water Usage", value: "89%", change: "+2.1%", color: "#3B82F6" },
  { title: "Energy Consumption", value: "85%", change: "-1.5%", color: "#EAB308" },
  { title: "Air Quality Index", value: "92", change: "+4.2%", color: "#10B981" },
  { title: "Temperature", value: "24°C", change: "+0.8°C", color: "#EF4444" },
]

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [feedbackText, setFeedbackText] = useState("")
  const [feedbackCategory, setFeedbackCategory] = useState("Water")

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const userData = await AsyncStorage.getItem("user")
      if (userData) {
        setUser(JSON.parse(userData))
      }
    } catch (error) {
      console.error("Error checking auth status:", error)
    }
  }

  const handleLogin = async () => {
    const account = DEMO_ACCOUNTS.find((acc) => acc.email === email && acc.password === password)

    if (account) {
      const userData = {
        id: Date.now().toString(),
        email: account.email,
        name: account.name,
        role: account.role,
      }
      setUser(userData)
      await AsyncStorage.setItem("user", JSON.stringify(userData))
      setEmail("")
      setPassword("")
    } else {
      Alert.alert("Login Failed", "Invalid email or password")
    }
  }

  const handleLogout = async () => {
    setUser(null)
    await AsyncStorage.removeItem("user")
  }

  const submitFeedback = () => {
    if (feedbackText.trim()) {
      Alert.alert("Success", "Feedback submitted successfully!")
      setFeedbackText("")
    } else {
      Alert.alert("Error", "Please enter your feedback")
    }
  }

  const fillDemoAccount = (account: (typeof DEMO_ACCOUNTS)[0]) => {
    setEmail(account.email)
    setPassword(account.password)
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F0FDF4" />
        <ScrollView contentContainerStyle={styles.loginContainer}>
          <View style={styles.header}>
            <Text style={styles.logo}>🌱</Text>
            <Text style={styles.title}>Smart City Assistant</Text>
            <Text style={styles.subtitle}>Mobile App</Text>
          </View>

          <View style={styles.loginForm}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
            />

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Sign In</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.demoAccounts}>
            <Text style={styles.demoTitle}>Demo Accounts</Text>
            {DEMO_ACCOUNTS.map((account, index) => (
              <TouchableOpacity key={index} style={styles.demoAccount} onPress={() => fillDemoAccount(account)}>
                <View>
                  <Text style={styles.demoName}>{account.name}</Text>
                  <Text style={styles.demoEmail}>{account.email}</Text>
                  <Text style={styles.demoRole}>{account.role}</Text>
                </View>
                <Text style={styles.demoButton}>Use</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0FDF4" />

      {/* Header */}
      <View style={styles.appHeader}>
        <View>
          <Text style={styles.welcomeText}>Welcome, {user.name}</Text>
          <Text style={styles.roleText}>{user.role}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "dashboard" && styles.activeTab]}
          onPress={() => setActiveTab("dashboard")}
        >
          <Text style={[styles.tabText, activeTab === "dashboard" && styles.activeTabText]}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "feedback" && styles.activeTab]}
          onPress={() => setActiveTab("feedback")}
        >
          <Text style={[styles.tabText, activeTab === "feedback" && styles.activeTabText]}>Feedback</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {activeTab === "dashboard" && (
          <View style={styles.dashboard}>
            <Text style={styles.sectionTitle}>City Health KPIs</Text>
            {KPI_DATA.map((kpi, index) => (
              <View key={index} style={styles.kpiCard}>
                <View style={styles.kpiHeader}>
                  <Text style={styles.kpiTitle}>{kpi.title}</Text>
                  <View style={[styles.kpiIndicator, { backgroundColor: kpi.color }]} />
                </View>
                <Text style={styles.kpiValue}>{kpi.value}</Text>
                <Text style={styles.kpiChange}>{kpi.change} from last month</Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === "feedback" && (
          <View style={styles.feedback}>
            <Text style={styles.sectionTitle}>Submit Feedback</Text>

            <Text style={styles.inputLabel}>Category</Text>
            <View style={styles.categoryContainer}>
              {["Water", "Waste", "Transport", "Energy"].map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[styles.categoryButton, feedbackCategory === category && styles.activeCategoryButton]}
                  onPress={() => setFeedbackCategory(category)}
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      feedbackCategory === category && styles.activeCategoryButtonText,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Your Feedback</Text>
            <TextInput
              style={styles.textArea}
              value={feedbackText}
              onChangeText={setFeedbackText}
              placeholder="Describe the issue or suggestion..."
              multiline
              numberOfLines={4}
            />

            <TouchableOpacity style={styles.submitButton} onPress={submitFeedback}>
              <Text style={styles.submitButtonText}>Submit Feedback</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0FDF4",
  },
  loginContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    fontSize: 48,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
  },
  loginForm: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "white",
  },
  loginButton: {
    backgroundColor: "#10B981",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  demoAccounts: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  demoTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
  },
  demoAccount: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    marginBottom: 8,
  },
  demoName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1F2937",
  },
  demoEmail: {
    fontSize: 14,
    color: "#6B7280",
  },
  demoRole: {
    fontSize: 12,
    color: "#10B981",
    textTransform: "uppercase",
    fontWeight: "500",
  },
  demoButton: {
    color: "#10B981",
    fontWeight: "500",
  },
  appHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  roleText: {
    fontSize: 14,
    color: "#6B7280",
    textTransform: "capitalize",
  },
  logoutButton: {
    padding: 8,
  },
  logoutText: {
    color: "#EF4444",
    fontWeight: "500",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tab: {
    flex: 1,
    padding: 16,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#10B981",
  },
  tabText: {
    fontSize: 16,
    color: "#6B7280",
  },
  activeTabText: {
    color: "#10B981",
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  dashboard: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
  },
  kpiCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  kpiHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  kpiTitle: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  kpiIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  kpiChange: {
    fontSize: 12,
    color: "#6B7280",
  },
  feedback: {
    gap: 16,
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "white",
  },
  activeCategoryButton: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  categoryButtonText: {
    fontSize: 14,
    color: "#6B7280",
  },
  activeCategoryButtonText: {
    color: "white",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "white",
    textAlignVertical: "top",
    minHeight: 100,
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: "#10B981",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
})
