"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, TrendingUp, TrendingDown, Users, Home, Calendar, Clock, Star, MapPin, Phone } from "lucide-react"

interface ReportsSectionProps {
  reservations: any[]
  cabins: any[]
}

export function ReportsSection({ reservations, cabins }: ReportsSectionProps) {
  // Cálculos estadísticos avanzados
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear

  // Reservas del mes actual y anterior
  const currentMonthReservations = reservations.filter((r) => {
    const date = new Date(r.checkIn)
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear
  })

  const lastMonthReservations = reservations.filter((r) => {
    const date = new Date(r.checkIn)
    return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear
  })

  // Estadísticas generales
  const totalReservations = reservations.length
  const confirmedReservations = reservations.filter((r) => r.status === "confirmada").length
  const pendingReservations = reservations.filter((r) => r.status === "pendiente").length
  const cancelledReservations = reservations.filter((r) => r.status === "cancelada").length

  // Crecimiento mensual
  const monthlyGrowth =
    lastMonthReservations.length > 0
      ? ((currentMonthReservations.length - lastMonthReservations.length) / lastMonthReservations.length) * 100
      : 0

  // Tasa de ocupación
  const totalPossibleNights = cabins.length * 30 // Asumiendo 30 días por mes
  const occupiedNights = reservations.reduce((acc, r) => {
    const checkIn = new Date(r.checkIn)
    const checkOut = new Date(r.checkOut)
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    return acc + nights
  }, 0)
  const occupancyRate = (occupiedNights / totalPossibleNights) * 100

  // Cabañas más populares
  const cabinPopularity = cabins
    .map((cabin) => {
      const cabinReservations = reservations.filter((r) => r.cabin === cabin.name)
      return {
        name: cabin.name,
        reservations: cabinReservations.length,
        occupancyRate: (cabinReservations.length / totalReservations) * 100,
      }
    })
    .sort((a, b) => b.reservations - a.reservations)

  // Análisis por estado
  const statusAnalysis = [
    {
      status: "Confirmadas",
      count: confirmedReservations,
      color: "bg-green-500",
      percentage: (confirmedReservations / totalReservations) * 100,
    },
    {
      status: "Pendientes",
      count: pendingReservations,
      color: "bg-yellow-500",
      percentage: (pendingReservations / totalReservations) * 100,
    },
    {
      status: "Canceladas",
      count: cancelledReservations,
      color: "bg-red-500",
      percentage: (cancelledReservations / totalReservations) * 100,
    },
  ]

  // Análisis temporal
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const monthReservations = reservations.filter((r) => {
      const date = new Date(r.checkIn)
      return date.getMonth() === i && date.getFullYear() === currentYear
    })
    return {
      month: new Date(currentYear, i, 1).toLocaleDateString("es-AR", { month: "short" }),
      reservations: monthReservations.length,
    }
  })

  // Huéspedes promedio por reserva
  const averageGuests = reservations.reduce((acc, r) => acc + r.guests, 0) / totalReservations

  // Duración promedio de estadía
  const averageStay =
    reservations.reduce((acc, r) => {
      const checkIn = new Date(r.checkIn)
      const checkOut = new Date(r.checkOut)
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
      return acc + nights
    }, 0) / totalReservations

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Informes y Estadísticas</h2>
        <p className="text-gray-600">Análisis detallado del rendimiento del complejo</p>
      </div>

      {/* KPIs principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservas Totales</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReservations}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {monthlyGrowth >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              {Math.abs(monthlyGrowth).toFixed(1)}% vs mes anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Ocupación</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{occupancyRate.toFixed(1)}%</div>
            <Progress value={occupancyRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Huéspedes Promedio</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageGuests.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Por reserva</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estadía Promedio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageStay.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Noches por reserva</p>
          </CardContent>
        </Card>
      </div>

      {/* Análisis por estado */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Distribución por Estado
          </CardTitle>
          <CardDescription>Análisis del estado de las reservas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {statusAnalysis.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <span className="font-medium">{item.status}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold">{item.count}</span>
                  <Badge variant="outline">{item.percentage.toFixed(1)}%</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cabañas más populares */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Cabañas Más Populares
          </CardTitle>
          <CardDescription>Ranking de cabañas por número de reservas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cabinPopularity.slice(0, 10).map((cabin, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{cabin.name}</div>
                    <div className="text-sm text-gray-600">{cabin.reservations} reservas</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{cabin.occupancyRate.toFixed(1)}%</div>
                  <Progress value={cabin.occupancyRate} className="w-20 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tendencias mensuales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Tendencias Mensuales {currentYear}
          </CardTitle>
          <CardDescription>Reservas por mes durante el año actual</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
            {monthlyData.map((month, index) => (
              <div key={index} className="text-center">
                <div className="text-xs font-medium text-gray-600 mb-1">{month.month}</div>
                <div className="bg-blue-100 rounded p-2">
                  <div className="text-lg font-bold text-blue-600">{month.reservations}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Métricas adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Resumen de Capacidad
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Total de Cabañas:</span>
              <span className="font-bold">{cabins.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Capacidad Total:</span>
              <span className="font-bold">{cabins.reduce((acc, c) => acc + c.capacity, 0)} huéspedes</span>
            </div>
            <div className="flex justify-between">
              <span>Capacidad Promedio:</span>
              <span className="font-bold">
                {(cabins.reduce((acc, c) => acc + c.capacity, 0) / cabins.length).toFixed(1)} huéspedes
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Métricas de Contacto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Reservas con Email:</span>
              <span className="font-bold">{reservations.filter((r) => r.email).length}</span>
            </div>
            <div className="flex justify-between">
              <span>Tasa de Email:</span>
              <span className="font-bold">
                {((reservations.filter((r) => r.email).length / totalReservations) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Reservas con Notas:</span>
              <span className="font-bold">{reservations.filter((r) => r.notes).length}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
