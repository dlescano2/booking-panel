"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Calendar, Eye } from "lucide-react"

interface CabinDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  cabin: any
  reservations: any[]
  onViewReservationDetails?: (reservation: any) => void
}

export function CabinDetailsModal({
  isOpen,
  onClose,
  cabin,
  reservations,
  onViewReservationDetails,
}: CabinDetailsModalProps) {
  if (!cabin) return null

  // Calcular estadísticas
  const confirmedReservations = reservations.filter((r) => r.status === "confirmada").length
  const pendingReservations = reservations.filter((r) => r.status === "pendiente").length
  const occupancyRate = reservations.length > 0 ? Math.round((confirmedReservations / reservations.length) * 100) : 0

  // Calcular ingresos totales
  const totalRevenue = reservations
    .filter((r) => r.status === "confirmada")
    .reduce((sum, r) => {
      const nights = Math.ceil((new Date(r.checkOut).getTime() - new Date(r.checkIn).getTime()) / (1000 * 60 * 60 * 24))
      return sum + nights * r.pricePerNight
    }, 0)

  // Ordenar reservas por fecha de check-in (más recientes primero)
  const sortedReservations = [...reservations].sort(
    (a, b) => new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime(),
  )

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-UY", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{cabin.name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Capacidad</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold flex items-center">
                <Users className="mr-2 h-5 w-5 text-muted-foreground" />
                {cabin.capacity} personas
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Ocupación</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
                {occupancyRate}%
              </div>
              <p className="text-xs text-muted-foreground">
                {confirmedReservations} confirmadas, {pendingReservations} pendientes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total de reservas confirmadas</p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Comodidades</h3>
          <div className="flex flex-wrap gap-2">
            {cabin.amenities.map((amenity: string, index: number) => (
              <Badge key={index} variant="outline">
                {amenity}
              </Badge>
            ))}
          </div>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="upcoming">Próximas Reservas</TabsTrigger>
            <TabsTrigger value="past">Reservas Pasadas</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <div className="rounded-md border">
              <table className="w-full caption-bottom text-sm">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="h-10 px-4 text-left font-medium">Huésped</th>
                    <th className="h-10 px-4 text-left font-medium">Check-in</th>
                    <th className="h-10 px-4 text-left font-medium">Check-out</th>
                    <th className="h-10 px-4 text-left font-medium">Estado</th>
                    <th className="h-10 px-4 text-left font-medium">Precio</th>
                    <th className="h-10 px-4 text-left font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedReservations
                    .filter((r) => new Date(r.checkIn) >= new Date())
                    .map((reservation) => (
                      <tr key={reservation.id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle font-medium">{reservation.guest}</td>
                        <td className="p-4 align-middle">{formatDate(reservation.checkIn)}</td>
                        <td className="p-4 align-middle">{formatDate(reservation.checkOut)}</td>
                        <td className="p-4 align-middle">
                          <Badge
                            variant={reservation.status === "confirmada" ? "default" : "secondary"}
                            className={
                              reservation.status === "confirmada" ? "bg-green-500" : "bg-yellow-500 text-black"
                            }
                          >
                            {reservation.status === "confirmada" ? "Confirmada" : "Pendiente"}
                          </Badge>
                        </td>
                        <td className="p-4 align-middle">${reservation.pricePerNight.toLocaleString()}/noche</td>
                        <td className="p-4 align-middle">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onViewReservationDetails && onViewReservationDetails(reservation)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Button>
                        </td>
                      </tr>
                    ))}
                  {sortedReservations.filter((r) => new Date(r.checkIn) >= new Date()).length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-muted-foreground">
                        No hay reservas próximas para esta cabaña
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="past">
            <div className="rounded-md border">
              <table className="w-full caption-bottom text-sm">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="h-10 px-4 text-left font-medium">Huésped</th>
                    <th className="h-10 px-4 text-left font-medium">Check-in</th>
                    <th className="h-10 px-4 text-left font-medium">Check-out</th>
                    <th className="h-10 px-4 text-left font-medium">Estado</th>
                    <th className="h-10 px-4 text-left font-medium">Precio</th>
                    <th className="h-10 px-4 text-left font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedReservations
                    .filter((r) => new Date(r.checkIn) < new Date())
                    .map((reservation) => (
                      <tr key={reservation.id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle font-medium">{reservation.guest}</td>
                        <td className="p-4 align-middle">{formatDate(reservation.checkIn)}</td>
                        <td className="p-4 align-middle">{formatDate(reservation.checkOut)}</td>
                        <td className="p-4 align-middle">
                          <Badge
                            variant={reservation.status === "confirmada" ? "default" : "secondary"}
                            className={
                              reservation.status === "confirmada" ? "bg-green-500" : "bg-yellow-500 text-black"
                            }
                          >
                            {reservation.status === "confirmada" ? "Confirmada" : "Pendiente"}
                          </Badge>
                        </td>
                        <td className="p-4 align-middle">${reservation.pricePerNight.toLocaleString()}/noche</td>
                        <td className="p-4 align-middle">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onViewReservationDetails && onViewReservationDetails(reservation)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Button>
                        </td>
                      </tr>
                    ))}
                  {sortedReservations.filter((r) => new Date(r.checkIn) < new Date()).length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-muted-foreground">
                        No hay reservas pasadas para esta cabaña
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
