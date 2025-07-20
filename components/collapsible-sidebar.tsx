"use client"

import { useState } from "react"
import {
  Home,
  Calendar,
  Users,
  Settings,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Bell,
  MapPin,
  Coffee,
  Phone,
  TrendingUp,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CollapsibleSidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
  reservations: any[]
  onQuickAction: (action: string, data?: any) => void
  onLogout: () => void
}

export function CollapsibleSidebar({
  activeSection,
  onSectionChange,
  reservations,
  onQuickAction,
  onLogout,
}: CollapsibleSidebarProps) {
  // Estado para controlar si el sidebar está expandido o contraído
  const [isExpanded, setIsExpanded] = useState(true)

  // Función para alternar el estado del sidebar
  const toggleSidebar = () => {
    setIsExpanded(!isExpanded)
  }

  // Configuración de los elementos del menú
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: BarChart3,
      description: "Vista general del sistema",
    },
    {
      id: "reservations",
      label: "Reservas",
      icon: Calendar,
      description: "Gestión de reservas",
    },
    {
      id: "cabins",
      label: "Cabañas",
      icon: Home,
      description: "Administrar cabañas",
    },
    {
      id: "guests",
      label: "Huéspedes",
      icon: Users,
      description: "Base de datos de huéspedes",
    },
    {
      id: "reports",
      label: "Informes",
      icon: TrendingUp,
      description: "Estadísticas y análisis",
    },
    {
      id: "settings",
      label: "Configuración",
      icon: Settings,
      description: "Configuración del sistema",
    },
  ]

  // Lógica para el resumen del día
  const today = new Date().toISOString().split("T")[0]
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]

  const todayCheckIns = reservations.filter((r) => r.checkIn === today && r.status === "confirmada")
  const todayCheckOuts = reservations.filter((r) => r.checkOut === today && r.status === "confirmada")
  const tomorrowCheckIns = reservations.filter((r) => r.checkIn === tomorrow && r.status === "confirmada")

  return (
    <div
      className={`bg-white shadow-lg border-r transition-all duration-300 ease-in-out ${isExpanded ? "w-64" : "w-16"}`}
    >
      {/* Header del sidebar con logo y botón de colapso */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          {/* Logo y título (solo visible cuando está expandido) */}
          {isExpanded && (
            <div className="flex items-center gap-2">
              <Home className="w-8 h-8 text-blue-600" />
              <div>
                <h2 className="font-bold text-lg">Complejo Cabañas</h2>
                <p className="text-sm text-gray-500">Panel Admin</p>
              </div>
            </div>
          )}

          {/* Logo pequeño cuando está contraído */}
          {!isExpanded && <Home className="w-8 h-8 text-blue-600 mx-auto" />}

          {/* Botón para colapsar/expandir */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="p-1 h-8 w-8"
            title={isExpanded ? "Contraer sidebar" : "Expandir sidebar"}
          >
            {isExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Navegación del menú */}
      <nav className="p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id

            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`w-full transition-all duration-200 ${isExpanded ? "justify-start" : "justify-center px-2"}`}
                onClick={() => onSectionChange(item.id)}
                title={!isExpanded ? item.description : undefined}
              >
                <Icon className="w-4 h-4" />
                {/* Texto del menú solo visible cuando está expandido */}
                {isExpanded && <span className="ml-2">{item.label}</span>}
              </Button>
            )
          })}
        </div>
      </nav>

      {/* Resumen del día - Solo visible cuando está expandido */}
      {isExpanded && (
        <div className="p-4 border-t">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Coffee className="w-4 h-4" />
                Resumen del Día
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Estadísticas rápidas */}
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-2 bg-green-50 rounded text-xs">
                  <div className="text-lg font-bold text-green-600">{todayCheckIns.length}</div>
                  <div className="text-green-700">Check-ins</div>
                </div>
                <div className="text-center p-2 bg-blue-50 rounded text-xs">
                  <div className="text-lg font-bold text-blue-600">{todayCheckOuts.length}</div>
                  <div className="text-blue-700">Check-outs</div>
                </div>
                <div className="text-center p-2 bg-orange-50 rounded text-xs">
                  <div className="text-lg font-bold text-orange-600">{tomorrowCheckIns.length}</div>
                  <div className="text-orange-700">Mañana</div>
                </div>
              </div>

              {/* Lista de check-ins de hoy */}
              {todayCheckIns.length > 0 && (
                <div>
                  <h4 className="text-xs font-medium mb-2 flex items-center gap-1">
                    <Bell className="w-3 h-3" />
                    Check-ins Hoy
                  </h4>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {todayCheckIns.slice(0, 3).map((reservation) => (
                      <div
                        key={reservation.id}
                        className="flex items-center justify-between p-1 bg-gray-50 rounded text-xs"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{reservation.guest}</div>
                          <div className="text-gray-600 flex items-center gap-1 truncate">
                            <MapPin className="w-2 h-2 flex-shrink-0" />
                            {reservation.cabin}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onQuickAction("call", reservation)}
                          className="text-xs h-6 w-6 p-0 flex-shrink-0 ml-1"
                          title="Llamar"
                        >
                          <Phone className="w-2 h-2" />
                        </Button>
                      </div>
                    ))}
                    {todayCheckIns.length > 3 && (
                      <div className="text-xs text-gray-500 text-center">+{todayCheckIns.length - 3} más</div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
      {/* Botón de logout - Siempre visible en la parte inferior */}
      <div className="p-4 border-t mt-auto">
        <Button
          variant="ghost"
          onClick={onLogout}
          className={`w-full transition-all duration-200 text-red-600 hover:text-red-700 hover:bg-red-50 ${
            isExpanded ? "justify-start" : "justify-center px-2"
          }`}
          title={!isExpanded ? "Cerrar sesión" : undefined}
        >
          <LogOut className="w-4 h-4" />
          {isExpanded && <span className="ml-2">Salir</span>}
        </Button>
      </div>
    </div>
  )
}
