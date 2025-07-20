"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Home, Users, Wifi, ChefHat, Flame, Eye, MapPin, Plus } from "lucide-react"
import { CabinDetailsModal } from "@/components/cabin-details-modal"
import { CabinEditModal } from "@/components/cabin-edit-modal"
import { useState } from "react"

interface Cabin {
  id: number
  name: string
  capacity: number
  amenities: string[]
}

interface CabinsSectionProps {
  cabins: Cabin[]
  reservations: any[]
}

export function CabinsSection({ cabins, reservations }: CabinsSectionProps) {
  const [selectedCabin, setSelectedCabin] = useState<Cabin | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

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

  const getCabinOccupancy = (cabinName: string) => {
    const cabinReservations = reservations.filter((r) => r.cabin === cabinName && r.status === "confirmada")
    return cabinReservations.length
  }

  const getCabinStatus = (cabinName: string) => {
    const today = new Date().toISOString().split("T")[0]
    const currentReservation = reservations.find(
      (r) => r.cabin === cabinName && r.checkIn <= today && r.checkOut > today && r.status === "confirmada",
    )

    return currentReservation ? "ocupada" : "disponible"
  }

  const handleViewDetails = (cabin: Cabin) => {
    setSelectedCabin(cabin)
    setIsDetailsModalOpen(true)
  }

  const handleEditCabin = (cabin: Cabin) => {
    setSelectedCabin(cabin)
    setIsEditModalOpen(true)
  }

  const handleSaveCabin = (updatedCabin: Cabin) => {
    // Here you would typically update the cabin in your state/database
    console.log("Cabin updated:", updatedCabin)
  }

  const handleViewReservation = (reservation: any) => {
    // This would open the reservation details modal
    console.log("View reservation:", reservation)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Cabañas</h2>
          <p className="text-gray-600">Administra las cabañas del complejo</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Cabaña
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cabins.map((cabin) => {
          const status = getCabinStatus(cabin.name)
          const occupancy = getCabinOccupancy(cabin.name)

          return (
            <Card key={cabin.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Home className="w-5 h-5" />
                    {cabin.name}
                  </CardTitle>
                  <Badge variant={status === "disponible" ? "default" : "secondary"}>
                    {status === "disponible" ? "Disponible" : "Ocupada"}
                  </Badge>
                </div>
                <CardDescription>Capacidad máxima: {cabin.capacity} huéspedes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Comodidades</h4>
                  <div className="flex flex-wrap gap-2">
                    {cabin.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-1 text-sm bg-gray-100 px-2 py-1 rounded">
                        {getAmenityIcon(amenity)}
                        {amenity}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {occupancy} reservas activas
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => handleViewDetails(cabin)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Ver Detalles
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => handleEditCabin(cabin)}
                  >
                    Editar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
      <CabinDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        cabin={selectedCabin}
        reservations={reservations}
        onViewReservation={handleViewReservation}
      />

      <CabinEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        cabin={selectedCabin}
        onSave={handleSaveCabin}
      />
    </div>
  )
}
