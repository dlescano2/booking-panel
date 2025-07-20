"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { DateNavigation } from "@/components/date-navigation"
import { QuickDateFilters } from "@/components/quick-date-filters"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ZoomIn, ZoomOut, Move, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react"

interface Reservation {
  id: number
  cabin: string
  guest: string
  checkIn: string
  checkOut: string
  status: string
  guests: number
  phone: string
  email?: string
  notes?: string
}

interface Cabin {
  id: number
  name: string
  capacity: number
  amenities: string[]
}

interface GanttChartProps {
  reservations: Reservation[]
  cabins: Cabin[]
  onReservationClick?: (reservation: Reservation) => void
}

export function GanttChart({ reservations, cabins, onReservationClick }: GanttChartProps) {
  // Estado para la fecha actual del cronograma
  const [currentDate, setCurrentDate] = useState(new Date())

  // Estados para zoom y visualización
  const [zoomLevel, setZoomLevel] = useState(1) // 1x, 2x, 3x
  const [containerWidth, setContainerWidth] = useState(1000)
  const [isMobile, setIsMobile] = useState(false)

  // Referencias para el scroll horizontal
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Configuración de zoom adaptativa para móvil
  const zoomConfigs = {
    1: {
      minColumnWidth: isMobile ? 40 : 60,
      label: "1x - Vista amplia",
    },
    2: {
      minColumnWidth: isMobile ? 60 : 90,
      label: "2x - Vista normal",
    },
    3: {
      minColumnWidth: isMobile ? 80 : 120,
      label: "3x - Vista detallada",
    },
  }

  // Calcular número de días basado en el ancho de pantalla y zoom
  const calculateVisibleDays = () => {
    const config = zoomConfigs[zoomLevel as keyof typeof zoomConfigs]
    const cabinColumnWidth = isMobile ? 120 : 200
    const availableWidth = containerWidth - cabinColumnWidth
    const maxDays = Math.floor(availableWidth / config.minColumnWidth)

    // En móvil, mostrar menos días por defecto
    const minDays = isMobile ? 3 : 7
    const maxAllowedDays = isMobile ? 14 : 30

    return Math.max(minDays, Math.min(maxDays, maxAllowedDays))
  }

  const visibleDays = calculateVisibleDays()

  // Efecto para detectar cambios en el tamaño de la ventana y móvil
  useEffect(() => {
    const handleResize = () => {
      if (scrollContainerRef.current) {
        setContainerWidth(scrollContainerRef.current.offsetWidth)
      }
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  /**
   * Genera un array de fechas consecutivas a partir de una fecha inicial
   */
  const generateDates = (startDate: Date, days: number) => {
    const dates = []
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  const dates = generateDates(currentDate, visibleDays)

  /**
   * Formatea una fecha para mostrar en el cronograma
   */
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
    })
  }

  /**
   * Obtiene el nombre corto del día de la semana
   */
  const formatDayName = (date: Date) => {
    return date.toLocaleDateString("es-AR", {
      weekday: isMobile ? "narrow" : "short",
    })
  }

  /**
   * Determina el color de la barra según el estado de la reserva
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmada":
        return "bg-green-500 hover:bg-green-600"
      case "pendiente":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "cancelada":
        return "bg-red-500 hover:bg-red-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  /**
   * Calcula la posición y ancho de una barra de reserva en el cronograma
   */
  const getReservationBar = (reservation: Reservation, startDate: Date) => {
    // Crear fechas normalizadas sin problemas de zona horaria
    const checkInDate = new Date(reservation.checkIn + "T00:00:00")
    const checkOutDate = new Date(reservation.checkOut + "T00:00:00")
    const currentStartDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())

    // Calcular la diferencia en días desde la fecha de inicio del cronograma
    const msPerDay = 24 * 60 * 60 * 1000
    const startOffset = Math.floor((checkInDate.getTime() - currentStartDate.getTime()) / msPerDay)
    const endOffset = Math.floor((checkOutDate.getTime() - currentStartDate.getTime()) / msPerDay)

    // Si la reserva no está en el rango visible, no mostrarla
    if (startOffset >= visibleDays || endOffset <= 0) return null

    // Calcular posición y ancho
    const left = Math.max(0, startOffset)
    const right = Math.min(visibleDays, endOffset)
    const width = right - left

    // Validar que tenga al menos 1 día de ancho
    if (width <= 0) return null

    // Ajustar posición visual: check-in 1/2 adelante, check-out 1/3 adelante
    const visualLeft = left + 1 / 2
    const visualWidth = width - 1 / 2 + 1 / 3 // = width - 1/6

    return { left: visualLeft, width: visualWidth }
  }

  /**
   * Obtiene todas las reservas para una cabaña específica
   */
  const getCabinReservations = (cabinName: string) => {
    return reservations.filter((r) => r.cabin === cabinName)
  }

  /**
   * Detecta si una reserva tiene conflictos con otras reservas de la misma cabaña
   */
  const hasConflict = (reservation: Reservation, cabinReservations: Reservation[]) => {
    return cabinReservations.some((other) => {
      if (other.id === reservation.id) return false

      const start1 = new Date(reservation.checkIn)
      const end1 = new Date(reservation.checkOut)
      const start2 = new Date(other.checkIn)
      const end2 = new Date(other.checkOut)

      return start1 < end2 && start2 < end1
    })
  }

  /**
   * Navegación horizontal por días
   */
  const navigateHorizontal = (direction: "prev" | "next", days = 1) => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + (direction === "next" ? days : -days))
    setCurrentDate(newDate)
  }

  /**
   * Manejo del scroll horizontal
   */
  const handleScroll = (e: React.WheelEvent) => {
    if (e.shiftKey) {
      e.preventDefault()
      const scrollAmount = e.deltaY > 0 ? 3 : -3
      navigateHorizontal(scrollAmount > 0 ? "next" : "prev", Math.abs(scrollAmount))
    }
  }

  return (
    <div className="space-y-4">
      {/* Controles de navegación y zoom - Responsive */}
      <div className="flex flex-col gap-4">
        {/* Navegación de fechas - Oculta en móvil para ahorrar espacio */}
        {!isMobile && (
          <div className="flex-1">
            <DateNavigation currentDate={currentDate} onDateChange={setCurrentDate} />
          </div>
        )}

        {/* Controles de zoom y navegación horizontal - Adaptados para móvil */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-gray-50 p-2 rounded-lg border">
          {/* Zoom controls */}
          <div className="flex items-center gap-1 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoomLevel(Math.max(1, zoomLevel - 1))}
              disabled={zoomLevel <= 1}
              title="Alejar zoom"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>

            <Select value={zoomLevel.toString()} onValueChange={(value) => setZoomLevel(Number(value))}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(zoomConfigs).map(([level, config]) => (
                  <SelectItem key={level} value={level}>
                    {isMobile ? `${level}x` : config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoomLevel(Math.min(3, zoomLevel + 1))}
              disabled={zoomLevel >= 3}
              title="Acercar zoom"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>

          {/* Navegación horizontal rápida - Simplificada para móvil */}
          <div className="flex items-center gap-1 w-full sm:w-auto justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateHorizontal("prev", isMobile ? 3 : 7)}
              title={isMobile ? "3 días atrás" : "Semana anterior"}
            >
              <ChevronLeft className="w-4 h-4" />
              {isMobile ? "3d" : "7d"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())} title="Ir a hoy">
              <RotateCcw className="w-4 h-4" />
              {!isMobile && "Hoy"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateHorizontal("next", isMobile ? 3 : 7)}
              title={isMobile ? "3 días adelante" : "Semana siguiente"}
            >
              {isMobile ? "3d" : "7d"}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filtros rápidos - Solo en desktop */}
      {!isMobile && <QuickDateFilters onDateSelect={setCurrentDate} currentDate={currentDate} />}

      {/* Información del zoom y días visibles - Adaptada para móvil */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm flex-wrap">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded"></div>
            <span>Confirmada</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded"></div>
            <span>Pendiente</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded border border-red-700"></div>
            <span>Conflicto</span>
          </div>
        </div>
        <div className="text-xs sm:text-sm text-gray-600 flex items-center gap-2">
          <Move className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>
            {visibleDays} días ({formatDate(dates[0])} - {formatDate(dates[dates.length - 1])})
          </span>
        </div>
      </div>

      {/* Cronograma principal - Optimizado para móvil */}
      <div
        ref={scrollContainerRef}
        className="border rounded-lg overflow-hidden max-h-[70vh] sm:max-h-[600px] overflow-y-auto"
        onWheel={handleScroll}
      >
        <div
          style={{
            minWidth: `${(isMobile ? 120 : 200) + visibleDays * zoomConfigs[zoomLevel as keyof typeof zoomConfigs].minColumnWidth}px`,
          }}
        >
          {/* Header con las fechas - Adaptado para móvil */}
          <div className="bg-gray-50 border-b flex sticky top-0 z-10">
            <div
              className="p-1 sm:p-2 font-semibold border-r flex-shrink-0 bg-gray-50 text-xs sm:text-sm"
              style={{ width: isMobile ? "120px" : "200px" }}
            >
              Cabaña
            </div>
            <div className="flex flex-1 bg-gray-50">
              {dates.map((date, index) => (
                <div
                  key={index}
                  className="p-1 sm:p-2 text-center text-xs border-r last:border-r-0 flex-shrink-0"
                  style={{
                    minWidth: `${zoomConfigs[zoomLevel as keyof typeof zoomConfigs].minColumnWidth}px`,
                    width: `${zoomConfigs[zoomLevel as keyof typeof zoomConfigs].minColumnWidth}px`,
                  }}
                >
                  <div className="font-medium">{formatDayName(date)}</div>
                  <div className="text-gray-600 text-xs">{formatDate(date)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Filas de cabañas con sus reservas - Adaptadas para móvil */}
          <div className="divide-y">
            {cabins.map((cabin) => {
              const cabinReservations = getCabinReservations(cabin.name)

              return (
                <div key={cabin.id} className="flex hover:bg-gray-50 relative">
                  {/* Nombre de la cabaña - Más compacto en móvil */}
                  <div
                    className="p-1 sm:p-2 border-r flex-shrink-0 flex items-center"
                    style={{ width: isMobile ? "120px" : "200px" }}
                  >
                    <div className="font-medium text-xs sm:text-sm truncate">{cabin.name}</div>
                  </div>

                  {/* Área del cronograma */}
                  <div className="flex flex-1 relative">
                    {/* Fondo con divisiones de días */}
                    {dates.map((date, dateIndex) => (
                      <div
                        key={dateIndex}
                        className="h-6 sm:h-8 border-r last:border-r-0 flex-shrink-0"
                        style={{
                          minWidth: `${zoomConfigs[zoomLevel as keyof typeof zoomConfigs].minColumnWidth}px`,
                          width: `${zoomConfigs[zoomLevel as keyof typeof zoomConfigs].minColumnWidth}px`,
                        }}
                      />
                    ))}

                    {/* Barras de reservas - Adaptadas para móvil */}
                    {cabinReservations.map((reservation, resIndex) => {
                      const barData = getReservationBar(reservation, currentDate)
                      if (!barData) return null

                      const isConflicted = hasConflict(reservation, cabinReservations)
                      const columnWidth = zoomConfigs[zoomLevel as keyof typeof zoomConfigs].minColumnWidth

                      return (
                        <div
                          key={reservation.id}
                          className={`absolute h-4 sm:h-6 ${getStatusColor(reservation.status)} text-white text-xs px-1 sm:px-2 flex items-center cursor-pointer transition-all z-20 shadow-sm rounded-full ${isConflicted ? "border border-red-700 shadow-lg" : "border border-transparent"}
                          `}
                          style={{
                            left: `${barData.left * columnWidth}px`,
                            width: `${barData.width * columnWidth}px`,
                            top: isMobile ? "2px" : "4px",
                            background: `linear-gradient(to right, ${getStatusColor(reservation.status).replace("bg-", "").replace("hover:bg-", "")}, ${getStatusColor(reservation.status).replace("bg-", "").replace("hover:bg-", "")}90)`,
                            opacity: isConflicted ? "0.9" : "1",
                          }}
                          onClick={() => onReservationClick?.(reservation)}
                          title={`${reservation.guest} - ${reservation.guests} huéspedes (${reservation.checkIn} al ${reservation.checkOut})${isConflicted ? " - ¡CONFLICTO!" : ""}`}
                        >
                          <div className="truncate">
                            <div className="font-medium text-xs">
                              {isMobile ? reservation.guest.split(" ")[0] : reservation.guest}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Información de ayuda - Simplificada para móvil */}
      <div className="text-xs sm:text-sm text-gray-600 bg-blue-50 p-2 sm:p-3 rounded-lg">
        <p>
          <strong>📱 Móvil:</strong> Toca cualquier reserva para ver detalles. Usa los botones de navegación para
          moverte por fechas.
        </p>
        {!isMobile && (
          <>
            <p>
              <strong>🔍 Zoom:</strong> Usa los controles de zoom para ver más días (1x) o más detalles (3x).
            </p>
            <p>
              <strong>⌨️ Navegación:</strong> Usa Shift + scroll del mouse para navegar horizontalmente.
            </p>
          </>
        )}
        <p>
          <strong>🔴 Conflictos:</strong> Las reservas con borde rojo indican superposición de fechas.
        </p>
      </div>
    </div>
  )
}
