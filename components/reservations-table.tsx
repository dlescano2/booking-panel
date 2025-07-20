"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Edit, Trash2, Phone } from "lucide-react"
import { ReservationModal } from "@/components/reservation-modal"
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal"

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

interface ReservationsTableProps {
  reservations: Reservation[]
  onUpdateReservation: (id: number, reservation: Partial<Reservation>) => void
  onDeleteReservation: (id: number) => void
  cabins: Array<{ id: number; name: string; capacity: number }>
}

export function ReservationsTable({
  reservations,
  onUpdateReservation,
  onDeleteReservation,
  cabins,
}: ReservationsTableProps) {
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [modalMode, setModalMode] = useState<"view" | "edit" | "create">("view")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [reservationToDelete, setReservationToDelete] = useState<Reservation | null>(null)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmada":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Confirmada
          </Badge>
        )
      case "pendiente":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Pendiente
          </Badge>
        )
      case "cancelada":
        return <Badge variant="destructive">Cancelada</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const calculateNights = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const handleView = (reservation: Reservation) => {
    setSelectedReservation(reservation)
    setModalMode("view")
    setIsModalOpen(true)
  }

  const handleEdit = (reservation: Reservation) => {
    setSelectedReservation(reservation)
    setModalMode("edit")
    setIsModalOpen(true)
  }

  const handleDelete = (reservation: Reservation) => {
    setReservationToDelete(reservation)
    setIsDeleteModalOpen(true)
  }

  const handleSave = (updatedReservation: Partial<Reservation>) => {
    if (selectedReservation) {
      onUpdateReservation(selectedReservation.id, updatedReservation)
    }
  }

  const handleConfirmDelete = () => {
    if (reservationToDelete) {
      onDeleteReservation(reservationToDelete.id)
    }
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cabaña</TableHead>
              <TableHead>Huésped</TableHead>
              <TableHead>Check-in</TableHead>
              <TableHead>Check-out</TableHead>
              <TableHead>Noches</TableHead>
              <TableHead>Huéspedes</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell className="font-medium">{reservation.cabin}</TableCell>
                <TableCell>{reservation.guest}</TableCell>
                <TableCell>{formatDate(reservation.checkIn)}</TableCell>
                <TableCell>{formatDate(reservation.checkOut)}</TableCell>
                <TableCell>{calculateNights(reservation.checkIn, reservation.checkOut)}</TableCell>
                <TableCell>{reservation.guests}</TableCell>
                <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                    <Phone className="w-4 h-4 mr-1" />
                    {reservation.phone}
                  </Button>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleView(reservation)} title="Ver detalles">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(reservation)} title="Editar reserva">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(reservation)}
                      title="Eliminar reserva"
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ReservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        reservation={selectedReservation}
        mode={modalMode}
        onSave={handleSave}
        cabins={cabins}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        reservationGuest={reservationToDelete?.guest || ""}
        cabin={reservationToDelete?.cabin || ""}
      />
    </>
  )
}
