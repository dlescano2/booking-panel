"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CabinDetailsModal } from "@/components/cabin-details-modal"
import { CabinEditModal } from "@/components/cabin-edit-modal"
import { Plus, Search, Home, Users, Wifi, Coffee, Edit, Eye } from "lucide-react"

interface CabinsSectionProps {
  cabins: any[]
  reservations: any[]
  onUpdateCabin?: (cabin: any) => void
  onCreateCabin?: (cabin: any) => void
}

export function CabinsSection({ cabins, reservations, onUpdateCabin, onCreateCabin }: CabinsSectionProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCabin, setSelectedCabin] = useState<any>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isNewCabinModalOpen, setIsNewCabinModalOpen] = useState(false)

  // Filtrar cabañas por término de búsqueda
  const filteredCabins = cabins.filter((cabin) => cabin.name.toLowerCase().includes(searchTerm.toLowerCase()))

  // Obtener reservas para una cabaña específica
  const getCabinReservations = (cabinName: string) => {
    return reservations.filter((reservation) => reservation.cabin === cabinName)
  }

  // Calcular la ocupación de una cabaña
  const calculateOccupancy = (cabinName: string) => {
    const cabinReservations = getCabinReservations(cabinName)
    // Simplificado: porcentaje de reservas confirmadas
    const confirmedReservations = cabinReservations.filter((r) => r.status === "confirmada").length
    return cabinReservations.length > 0 ? Math.round((confirmedReservations / cabinReservations.length) * 100) : 0
  }

  // Manejar la apertura del modal de detalles
  const handleViewDetails = (cabin: any) => {
    setSelectedCabin(cabin)
    setIsDetailsModalOpen(true)
  }

  // Manejar la apertura del modal de edición
  const handleEditCabin = (cabin: any) => {
    setSelectedCabin(cabin)
    setIsEditModalOpen(true)
  }

  // Manejar la apertura del modal de nueva cabaña
  const handleNewCabin = () => {
    setSelectedCabin(null)
    setIsNewCabinModalOpen(true)
  }

  // Manejar el guardado de cambios en una cabaña
  const handleSaveCabin = (updatedCabin: any) => {
    if (onUpdateCabin) {
      onUpdateCabin(updatedCabin)
    }
    setIsEditModalOpen(false)
  }

  // Manejar la creación de una nueva cabaña
  const handleCreateCabin = (newCabin: any) => {
    if (onCreateCabin) {
      onCreateCabin(newCabin)
    }
    setIsNewCabinModalOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Cabañas</h2>
          <p className="text-gray-600">Administra todas las cabañas del complejo</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Buscar cabañas..."
              className="pl-8 w-full md:w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={handleNewCabin}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Cabaña
          </Button>
        </div>
      </div>

      <Tabs defaultValue="grid" className="space-y-4">
        <TabsList>
          <TabsTrigger value="grid">Vista Cuadrícula</TabsTrigger>
          <TabsTrigger value="list">Vista Lista</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCabins.map((cabin) => (
              <Card key={cabin.id} className="overflow-hidden">
                <div className="h-32 bg-gray-200 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Home className="h-12 w-12 text-gray-400" />
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{cabin.name}</CardTitle>
                  <CardDescription className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    Capacidad: {cabin.capacity} personas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {cabin.amenities.slice(0, 3).map((amenity: string, index: number) => (
                      <Badge key={index} variant="outline" className="bg-gray-100">
                        {amenity === "WiFi" ? <Wifi className="h-3 w-3 mr-1" /> : <Coffee className="h-3 w-3 mr-1" />}
                        {amenity}
                      </Badge>
                    ))}
                    {cabin.amenities.length > 3 && (
                      <Badge variant="outline" className="bg-gray-100">
                        +{cabin.amenities.length - 3} más
                      </Badge>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Ocupación: {calculateOccupancy(cabin.name)}%</p>
                      <p className="text-sm text-gray-500">Reservas: {getCabinReservations(cabin.name).length}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleViewDetails(cabin)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEditCabin(cabin)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <table className="w-full caption-bottom text-sm">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="h-10 px-4 text-left font-medium">Nombre</th>
                      <th className="h-10 px-4 text-left font-medium">Capacidad</th>
                      <th className="h-10 px-4 text-left font-medium">Comodidades</th>
                      <th className="h-10 px-4 text-left font-medium">Ocupación</th>
                      <th className="h-10 px-4 text-left font-medium">Reservas</th>
                      <th className="h-10 px-4 text-left font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCabins.map((cabin) => (
                      <tr key={cabin.id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle font-medium">{cabin.name}</td>
                        <td className="p-4 align-middle">{cabin.capacity} personas</td>
                        <td className="p-4 align-middle">
                          <div className="flex flex-wrap gap-1">
                            {cabin.amenities.slice(0, 2).map((amenity: string, index: number) => (
                              <Badge key={index} variant="outline" className="bg-gray-100">
                                {amenity}
                              </Badge>
                            ))}
                            {cabin.amenities.length > 2 && (
                              <Badge variant="outline" className="bg-gray-100">
                                +{cabin.amenities.length - 2}
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="p-4 align-middle">{calculateOccupancy(cabin.name)}%</td>
                        <td className="p-4 align-middle">{getCabinReservations(cabin.name).length}</td>
                        <td className="p-4 align-middle">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleViewDetails(cabin)}>
                              <Eye className="h-4 w-4 mr-1" />
                              Ver
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleEditCabin(cabin)}>
                              <Edit className="h-4 w-4 mr-1" />
                              Editar
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de detalles de cabaña */}
      <CabinDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        cabin={selectedCabin}
        reservations={selectedCabin ? getCabinReservations(selectedCabin.name) : []}
      />

      {/* Modal de edición de cabaña */}
      <CabinEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        cabin={selectedCabin}
        onSave={handleSaveCabin}
        mode="edit"
      />

      {/* Modal de nueva cabaña */}
      <CabinEditModal
        isOpen={isNewCabinModalOpen}
        onClose={() => setIsNewCabinModalOpen(false)}
        onSave={handleCreateCabin}
        mode="create"
      />
    </div>
  )
}
