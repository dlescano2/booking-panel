"use client"

import { Home, Calendar, Users, Settings, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  return (
    <div className="w-64 bg-white shadow-lg border-r">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <Home className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="font-bold text-lg">Complejo Cabañas</h2>
            <p className="text-sm text-gray-500">Panel Admin</p>
          </div>
        </div>

        <nav className="space-y-2">
          <Button
            variant={activeSection === "dashboard" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => onSectionChange("dashboard")}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
          <Button
            variant={activeSection === "reservations" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => onSectionChange("reservations")}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Reservas
          </Button>
          <Button
            variant={activeSection === "cabins" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => onSectionChange("cabins")}
          >
            <Home className="w-4 h-4 mr-2" />
            Cabañas
          </Button>
          <Button
            variant={activeSection === "guests" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => onSectionChange("guests")}
          >
            <Users className="w-4 h-4 mr-2" />
            Huéspedes
          </Button>
          <Button
            variant={activeSection === "settings" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => onSectionChange("settings")}
          >
            <Settings className="w-4 h-4 mr-2" />
            Configuración
          </Button>
        </nav>
      </div>
    </div>
  )
}
