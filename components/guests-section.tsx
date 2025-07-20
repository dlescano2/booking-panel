"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Users, Search, Phone, Mail, Calendar } from "lucide-react"
import { useState } from "react"

interface GuestsSectionProps {
  reservations: any[]
}

export function GuestsSection({ reservations }: GuestsSectionProps) {
  const [searchTerm, setSearchTerm] = useState("")

  // Extraer huéspedes únicos de las reservas
  const guests = reservations.reduce((acc, reservation) => {
    const existingGuest = acc.find((g: any) => g.phone === reservation.phone)
    if (!existingGuest) {
      acc.push({
        id: reservation.id,
        name: reservation.guest,
        phone: reservation.phone,
        email: reservation.email || "",
        totalReservations: 1,
        lastVisit: reservation.checkOut,
        status: reservation.status,
        cabin: reservation.cabin,
      })
    } else {
      existingGuest.totalReservations += 1
      if (new Date(reservation.checkOut) > new Date(existingGuest.lastVisit)) {
        existingGuest.lastVisit = reservation.checkOut
        existingGuest.status = reservation.status
        existingGuest.cabin = reservation.cabin
      }
    }
    return acc
  }, [])

  const filteredGuests = guests.filter(
    (guest: any) =>
      guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.phone.includes(searchTerm) ||
      guest.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Huéspedes</h2>
          <p className="text-gray-600">Base de datos de huéspedes del complejo</p>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Huéspedes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{guests.length}</div>
            <p className="text-xs text-muted-foreground">Huéspedes únicos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Huéspedes Recurrentes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{guests.filter((g: any) => g.totalReservations > 1).length}</div>
            <p className="text-xs text-muted-foreground">Con múltiples reservas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio Reservas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(reservations.length / guests.length).toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Por huésped</p>
          </CardContent>
        </Card>
      </div>

      {/* Búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Huéspedes</CardTitle>
          <CardDescription>Busca y gestiona la información de los huéspedes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre, teléfono o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Total Reservas</TableHead>
                  <TableHead>Última Visita</TableHead>
                  <TableHead>Estado Actual</TableHead>
                  <TableHead>Última Cabaña</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGuests.map((guest: any) => (
                  <TableRow key={guest.id}>
                    <TableCell className="font-medium">{guest.name}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="w-3 h-3" />
                          {guest.phone}
                        </div>
                        {guest.email && (
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Mail className="w-3 h-3" />
                            {guest.email}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {guest.totalReservations} reserva{guest.totalReservations !== 1 ? "s" : ""}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(guest.lastVisit)}</TableCell>
                    <TableCell>
                      <Badge variant={guest.status === "confirmada" ? "default" : "secondary"}>
                        {guest.status === "confirmada" ? "Confirmada" : "Pendiente"}
                      </Badge>
                    </TableCell>
                    <TableCell>{guest.cabin}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
