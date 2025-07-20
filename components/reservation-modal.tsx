"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { ClientSearchModal } from "@/components/client-search-modal"
import { CalendarDays, Users, Phone, MapPin, UserPlus, FileText, DollarSign, CreditCard, Edit } from "lucide-react"

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
  pricePerNight?: number
  hasDeposit?: boolean
  depositAmount?: number
}

interface ReservationModalProps {
  isOpen: boolean
  onClose: () => void
  reservation?: Reservation | null
  mode: "view" | "edit" | "create"
  onSave: (reservation: Partial<Reservation>) => void
  onEdit?: () => void
  cabins: Array<{ id: number; name: string; capacity: number }>
  reservations?: Reservation[]
}

export function ReservationModal({
  isOpen,
  onClose,
  reservation,
  mode,
  onSave,
  onEdit,
  cabins,
  reservations,
}: ReservationModalProps) {
  const [formData, setFormData] = useState<Partial<Reservation>>(
    reservation || {
      cabin: "",
      guest: "",
      checkIn: "",
      checkOut: "",
      status: "pendiente",
      guests: 1,
      phone: "",
      email: "",
      notes: "",
      pricePerNight: 0,
      hasDeposit: false,
      depositAmount: 0,
    },
  )

  const [isClientSearchOpen, setIsClientSearchOpen] = useState(false)

  useEffect(() => {
    if (mode === "create" && isOpen) {
      // Limpiar formulario cuando se abre en modo create
      setFormData({
        cabin: "",
        guest: "",
        checkIn: "",
        checkOut: "",
        status: "pendiente",
        guests: 1,
        phone: "",
        email: "",
        notes: "",
        pricePerNight: 0,
        hasDeposit: false,
        depositAmount: 0,
      })
    } else if (reservation && isOpen) {
      // Cargar datos de la reserva si existe
      setFormData(reservation)
    }
  }, [mode, isOpen, reservation])

  const handleSelectClient = (client: any) => {
    setFormData({
      ...formData,
      guest: client.name,
      phone: client.phone,
      email: client.email || "",
      guests: client.lastGuests,
    })
  }

  const handleSave = () => {
    onSave(formData)

    // Limpiar el formulario solo si es modo "create"
    if (mode === "create") {
      setFormData({
        cabin: "",
        guest: "",
        checkIn: "",
        checkOut: "",
        status: "pendiente",
        guests: 1,
        phone: "",
        email: "",
        notes: "",
        pricePerNight: 0,
        hasDeposit: false,
        depositAmount: 0,
      })
    }

    onClose()
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

  const calculateNights = () => {
    if (formData.checkIn && formData.checkOut) {
      const start = new Date(formData.checkIn)
      const end = new Date(formData.checkOut)
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays
    }
    return 0
  }

  const calculateTotalPrice = () => {
    const nights = calculateNights()
    const pricePerNight = formData.pricePerNight || 0
    return nights * pricePerNight
  }

  const calculatePendingAmount = () => {
    const total = calculateTotalPrice()
    const deposit = formData.hasDeposit ? formData.depositAmount || 0 : 0
    return total - deposit
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getTitle = () => {
    switch (mode) {
      case "create":
        return "Nueva Reserva"
      case "edit":
        return "Editar Reserva"
      case "view":
        return "Detalles de la Reserva"
      default:
        return "Reserva"
    }
  }

  // Opciones de estado según el modo
  const getStatusOptions = () => {
    if (mode === "create") {
      // Para nuevas reservas, solo pendiente y confirmada
      return [
        { value: "pendiente", label: "Pendiente" },
        { value: "confirmada", label: "Confirmada" },
      ]
    } else {
      // Para editar, todas las opciones
      return [
        { value: "pendiente", label: "Pendiente" },
        { value: "confirmada", label: "Confirmada" },
        { value: "cancelada", label: "Cancelada" },
      ]
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5" />
            {getTitle()}
          </DialogTitle>
          <DialogDescription>
            {mode === "view" && "Información detallada de la reserva"}
            {mode === "edit" && "Modifica los datos de la reserva"}
            {mode === "create" && "Completa los datos para crear una nueva reserva"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {mode === "view" ? (
            // Vista de solo lectura
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Cabaña</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{formData.cabin}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Estado</Label>
                  <div className="mt-1">{getStatusBadge(formData.status || "")}</div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-500">Huésped Principal</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">{formData.guest}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Check-in</Label>
                  <p className="mt-1 font-medium">
                    {formData.checkIn ? new Date(formData.checkIn).toLocaleDateString("es-AR") : "-"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Check-out</Label>
                  <p className="mt-1 font-medium">
                    {formData.checkOut ? new Date(formData.checkOut).toLocaleDateString("es-AR") : "-"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Noches</Label>
                  <p className="mt-1 font-medium">{calculateNights()}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Número de Huéspedes</Label>
                  <p className="mt-1 font-medium">{formData.guests}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Teléfono</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{formData.phone}</span>
                  </div>
                </div>
              </div>

              {formData.email && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">Email</Label>
                  <p className="mt-1 font-medium">{formData.email}</p>
                </div>
              )}

              {/* Información de precios */}
              {(formData.pricePerNight || 0) > 0 && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-800 mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Información de Precios
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-green-700">Precio por noche:</span>
                      <p className="font-bold text-green-800">{formatCurrency(formData.pricePerNight || 0)}</p>
                    </div>
                    <div>
                      <span className="text-green-700">Total estadía ({calculateNights()} noches):</span>
                      <p className="font-bold text-green-800 text-lg">{formatCurrency(calculateTotalPrice())}</p>
                    </div>
                    {formData.hasDeposit && (
                      <>
                        <div>
                          <span className="text-green-700">Seña recibida:</span>
                          <p className="font-bold text-green-800">{formatCurrency(formData.depositAmount || 0)}</p>
                        </div>
                        <div>
                          <span className="text-green-700">Saldo pendiente:</span>
                          <p className="font-bold text-green-800">{formatCurrency(calculatePendingAmount())}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {formData.notes && (
                <div>
                  <Label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Notas
                  </Label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <p className="text-gray-700 whitespace-pre-wrap">{formData.notes}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Formulario editable
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cabin">Cabaña</Label>
                  <Select value={formData.cabin} onValueChange={(value) => setFormData({ ...formData, cabin: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una cabaña" />
                    </SelectTrigger>
                    <SelectContent>
                      {cabins.map((cabin) => (
                        <SelectItem key={cabin.id} value={cabin.name}>
                          {cabin.name} (Cap. {cabin.capacity})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Estado</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getStatusOptions().map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="guest">Huésped Principal</Label>
                <div className="flex gap-2">
                  <Input
                    id="guest"
                    value={formData.guest}
                    onChange={(e) => setFormData({ ...formData, guest: e.target.value })}
                    placeholder="Nombre completo del huésped"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsClientSearchOpen(true)}
                    title="Buscar cliente existente"
                    className="px-3"
                  >
                    <UserPlus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="checkIn">Check-in</Label>
                  <Input
                    id="checkIn"
                    type="date"
                    value={formData.checkIn}
                    onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="checkOut">Check-out</Label>
                  <Input
                    id="checkOut"
                    type="date"
                    value={formData.checkOut}
                    onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="guests">Número de Huéspedes</Label>
                  <Input
                    id="guests"
                    type="number"
                    min="1"
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: Number.parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+54 11 1234-5678"
                  />
                </div>
                <div>
                  <Label htmlFor="pricePerNight">Precio por Noche</Label>
                  <Input
                    id="pricePerNight"
                    type="number"
                    min="0"
                    step="100"
                    value={formData.pricePerNight || ""}
                    onChange={(e) => setFormData({ ...formData, pricePerNight: Number(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email (opcional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@ejemplo.com"
                />
              </div>

              {/* Sección de seña */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="hasDeposit"
                    checked={formData.hasDeposit || false}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        hasDeposit: checked,
                        depositAmount: checked ? formData.depositAmount : 0,
                      })
                    }
                  />
                  <Label htmlFor="hasDeposit" className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Recibió seña
                  </Label>
                </div>

                {formData.hasDeposit && (
                  <div>
                    <Label htmlFor="depositAmount">Monto de la Seña</Label>
                    <Input
                      id="depositAmount"
                      type="number"
                      min="0"
                      step="100"
                      value={formData.depositAmount || ""}
                      onChange={(e) => setFormData({ ...formData, depositAmount: Number(e.target.value) || 0 })}
                      placeholder="0"
                    />
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="notes">Notas (opcional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes || ""}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Información adicional sobre la reserva..."
                  rows={3}
                />
              </div>

              {/* Resumen de precios */}
              {calculateNights() > 0 && (formData.pricePerNight || 0) > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Resumen de Precios
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-700">
                        {calculateNights()} noches × {formatCurrency(formData.pricePerNight || 0)}:
                      </span>
                      <span className="font-bold text-blue-800">{formatCurrency(calculateTotalPrice())}</span>
                    </div>
                    {formData.hasDeposit && (formData.depositAmount || 0) > 0 && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Seña recibida:</span>
                          <span className="font-bold text-green-600">
                            -{formatCurrency(formData.depositAmount || 0)}
                          </span>
                        </div>
                        <div className="border-t border-blue-200 pt-2 flex justify-between">
                          <span className="text-blue-700 font-medium">Saldo pendiente:</span>
                          <span className="font-bold text-blue-800 text-lg">
                            {formatCurrency(calculatePendingAmount())}
                          </span>
                        </div>
                      </>
                    )}
                    {!formData.hasDeposit && (
                      <div className="border-t border-blue-200 pt-2 flex justify-between">
                        <span className="text-blue-700 font-medium">Total a cobrar:</span>
                        <span className="font-bold text-blue-800 text-lg">{formatCurrency(calculateTotalPrice())}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto bg-transparent">
            {mode === "view" ? "Cerrar" : "Cancelar"}
          </Button>
          {mode === "view" && onEdit && (
            <Button onClick={onEdit} variant="default" className="w-full sm:w-auto">
              <Edit className="w-4 h-4 mr-2" />
              Editar Reserva
            </Button>
          )}
          {mode !== "view" && (
            <Button onClick={handleSave} className="w-full sm:w-auto">
              {mode === "create" ? "Crear Reserva" : "Guardar Cambios"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
      <ClientSearchModal
        isOpen={isClientSearchOpen}
        onClose={() => setIsClientSearchOpen(false)}
        onSelectClient={handleSelectClient}
        reservations={reservations || []}
      />
    </Dialog>
  )
}
