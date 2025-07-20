"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, User, Phone, Mail, Calendar, Users } from "lucide-react"

interface Client {
  name: string
  phone: string
  email?: string
  totalReservations: number
  lastVisit: string
  lastCabin: string
  lastGuests: number
}

interface ClientSearchModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectClient: (client: Client) => void
  reservations: any[]
}

export function ClientSearchModal({ isOpen, onClose, onSelectClient, reservations }: ClientSearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("")

  // Extraer clientes únicos de las reservas
  const getUniqueClients = (): Client[] => {
    const clientMap = new Map<string, Client>()

    reservations.forEach((reservation) => {
      const key = reservation.phone // Usar teléfono como clave única

      if (clientMap.has(key)) {
        const existing = clientMap.get(key)!
        existing.totalReservations += 1

        // Actualizar con la reserva más reciente
        if (new Date(reservation.checkOut) > new Date(existing.lastVisit)) {
          existing.lastVisit = reservation.checkOut
          existing.lastCabin = reservation.cabin
          existing.lastGuests = reservation.guests
          existing.name = reservation.guest // Por si cambió el nombre
          if (reservation.email) existing.email = reservation.email
        }
      } else {
        clientMap.set(key, {
          name: reservation.guest,
          phone: reservation.phone,
          email: reservation.email,
          totalReservations: 1,
          lastVisit: reservation.checkOut,
          lastCabin: reservation.cabin,
          lastGuests: reservation.guests,
        })
      }
    })

    return Array.from(clientMap.values()).sort(
      (a, b) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime(),
    )
  }

  const clients = getUniqueClients()

  // Filtrar clientes según el término de búsqueda
  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm) ||
      (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleSelectClient = (client: Client) => {
    onSelectClient(client)
    onClose()
    setSearchTerm("") // Limpiar búsqueda
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Buscar Cliente Existente
          </DialogTitle>
          <DialogDescription>
            Selecciona un cliente anterior para cargar automáticamente su información
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          {/* Buscador */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por nombre, teléfono o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Lista de clientes */}
          <div className="flex-1 overflow-y-auto space-y-2">
            {filteredClients.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <User className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No se encontraron clientes</p>
                {searchTerm && <p className="text-sm">Intenta con otro término de búsqueda</p>}
              </div>
            ) : (
              filteredClients.map((client, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleSelectClient(client)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <h3 className="font-medium">{client.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {client.totalReservations} reserva{client.totalReservations !== 1 ? "s" : ""}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {client.phone}
                        </div>
                        {client.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {client.email}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Última visita: {formatDate(client.lastVisit)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {client.lastGuests} huéspedes en {client.lastCabin}
                        </div>
                      </div>
                    </div>

                    <Button variant="outline" size="sm">
                      Seleccionar
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-gray-600">
            {filteredClients.length} cliente{filteredClients.length !== 1 ? "s" : ""} encontrado
            {filteredClients.length !== 1 ? "s" : ""}
          </div>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
