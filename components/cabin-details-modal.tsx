"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, Users, Wifi, ChefHat, Flame, MapPin, Calendar, Phone, Eye } from "lucide-react"

interface Cabin {
  id: number
  name: string
  capacity: number
  amenities: string[]
}

interface CabinDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  cabin: Cabin | null
  reservations: any[]
  onViewReservation: (reservation: any) => void
}

export function CabinDetailsModal({ isOpen, onClose, cabin, reservations, onViewReservation }: CabinDetailsModalProps) {
  if (!cabin) return null

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "wifi":
        return <Wifi className="w-4 h-4" />
      case "cocina":
        return <ChefHat className="w-4 h-4" />
      case "chimenea":
        return <Flame className="w-4 h-4" />
      default:
        return <MapPin className="w-4 h-4" />
    }
  }

  const cabinReservations = reservations.filter((r) => r.cabin === cabin.name)
  const activeReservations = cabinReservations.filter((r) => r.status === "confirmada")
  const pendingReservations = cabinReservations.filter((r) => r.status === "pendiente")

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmada":
        return <Badge className="bg-green-100 text-green-800">Confirmada</Badge>
      case "pendiente":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
      case "cancelada":
        return <Badge variant="destructive">Cancelada</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Home className="w-5 h-5" />
            {cabin.name}
          </DialogTitle>
          <DialogDescription>Información detallada de la cabaña y sus reservas</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información básica de la cabaña */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700">Capacidad Máxima</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold">{cabin.capacity} huéspedes</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Total Reservas</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold">{cabinReservations.length} reservas</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-2">Comodidades</h4>
                <div className="flex flex-wrap gap-2">
                  {cabin.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-1 text-sm bg-blue-50 px-3 py-1 rounded-full">
                      {getAmenityIcon(amenity)}
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estadísticas de ocupación */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Reservas Confirmadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{activeReservations.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Reservas Pendientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{pendingReservations.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Tasa de Ocupación</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {cabinReservations.length > 0
                    ? Math.round((activeReservations.length / cabinReservations.length) * 100)
                    : 0}
                  %
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lista de reservas */}
          {cabinReservations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Reservas de esta Cabaña</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {cabinReservations
                    .sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime())
                    .map((reservation) => (
                      <div
                        key={reservation.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{reservation.guest}</span>
                            {getStatusBadge(reservation.status)}
                          </div>
                          <div className="text-sm text-gray-600 flex items-center gap-4">
                            <span>
                              {formatDate(reservation.checkIn)} - {formatDate(reservation.checkOut)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {reservation.guests} huéspedes
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {reservation.phone}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewReservation(reservation)}
                          className="ml-2"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Ver
                        </Button>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
