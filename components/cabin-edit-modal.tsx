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
import { Checkbox } from "@/components/ui/checkbox"
import { Home, Plus, X } from "lucide-react"

interface Cabin {
  id: number
  name: string
  capacity: number
  amenities: string[]
}

interface CabinEditModalProps {
  isOpen: boolean
  onClose: () => void
  cabin: Cabin | null
  onSave: (cabin: Cabin) => void
}

const availableAmenities = [
  "WiFi",
  "Cocina",
  "Chimenea",
  "Jacuzzi",
  "Parrilla",
  "Vista al lago",
  "Vista panorámica",
  "Jardín",
  "Jardín privado",
  "Deck",
  "Pesca",
  "Hamacas",
  "Fogón",
  "Terraza",
  "2 Baños",
  "Sala de juegos",
  "Patio grande",
  "Cama king",
  "Sauna",
  "Oficina",
  "Equipos deportivos",
  "Spa",
  "Jardín zen",
  "Decoración rústica",
  "Smart TV",
  "Domótica",
]

export function CabinEditModal({ isOpen, onClose, cabin, onSave }: CabinEditModalProps) {
  const [formData, setFormData] = useState<Cabin>({
    id: 0,
    name: "",
    capacity: 1,
    amenities: [],
  })

  const [customAmenity, setCustomAmenity] = useState("")

  useEffect(() => {
    if (cabin && isOpen) {
      setFormData(cabin)
    }
  }, [cabin, isOpen])

  const handleSave = () => {
    onSave(formData)
    onClose()
  }

  const handleAmenityToggle = (amenity: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, amenity],
      })
    } else {
      setFormData({
        ...formData,
        amenities: formData.amenities.filter((a) => a !== amenity),
      })
    }
  }

  const handleAddCustomAmenity = () => {
    if (customAmenity.trim() && !formData.amenities.includes(customAmenity.trim())) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, customAmenity.trim()],
      })
      setCustomAmenity("")
    }
  }

  const handleRemoveAmenity = (amenity: string) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.filter((a) => a !== amenity),
    })
  }

  if (!cabin) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Home className="w-5 h-5" />
            Editar Cabaña
          </DialogTitle>
          <DialogDescription>Modifica la información de la cabaña</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre de la Cabaña</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej: Cabaña del Bosque"
            />
          </div>

          <div>
            <Label htmlFor="capacity">Capacidad Máxima</Label>
            <Input
              id="capacity"
              type="number"
              min="1"
              max="20"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: Number.parseInt(e.target.value) || 1 })}
            />
          </div>

          <div>
            <Label>Comodidades Seleccionadas</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.amenities.map((amenity) => (
                <div
                  key={amenity}
                  className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                >
                  {amenity}
                  <button
                    type="button"
                    onClick={() => handleRemoveAmenity(amenity)}
                    className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Comodidades Disponibles</Label>
            <div className="mt-2 grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded p-2">
              {availableAmenities.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={amenity}
                    checked={formData.amenities.includes(amenity)}
                    onCheckedChange={(checked) => handleAmenityToggle(amenity, checked as boolean)}
                  />
                  <Label htmlFor={amenity} className="text-sm">
                    {amenity}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Agregar Comodidad Personalizada</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={customAmenity}
                onChange={(e) => setCustomAmenity(e.target.value)}
                placeholder="Ej: Piscina privada"
                onKeyPress={(e) => e.key === "Enter" && handleAddCustomAmenity()}
              />
              <Button type="button" variant="outline" onClick={handleAddCustomAmenity}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Guardar Cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
