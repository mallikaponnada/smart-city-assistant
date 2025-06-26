"use client"

import {
  BarChart3,
  MessageSquare,
  FileText,
  Lightbulb,
  AlertTriangle,
  TrendingUp,
  Bot,
  FileBarChart,
  Leaf,
  LogOut,
  User,
  Settings,
} from "lucide-react"
import {
  Sidebar as SidebarPrimitive,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth/auth-provider"

interface SidebarProps {
  activeModule: string
  setActiveModule: (module: string) => void
}

const menuItems = [
  { id: "dashboard", label: "City Dashboard", icon: BarChart3 },
  { id: "feedback", label: "Citizen Feedback", icon: MessageSquare },
  { id: "policy", label: "Policy Summarizer", icon: FileText },
  { id: "eco-tips", label: "Eco Tips Generator", icon: Lightbulb },
  { id: "anomaly", label: "Anomaly Detection", icon: AlertTriangle },
  { id: "forecaster", label: "KPI Forecaster", icon: TrendingUp },
  { id: "chat", label: "AI Chat Assistant", icon: Bot },
  { id: "reports", label: "Report Generator", icon: FileBarChart },
]

export function Sidebar({ activeModule, setActiveModule }: SidebarProps) {
  const { user, logout } = useAuth()

  return (
    <SidebarPrimitive>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Leaf className="h-8 w-8 text-green-600" />
          <div>
            <h1 className="text-lg font-bold text-gray-900">Smart City</h1>
            <p className="text-sm text-gray-600">Assistant</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                onClick={() => setActiveModule(item.id)}
                isActive={activeModule === item.id}
                className="w-full justify-start"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="w-full justify-start">
              <Avatar className="h-6 w-6">
                <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">{user?.name}</span>
                <span className="text-xs text-gray-500 capitalize">{user?.role}</span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>
              <User className="h-4 w-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </SidebarPrimitive>
  )
}
