"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { X, Plus } from "lucide-react"

interface Cabin {
  id: number
  name: string
  capacity: number
  amenities: string[]
  description: string
}

interface CabinEditModalProps {
  isOpen: boolean
  onClose: () => void
  cabin?: Cabin
  onSave: (cabin: Cabin) => void
  mode: "edit" | "create"
}

export function CabinEditModal({ isOpen, onClose, cabin, onSave, mode = "edit" }: CabinEditModalProps) {
  const [name, setName] = useState("")
  const [capacity, setCapacity] = useState("")
  const [amenities, setAmenities] = useState<string[]>([])
  const [newAmenity, setNewAmenity] = useState("")
  const [description, setDescription] = useState("")
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Cargar datos de la cabaña cuando se abre el modal
  useEffect(() => {
    if (cabin && mode === "edit") {
      setName(cabin.name || "")
      setCapacity(cabin.capacity?.toString() || "")
      setAmenities(cabin.amenities || [])
      setDescription(cabin.description || "")
    } else if (mode === "create") {
      // Valores por defecto para nueva cabaña
      setName("")
      setCapacity("")
      setAmenities(["WiFi"])
      setDescription("")
    }
  }, [cabin, isOpen, mode])

  // Agregar una nueva comodidad
  const handleAddAmenity = () => {
    if (newAmenity.trim() && !amenities.includes(newAmenity.trim())) {
      setAmenities([...amenities, newAmenity.trim()])
      setNewAmenity("")
    }
  }

  // Eliminar una comodidad
  const handleRemoveAmenity = (amenity: string) => {
    setAmenities(amenities.filter((a) => a !== amenity))
  }

  // Validar el formulario
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!name.trim()) {
      newErrors.name = "El nombre es obligatorio"
    }

    const capacityNum = Number.parseInt(capacity)
    if (isNaN(capacityNum) || capacityNum <= 0) {
      newErrors.capacity = "La capacidad debe ser un número mayor a 0"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Guardar cambios
  const handleSave = () => {
    if (!validateForm()) return

    const updatedCabin = {
      ...(cabin || {}),
      name,
      capacity: Number.parseInt(capacity),
      amenities,
      description,
    }

    onSave(updatedCabin)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Editar Cabaña" : "Nueva Cabaña"}</DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Modifica los detalles de la cabaña. Haz clic en guardar cuando termines."
              : "Completa los detalles para crear una nueva cabaña."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nombre
            </Label>
            <div className="col-span-3">
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre de la cabaña"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="capacity" className="text-right">
              Capacidad
            </Label>
            <div className="col-span-3">
              <Input
                id="capacity"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="Número de personas"
                type="number"
                min="1"
                className={errors.capacity ? "border-red-500" : ""}
              />
              {errors.capacity && <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>}
            </div>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="amenities" className="text-right pt-2">
              Comodidades
            </Label>
            <div className="col-span-3 space-y-2">
              <div className="flex flex-wrap gap-2">
                {amenities.map((amenity, index) => (
                  <Badge key={index} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                    {amenity}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0 rounded-full"
                      onClick={() => handleRemoveAmenity(amenity)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  id="amenities"
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  placeholder="Agregar comodidad"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddAmenity()
                    }
                  }}
                />
                <Button type="button" size="sm" onClick={handleAddAmenity}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right pt-2">
              Descripción
            </Label>
            <div className="col-span-3">
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descripción detallada de la cabaña"
                rows={4}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>{mode === "edit" ? "Guardar Cambios" : "Crear Cabaña"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
